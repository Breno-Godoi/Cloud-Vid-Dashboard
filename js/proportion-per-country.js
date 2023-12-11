//js/proportion-per-country.js

// Check if top100data is loaded
function drawProportionPerCountryChart() {
  if (top100data) {
    drawChart(top100data);
  } else {
    d3.csv("./files/top_100_youtubers.csv")
      .then(function (data) {
        top100data = data;
        drawChart(data);
      })
      .catch(function (error) {
        console.error("Error loading the data: " + error);
      });
  }

  function drawChart(data) {
    // Group data by country and count categories
    const groupedData = d3.group(data, d => d.Country);
    const categories = Array.from(new Set(data.map(d => d.Category)));
    
    // Set up dimensions and margins
    const margin = { top: 10, right: 30, bottom: 60, left: 50 };
    const containerWidth = document.getElementById("proportion-chart").offsetWidth;
    const width = containerWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create the SVG
    const svg = d3
      .select("#proportion-chart")
      .append("svg")
      .attr("viewBox", `0 0 ${containerWidth} ${height + margin.top + margin.bottom}`)
      .attr("width", "100%")
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // X-axis scale
    const xScale = d3.scaleBand()
      .domain(Array.from(groupedData.keys()))
      .range([0, width])
      .padding(0.2);

    // Y-axis scale
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => categories.map(cat => +d[cat] || 0).reduce((a, b) => a + b, 0))])
      .range([height, 0]);

    // Color scale
    const color = d3.scaleOrdinal()
      .domain(categories)
      .range(d3.schemeCategory10);

    // Draw the stacked bars
    svg.selectAll(".stacked-bar")
      .data(groupedData)
      .enter()
      .append("g")
      .attr("class", "stacked-bar")
      .attr("transform", d => `translate(${xScale(d[0])},0)`)
      .selectAll("rect")
      .data(d => categories.map(cat => ({ key: cat, value: +d[1][0][cat] || 0 })))
      .enter()
      .append("rect")
      .attr("x", d => xScale.bandwidth() / categories.length * categories.indexOf(d.key))
      .attr("y", d => yScale(d.value))
      .attr("width", xScale.bandwidth() / categories.length)
      .attr("height", d => height - yScale(d.value))
      .attr("fill", d => color(d.key));
    
    // X-axis
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale).tickSizeOuter(0))
      .selectAll("text")
      .attr("transform", "rotate(-35)")
      .style("font-size", "0.5vw")
      .style("text-anchor", "end");

    // Y-axis
    svg.append("g")
      .call(d3.axisLeft(yScale));

    // X-axis Title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 5)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .text("Country");

    // Y-axis Title
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("font-size", "14px")
      .style("text-anchor", "middle")
      .text("Count");

    // Legend
    const legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width - 100}, 0)`);

    legend.selectAll("rect")
      .data(categories)
      .enter().append("rect")
      .attr("y", (d, i) => i * 20)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", d => color(d));

    legend.selectAll("text")
      .data(categories)
      .enter().append("text")
      .attr("y", (d, i) => i * 20 + 9)
      .attr("x", 25)
      .style("text-anchor", "start")
      .style("font-size", "12px")
      .text(d => d);
  }
}

// Call the function to draw the chart
drawProportionPerCountryChart();
