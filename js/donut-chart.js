//styles\donut-chart.css

let donutVisible = false;

function toggleDonut() {
    donutVisible = !donutVisible;
    let chartContainer = document.getElementById("donut-container");
    chartContainer.style.display = donutVisible ? "flex" : "none";
    chartContainer.style.flexDirection = donutVisible ? "row" : "none";
    chartContainer.style.flexWrap = donutVisible ? "wrap" : "none";

    if (donutVisible) {

        // Get unique "Country" values.
        let uniqueCountries = Array.from(new Set(top100data.map(d => d.Country)));

        // Create a map to store the sum of selected income quarter for each country.
        let countryIncomeMap = new Map();

        // Add up the selected income quarter column for each unique country.
        function updateChart(selectedQuarter) {
            // Clear the previous data
            countryIncomeMap.clear();

            for (let i = 0; i < uniqueCountries.length; i++) {
                let country = uniqueCountries[i];
                let totalIncome = d3.sum(top100data.filter(d => d.Country === country), d => +d[selectedQuarter]);
                countryIncomeMap.set(country, totalIncome);
            }

            // Convert the map to an array for sorting.
            let sortedData = Array.from(countryIncomeMap, ([country, income]) => ({ country, value: income }));

            // Sort the array by income in descending order.
            sortedData.sort((a, b) => b.value - a.value);

            // Get the top 6 in the quarter.
            let topCountries = sortedData.slice(0, 6);

            // Create dimensions.
            let width = 700;
            let height = 500;
            let radius = Math.min(width, height) / 2;

            // Choose color scheme for portions.
            let color = d3.scaleOrdinal(["#d16b42", "#91C07D", "#946E45", "#ce5c2fbe", "#D8BA8E", "#7CB695"]);

            let svg = d3.select("#donut-chart")
                .html("") // Clear old chart.
                .append("svg")
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("viewBox", `0 0 ${width} ${height + 50}`)
                .attr("preserveAspectRatio", "xMidYMid meet") // This and previous three lines for responsive design.
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 50) + ")");

            // Add title to the chart.
            svg.append("text")
                .attr("x", 0)
                .attr("y", -height / 2 - 10)
                .attr("text-anchor", "middle")
                .attr("class", "donut-title")
                .text("Top 6 Countries Total Income Quarterly");

            // Create a pie.
            let pie = d3.pie()
                .value(function(d) { return d.value; });

            // Create the portions.
            let arc = d3.arc()
                .innerRadius(radius - 100)
                .outerRadius(radius);

            let donutData = topCountries;

            let arcs = svg.selectAll("arc")
                .data(pie(donutData))
                .enter()
                .append("g")
                .attr("class", "arc");

            // Add the color for the portion.
            arcs.append("path")
                .attr("d", arc)
                .attr("fill", function(d) { return color(d.data.country); });

            // Add the labels for each portion.
            arcs.append("text")
                .attr("transform", function(d) {
                    return "translate(" + arc.centroid(d) + ")";
                })
                .attr("text-anchor", "middle")
                .attr("class", "donut-portion-name")
                .text(function(d) {
                    return d.data.country;
                });

            // Create a legend.
            let legend = d3.select("#donut-legend")
                .html(""); // Clear previous legend.

            legend.selectAll(".donut-legend-item")
                .data(topCountries)
                .enter()
                .append("div")
                .attr("class", "donut-legend-item")
                .html(function(d) {
                    let formattedValue = d3.format(",.2f")(d.value); // Format the number to be readable.
                    return `<div style="background-color:${color(d.country)};"></div>${d.country}: ${formattedValue}`;
                });
        }

        // Initialize the chart.
        updateChart("Income q1");

        // Create a change event for the radio buttons
        d3.selectAll("input[name='quarter']").on("change", function() {
            let selectedQuarter = d3.select("input[name='quarter']:checked").property("value");
            updateChart(selectedQuarter);
        });
    }
}