let bubbleChartVisible = false;

/*
Accepts:     Void
Returns:     Void
Description: Displays the a bubble graph for relations of started year, users, and followers.
*/
function getStartedYearData(){

    bubbleChartVisible = !bubbleChartVisible;
    let chartContainer = document.getElementById("bubble-chart");
    chartContainer.style.display = bubbleChartVisible ? "flex" : "none";
    chartContainer.style.flexDirection = bubbleChartVisible ? "column" : "none";

    if(bubbleChartVisible){

        // Create array/object to hold the used data.
        const startedYearData = {};

        // Go through all the rows of data.
        top100data.forEach(entry => {

            // Get the year for the row.
            const startedYear = entry.started;

            // Create/Set variable for username.
            const username = entry.username;

            // Convert follower count to millions.
            const followers = entry.followers / 1000000;

            // Initalize the array if need be.
            startedYearData[startedYear] = startedYearData[startedYear] || { 
                count: 0, 
                usernames: [], 
                totalFollowers: 0 
            };

            // Increment the count for users started that year.
            startedYearData[startedYear].count += 1;
            
            // Add the usernames to the list for that year.
            startedYearData[startedYear].usernames.push(username);

            // Add the followers count.
            startedYearData[startedYear].totalFollowers += followers;
        });

        // Make dimensions for graph.
        let margin = {top: 10, right: 20, bottom: 30, left: 50};
        let width = 500 - margin.left - margin.right;
        let height = 420 - margin.top - margin.bottom;

        // Call the container to add to.
        let svg = d3.select("#bubble-chart")
            .append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
            .classed("svg-content", true)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



        // Make a start year so the graph doesn't start on the zero.
        const startYear = 2004;

        // Create X axis.
        let x = d3.scaleLinear()
            .domain([startYear, d3.max(Object.keys(startedYearData),(d) => {
                return +d;
            })])
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Create Y axis.
        let y = d3.scaleLinear()
            .domain([0, d3.max(Object.values(startedYearData),(d) => {
                return +d.count;
            })+1])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Add a scale for bubble size
        let z = d3.scaleLinear()
            .domain([0, d3.max(Object.values(startedYearData), (d) => {
                return +d.totalFollowers;
            })])
            .range([4, 40]);

        // Create the element for the tips.
        let tip = d3.select("#bubble-chart")
            .append("div")
            .style("opacity", 0)
            .attr("class", "bubble-tip");

        // Create functions to deal with the hovering.
        function showTip(event, d){
            tip.transition().duration(200);
            tip
                .style("opacity", 1)
                .html("Year: " + d.year + "<br/>Number of Users: " + d.count + "<br/>Total Followers: " + d.totalFollowers.toFixed(2) + "M" + "<br/>Usernames: " + d.usernames.join(', '))
                .style("left", (event.x + 30) + "px")
                .style("top", (event.y + 30) + "px");
        }
        function moveTip(event, d){
            tip
                .style("left", (event.x + 30) + "px")
                .style("top", (event.y + 30) + "px");
        };
        function hideTip(event, d){
            tip.transition().duration(200).style("opacity", 0);
        };

        // Create the dots.
        svg.append('g')
            .selectAll("dot")
            .data(Object.entries(startedYearData).map(([year, data]) => ({ year, ...data })))
            .enter()
            .append("circle")
            .attr("class", "bubbles")
            .attr("cx", (d) => { 
                return x(+d.year); 
            })
            .attr("cy", (d) => { 
                return y(+d.count);
            })
            .attr("r", (d) => { 
                return z(+d.totalFollowers); 
            })
            // Add the functions for the hover effect.
            .on("mouseover", showTip)
            .on("mousemove", moveTip)
            .on("mouseleave", hideTip);
    }
}