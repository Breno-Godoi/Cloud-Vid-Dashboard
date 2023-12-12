// Global variable to track chart visibility
let sideBarVisible = false;

function toggleChartVisibility() {
    sideBarVisible = !sideBarVisible;
    let chartContainer = document.getElementById("side-bar-chart");
    chartContainer.style.display = sideBarVisible ? "block" : "none";

    if (sideBarVisible) {
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
    // Extract the "Country" and "ChannelName" columns from the loaded data
    const countryChannelData = top100data.map(d => ({ Country: d.Country, ChannelName: d.ChannelName }));

    // Create a map to store the list of channels for each country
    const channelListMap = new Map();

    // Collect the channels for each country
    countryChannelData.forEach(entry => {
        const { Country, ChannelName } = entry;
        if (channelListMap.has(Country)) {
            channelListMap.get(Country).push(ChannelName);
        } else {
            channelListMap.set(Country, [ChannelName]);
        }
    });

    // Convert the map to an array of objects
    const countryChannelLists = Array.from(channelListMap, ([country, channels]) => ({
        Country: country,
        ChannelNames: channels,
    }));

    // set the dimensions and margins of the graph
    let margin = { top: 50, right: 30, bottom: 80, left: 90 };
    let width = 460 - margin.left - margin.right;
    let height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    let svg = d3
        .select("#side-bar-chart")
        .html("")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    let x = d3.scaleLinear().domain([0, d3.max(countryChannelLists, d => d.ChannelNames.length)]).range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Add X axis title
    svg.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom - 10) + ")")
        .style("text-anchor", "middle")
        .text("Number of Channels");

    // Y axis
    let y = d3.scaleBand().range([0, height]).domain(countryChannelLists.map(function (d) { return d.Country; })).padding(.1);
    svg.append("g").call(d3.axisLeft(y));

    // Add Y axis title
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Country");

    // Add tooltip
    var tooltip = d3.select("#side-bar-chart")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("top", height + margin.top + "px"); // Adjust the top position

    // Bars.
    svg.selectAll("myRect")
        .data(countryChannelLists)
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", function (d) { return y(d.Country); })
        .attr("width", function (d) { return x(d.ChannelNames.length); })
        .attr("height", y.bandwidth())
        .attr("fill", "#69b3a2")
        .on("mouseover", function (event, d) {
            tooltip.transition().duration(200).style("opacity", .9);
            tooltip.html(d.ChannelNames.join("<br/>"))
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY + 10) + "px"); // Adjust the top position
        })
        .on("mouseout", function (d) {
            tooltip.transition().duration(500).style("opacity", 0);
        });
}
