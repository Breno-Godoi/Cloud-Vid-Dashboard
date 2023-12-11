// Global variable to track chart visibility
let chartVisible = false;

function toggleChartVisibility() {
    chartVisible = !chartVisible;
    let chartContainer = document.getElementById("map-chart");
    chartContainer.style.display = chartVisible ? "block" : "none";

    if (chartVisible) {
        // Process and visualize the data only if the chart is not already created
        if (!chartContainer.hasChildNodes()) {
            createChart();
        }
    } else {
        // Clear the chart when hiding
        chartContainer.innerHTML = "";
    }
}

function createChart() {
    // Remove any existing SVG to redraw on resize
    d3.select("#map-chart svg").remove();

    // Get the width of the container
    let containerWidth = document.getElementById('map-chart').clientWidth;

    // Chart dimensions and margins
    let margin = { top: 20, right: 30, bottom: 40, left: 90 },
        width = containerWidth - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // Append the svg object to the chart container
    const svg = d3.select("#map-chart")
        .append("svg")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Assuming 'top100data' is an array of objects from your CSV file
    let countryCounts = d3.rollup(top100data, v => v.length, d => d.Country);

    // Convert the Map to an array of objects
    let data = Array.from(countryCounts, ([Country, Count]) => ({Country, Count}));

    // Add X axis
    let x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Count)])
        .range([0, width]);
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Y axis
    let y = d3.scaleBand()
        .range([0, height])
        .domain(data.map(d => d.Country))
        .padding(.1);
    svg.append("g")
        .call(d3.axisLeft(y))

    // Bars
    svg.selectAll("myRect")
        .data(data)
        .join("rect")
        .attr("x", x(0))
        .attr("y", d => y(d.Country))
        .attr("width", d => x(d.Count))
        .attr("height", y.bandwidth())
        .attr("fill", "#69b3a2");
}

// Initially hide the chart
document.getElementById("map-chart").style.display = "none";

// Redraw chart on window resize
window.addEventListener("resize", function() {
    if (chartVisible) {
        createChart();
    }
});
