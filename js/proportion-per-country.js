// set the dimensions and margins of the graph
let margin = { top: 20, right: 30, bottom: 60, left: 50 }; // Increased top margin
let containerWidth = document.getElementById("proportion-chart").offsetWidth;
let width = containerWidth - margin.left - margin.right;
let height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
let svg = d3
  .select("#proportion-chart")
  .append("svg")
  .attr("viewBox", `0 0 ${containerWidth} ${height + margin.top + margin.bottom}`)
  .attr("width", "100%")
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Function to update chart on resize
function updateChart() {
  containerWidth = document.getElementById("proportion-chart").offsetWidth;
  width = containerWidth - margin.left - margin.right;

  // Update the SVG's dimensions
  svg.attr("viewBox", `0 0 ${containerWidth} ${height + margin.top + margin.bottom}`);

  // Update X scale and axis
  x.range([0, width]);
  svg.select(".x-axis").call(d3.axisBottom(x).tickSizeOuter(0))
    .selectAll("text")
    .attr("transform", "rotate(-35)")
    .style("font-size", "0.8vw") // Adjust font size for better visibility
    .style("text-anchor", "end");

  // Update the bars
  svg.selectAll("rect")
    .attr("x", function (d) {
      return x(d.data.Country);
    })
    .attr("width", x.bandwidth());
}

// Load data from CSV
d3.csv("files/top_100_youtubers.csv").then(function (data) {
  // Check if data is loaded successfully
  if (!data || data.length === 0) {
    console.error("No data loaded");
    return;
  }

  // List of subgroups = header of the csv files = other than 'Country' column
  var subgroups = data.columns ? data.columns.slice(1) : [];

  // List of groups = unique countries
  var groups = Array.from(new Set(data.map(function (d) { return d.Country; })));

  // Add X axis
  var x = d3.scaleBand().domain(groups).range([0, width]).padding([0.2]);

  svg
    .append("g")
    .attr("class", "x-axis") // Add a class to the x-axis for easy access during update
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .selectAll("text")
    .attr("transform", "rotate(-35)")
    .style("font-size", "0.8vw") // Adjust font size for better visibility
    .style("text-anchor", "end");

  // Stack the data per subgroup
  var stackedData = d3.stack().keys(subgroups)(data);

  // Find the maximum value in the stacked data
  var maxY = d3.max(stackedData, function (layer) {
    return d3.max(layer, function (d) {
      return d[1];
    });
  });

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, maxY])
    .range([height, 0]);

  svg.append("g").call(d3.axisLeft(y));

  // Color palette = one color per subgroup
  var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#7CB695', '#d16b42']);

  // Show the bars
  svg
    .append("g")
    .selectAll("g")
    .data(stackedData)
    .enter()
    .append("g")
    .attr("fill", function (d) {
      return color(d.key);
    })
    .selectAll("rect")
    .data(function (d) {
      return d;
    })
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return x(d.data.Country);
    })
    .attr("y", function (d) {
      return y(d[1]);
    })
    .attr("height", function (d) {
      return y(d[0]) - y(d[1]);
    })
    .attr("width", x.bandwidth());

  // Call the updateChart function on window resize
  window.addEventListener('resize', updateChart);

}).catch(function (error) {
  console.error("Error loading data:", error);
});
