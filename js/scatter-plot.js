let scatterChartVisible = false;

function createResponsiveScatterPlot() {
    scatterChartVisible = !scatterChartVisible;
    let chartContainer = document.getElementById("scatter-plot");
    chartContainer.style.display = scatterChartVisible ? "flex" : "none";
    chartContainer.style.flexDirection = scatterChartVisible ? "row" : "none";
    chartContainer.style.flexWrap = scatterChartVisible ? "wrap" : "none";

    if (scatterChartVisible) {

        // Extract necessary columns and scale Views and ViewsAvg
        const extractedData = top100data.map(entry => ({
            Views: +entry.Views / 1000000, // Divide Views by 1 million
            ViewsAvg: +entry['ViewsAvg.'] / 10000000, // Divide ViewsAvg by 10 million
            ChannelName: entry.ChannelName
        }));

        // Sort the data based on Views and ViewsAvg in ascending order
        const sortedData = extractedData.sort((a, b) => a.Views - b.Views || a.ViewsAvg - b.ViewsAvg);

        // Select the lowest 15 values
        const lowestData = sortedData.slice(0, 15);

        // Set up dimensions for the scatter plot
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = 500 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        // Create SVG container with viewBox for responsiveness
        const svg = d3.select("#scatter-plot")
            .append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
            .classed("svg-content", true)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Set up scales for x and y axes using the lowest data
        const xScale = d3.scaleLinear()
            .domain([0, d3.max(lowestData, d => d.Views)])
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(lowestData, d => d.ViewsAvg)])
            .range([height, 0]);

        // Add x-axis
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale));

        // Add y-axis
        svg.append("g")
            .call(d3.axisLeft(yScale));

        // Add translucent zoom box
        const translucentZoomBox = svg.append("rect")
            .attr("class", "translucent-zoom-box")
            .style("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-dasharray", "5 5")
            .attr("pointer-events", "none")
            .style("opacity", 0.3)
            .attr("width", width)
            .attr("height", height);

        // Set initial color
        let color = "blue";

        const colors = document.getElementsByName("color");

        colors.forEach(radio => {
            radio.addEventListener("change", () => {
                color = document.querySelector('input[name="color"]:checked').value;
                updateDataPoints();
            });
        });

        updateDataPoints();

        function updateDataPoints() {
            // Remove existing data points
            svg.selectAll(".data-point").remove();

            // Add circles for each data point
            svg.selectAll(".data-point")
                .data(lowestData)
                .enter().append("circle")
                .attr("class", "data-point")
                .attr("cx", d => xScale(d.Views))
                .attr("cy", d => yScale(d.ViewsAvg))
                .attr("r", 5)
                .style("fill", color);
        }
    }
}