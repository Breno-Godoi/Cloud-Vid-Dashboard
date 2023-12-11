// Load the data from the CSV file
d3.csv("./files/top_100_youtubers.csv").then(function (data) {
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
  let margin = { top: 40, right: 20, bottom: 50, left: 60 }; // Increased top and left margins
  let containerWidth = document.getElementById("map-chart").offsetWidth;
  let width = containerWidth - margin.left - margin.right;
  let height = 500 - margin.top - margin.bottom;

  // Create SVG container
  const svg = d3
    .select("#map-chart")
    .append("svg")
    .attr(
      "viewBox",
      `0 0 ${containerWidth} ${height + margin.top + margin.bottom}`
    )
    .attr("width", "100%")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Set the colors using CSS variables
  let color = d3
    .scaleOrdinal()
    .range([
      getComputedStyle(document.documentElement).getPropertyValue("--color3"),
      getComputedStyle(document.documentElement).getPropertyValue("--color4"),
    ]);

  // Create a scale for the x-axis
  const xScale = d3
    .scaleBand()
    .domain(countsArray.map((d) => d.Country))
    .range([0, width])
    .padding(0.2); // Adjust the padding as needed

  // Create x-axis
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end")
    .attr("dx", "-0.5em") // Adjust the x position for better rotation
    .attr("dy", "0.5em"); // Adjust the y position for better rotation

  // Create a scale for the y-axis
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(countsArray, (d) => d.Count)])
    .range([height, 0]);

  // Create area generator
  const area = d3.area()
    .x((d) => xScale(d.Country) + xScale.bandwidth() / 2)
    .y0(height)
    .y1((d) => yScale(d.Count));

  // Create area chart
  svg.append("path")
    .data([countsArray])
    .attr("class", "area")
    .attr("d", area)
    .attr("fill", getComputedStyle(document.documentElement).getPropertyValue("--color3"));

  // Add labels
  svg.selectAll(".label")
    .data(countsArray)
    .enter()
    .append("text")
    .text((d) => d.Country)
    .attr("x", (d) => xScale(d.Country) + xScale.bandwidth() / 2)
    .attr("y", (d) => yScale(d.Count) - 10) // Adjust y position for better visibility
    .attr("fill", (d) => color(d.Country))
    .style("font-size", "12px")
    .attr("text-anchor", "middle");

  // Create y-axis
  svg.append("g")
    .call(d3.axisLeft(yScale));

  // Add responsiveness on window resize
  window.addEventListener('resize', function () {
    containerWidth = document.getElementById("map-chart").offsetWidth;
    width = containerWidth - margin.left - margin.right;

    // Update SVG container width
    svg.attr("viewBox", `0 0 ${containerWidth} ${height + margin.top + margin.bottom}`);

    // Update x-axis scale range
    xScale.range([0, width]);

    // Update x-axis
    svg.select(".x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .attr("dx", "-0.5em")
      .attr("dy", "0.5em");

    // Update area chart
    svg.select(".area")
      .attr("d", area);

    // Update labels
    svg.selectAll(".label")
      .attr("x", (d) => xScale(d.Country) + xScale.bandwidth() / 2);

  });
});
