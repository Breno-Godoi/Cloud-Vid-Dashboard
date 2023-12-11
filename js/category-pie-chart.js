//js\category-pie-chart.js

// Load the data from the CSV file
d3.csv("files/top_100_youtubers.csv").then(function (data) {
  // Count the number of YouTubers in each country
  const countryCounts = {};
  data.forEach(function (d) {
    const country = d.Country;
    countryCounts[country] = (countryCounts[country] || 0) + 1;
  });

  // Convert counts to an array of objects
  const countsArray = Object.keys(countryCounts).map(function (country) {
    return { Country: country, Count: countryCounts[country] };
  });

  // set the dimensions and margins of the graph
  let margin = { top: 20, right: 20, bottom: 30, left: 30 };
  let containerWidth =
    document.getElementById("category-pie-chart").offsetWidth;
  let width = containerWidth - margin.left - margin.right;
  let height = 300 - margin.top - margin.bottom;
  let radius = Math.min(width, height) / 2;

  // Create SVG container
  const svg = d3
    .select("#category-pie-chart")
    .append("svg")
    .attr(
      "viewBox",
      `0 0 ${containerWidth} ${height + margin.top + margin.bottom}`
    )
    .attr("width", "100%")
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  // Set the colors using CSS variables
  let color = d3
    .scaleOrdinal()
    .range([
      getComputedStyle(document.documentElement).getPropertyValue("--color1"),
      getComputedStyle(document.documentElement).getPropertyValue("--color2"),
      getComputedStyle(document.documentElement).getPropertyValue("--color3"),
      getComputedStyle(document.documentElement).getPropertyValue("--color4"),
      getComputedStyle(document.documentElement).getPropertyValue("--color5"),
      getComputedStyle(document.documentElement).getPropertyValue("--color6"),
    ]);
  // Generate the pie chart data
  const pie = d3.pie().value((d) => d.Count);
  const pieData = pie(countsArray);

  // Create arc for each slice
  const arc = d3.arc().innerRadius(0).outerRadius(radius);

  // Create pie slices
  svg
    .selectAll("arc")
    .data(pieData)
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", (d) => color(d.data.Country))
    .attr("stroke", "white")
    .style("stroke-width", "2px");

  // ... (existing code)

  // Create a legend
  const legend = d3
    .select("#category-legend")
    .selectAll(".category-legend-item")
    .data(pieData)
    .enter()
    .append("div")
    .attr("class", "category-legend-item");

  // Add the color square
  legend
    .append("div")
    .style("width", "20px")
    .style("height", "20px")
    .style("background-color", (d) => color(d.data.Country));

  // Add the country names and count of YouTubers
  legend.append("span").text((d) => `${d.data.Country}: ${d.data.Count}`);
});
