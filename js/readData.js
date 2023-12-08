var top100data;

// Load the CSV data.
d3.csv("./files/top_100_youtubers.csv").then(function(data) {
    top100data = data;
});