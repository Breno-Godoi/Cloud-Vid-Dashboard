let pieVisible = false;

function togglePieChart() {
  pieVisible = !pieVisible;

  let chartContainer = document.getElementById("category-pie-container");
  chartContainer.style.display = pieVisible ? "flex" : "none";
  chartContainer.style.flexDirection = pieVisible ? "column" : "none"; // Set flex direction to column when visible

  // Toggle legend visibility based on the chart visibility
  let legendContainer = document.getElementById("category-legend");
  legendContainer.style.display = pieVisible ? "flex" : "none";

  if (pieVisible) {
    // Get unique "Country" values.
    let uniqueCountries = Array.from(new Set(top100data.map((d) => d.Country)));

    // Create a map to store the count of YouTubers for each country.
    let countryCountMap = new Map();

    // Count the YouTubers for each unique country.
    for (let i = 0; i < uniqueCountries.length; i++) {
      let country = uniqueCountries[i];
      let count = d3.sum(top100data, (d) => (d.Country === country ? 1 : 0));
      countryCountMap.set(country, count);
    }

    // Convert the map to an array of objects.
    let countsArray = Array.from(countryCountMap, ([country, count]) => ({
      Country: country,
      Count: count,
    }));

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

    /// Create a legend
    const legend = d3
      .select("#category-legend")
      .selectAll(".category-legend-item")
      .data(pieData)
      .enter()
      .append("div")
      .attr("class", "category-legend-item")
      .style("display", "flex") // Add this line to format the legend items side by side
      .style("align-items", "center")
      .style("width", "33%") // Set the width to 33% for three items in a row
      .style("box-sizing", "border-box") // Include padding and border in width calculation
      .style("padding", "0 10px"); // Add some padding for spacing between legend items

    // Add the color square
    legend
      .append("div")
      .style("width", "20px")
      .style("height", "20px")
      .style("margin-right", "5px") // Add margin between color square and text
      .style("background-color", (d) => color(d.data.Country));

    // Add the country names and count of YouTubers
    legend.append("span").text((d) => `${d.data.Country}: ${d.data.Count}`);
  } else {
    // Clear the chart and legend when hiding
    document.getElementById("category-pie-chart").innerHTML = "";
    document.getElementById("category-legend").innerHTML = "";
  }
}
