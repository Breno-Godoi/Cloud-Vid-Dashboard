// Check if top100data is loaded
function mostCommonCategory() {

    // Function to get unique Moretopics and Maintopic values and count number of appearances.
    function getUniqueCategoriesWithCount(data) {

        // Create object to hold the counts.
        const categoryCounts = {};

        // Cycle through the data.
        data.forEach(entry => {

            // Check Moretopics.
            const moretopics = entry.Moretopics.split(',');
            moretopics.forEach(category => {
                categoryCounts[category] = categoryCounts[category] || { moretopics: 0, maintopic: 0 };
                categoryCounts[category].moretopics += 1;
            });

            // Check Maintopic.
            const maintopic = entry.Maintopic;
            categoryCounts[maintopic] = categoryCounts[maintopic] || { moretopics: 0, maintopic: 0 };
            categoryCounts[maintopic].maintopic += 1;
        });

        // Convert object into an array.
        const result = Object.entries(categoryCounts).map(([category, counts]) => ({
            category,
            moretopics: counts.moretopics,
            maintopic: counts.maintopic,
        }));

        // Send back the array.
        return result;
    }

    const uniqueCategoriesWithCount = getUniqueCategoriesWithCount(top100data);

    // set the dimensions and margins of the graph
    let margin = { top: 10, right: 30, bottom: 60, left: 50 };
    let containerWidth = document.getElementById("stacked-bar-chart").offsetWidth;
    let width = containerWidth - margin.left - margin.right;
    let height = 400 - margin.top - margin.bottom;
    
    // Create the svg for the graph.
    let svg = d3.select("#stacked-bar-chart")
        .append("svg")
        .attr("viewBox", `0 0 ${containerWidth} ${height + margin.top + margin.bottom}`)
        .attr("width", "100%")
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    // Create graph title.
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 0 - margin.top / 10 +10)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Category vs. Apperances");


    // Move data into easier understood variable.
    let data = uniqueCategoriesWithCount;
    
    // Create list of subgroups.
    let subgroups = ['maintopic', 'moretopics'];
    
    // Create list of groups.
    let groups = data.map(function(d) { 
        return d.category; 
    });
    
    // Create X axis.
    let x = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0.2]);
    
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSizeOuter(0))
        .selectAll("text") // Rotate x axis names.
            .attr("transform", "rotate(-35)")
            .style("font-size","0.5vw")
            .style("text-anchor", "end");
    
    // Create Y axis.
    let y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { 
            return Math.max(d.maintopic, d.moretopics); 
        }) + 20]) // The 20 is padding so the bars stay in the graph space.
        .range([height, 0]);
    
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add X Axis Title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom -5)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Category");

    // Add Y Axis Title
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - height / 2)
        .attr("dy", "1em")
        .style("font-size", "14px")
        .style("text-anchor", "middle")
        .text("Number of Appearences");
    
    // Set the colors in a way that they can be cycled through.
    let color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(['#7CB695', '#d16b42']);
    
    // Stack the bars data.
    let stackedData = d3.stack().keys(subgroups)(data);
    
    // Create the bars.
    svg.append("g")
        .selectAll("g")
        .data(stackedData)
        .enter().append("g")
        .attr("fill", function(d) { // Chooses the color from the scale.
          return color(d.key); 
        })
        .selectAll("rect")
            .data(function(d) { 
                return d;
            })
            .enter().append("rect")
                .attr("x", function(d) { 
                    return x(d.data.category); 
                })
                .attr("y", function(d) { // Makes sure that the bars are sitting on top of each other.
                    return y(d[1]); 
                })
                .attr("height", function(d) { 
                    return y(d[0]) - y(d[1]); // Formula for calculating the height the next bar will sit on. 
                })
                .attr("width", x.bandwidth());

    // Create a legend.
    let legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width - 100}, 0)`);

    // Create the square for the color.
    legend.selectAll("rect")
        .data(subgroups)
        .enter().append("rect")
        .attr("y", function(d, i) {
            return i * 20;
        })
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d) {
            return color(d);
        });

    // Add the words for the legend.
    legend.selectAll("text")
        .data(subgroups)
        .enter().append("text")
        .attr("y", function(d, i) {
            return i * 20 + 9;
        })
        .attr("x", 25)
        .style("text-anchor", "start")
        .style("font-size", "12px")
        .text(function(d) {
            return d === 'maintopic' ? 'Main Topics' : 'Other Topics';
        });
}