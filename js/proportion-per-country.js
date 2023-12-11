//js/proportion-per-country.js

// Set up color scale
const color = d3.scaleOrdinal()
    .domain(['category1', 'category2', 'category3'])
    .range(['#1f77b4', '#ff7f0e', '#2ca02c']);

// Check if top100data is loaded
function drawProportionPerCountryChart() {
  if (top100data) {
    drawChart(top100data);
  } else {
    d3.csv("files/top_100_youtubers.csv")
      .then(function (data) {
        top100data = data;
        drawChart(data);
      })
      .catch(function (error) {
        console.error("Error loading the data: " + error);
      });
  }

  function drawChart(data) {
    const stackedData = data.map((d) => ({
      country: d.Country,
      category1: +d.Category1,
      category2: +d.Category2,
      category3: +d.Category3,
    }));

    // Calculate the cumulative sum for each category
    stackedData.forEach((d) => {
      let total = d.category1 + d.category2 + d.category3;
      let cumulative = 0;
      d.cumulativeData = [
        { key: "category1", proportion: (cumulative += d.category1) / total },
        { key: "category2", proportion: (cumulative += d.category2) / total },
        { key: "category3", proportion: (cumulative += d.category3) / total },
      ];
    });

    const width = 600;
    const height = 400;

    const svg = d3
      .select("#proportion-chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const xScale = d3
      .scaleBand()
      .domain(stackedData.map((d) => d.country))
      .range([0, width])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, 1]) // Update the domain based on your data
      .range([height, 0]);

    const color = d3
      .scaleOrdinal()
      .domain(["category1", "category2", "category3"])
      .range(["#1f77b4", "#ff7f0e", "#2ca02c"]); // Adjust colors as needed

    // Draw the stacked areas
    const area = d3
      .area()
      .x((d) => xScale(d.data.country))
      .y0((d) => yScale(d[0].proportion))
      .y1((d) => yScale(d[1].proportion))
      .curve(d3.curveBasis);

    svg
      .selectAll(".stacked-area")
      .data(
        d3.stack().keys(["category1", "category2", "category3"])(
          stackedData.map((d) => d.cumulativeData)
        )
      )
      .enter()
      .append("path")
      .attr("class", "stacked-area")
      .attr("d", area)
      .attr("fill", (d) => color(d.key));

    // Add axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g").attr("transform", `translate(0, ${height})`).call(xAxis);

    svg.append("g").call(yAxis);
  }
}

// Call the function to draw the chart
drawProportionPerCountryChart();

// Function to update the stacked bar chart
function updateStackedBarChart() {
  // You can add code to update the chart as needed
}
