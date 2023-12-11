// readData.js
var top100data;

// Load the CSV data.
d3.csv("./files/top_100_youtubers.csv").then(function(data) {
    top100data = data;
    
    // Ensure that these functions are called only after the data is loaded
    totalIncomeCard();  // Call totalIncomeCard function after data is loaded
    displayMostCommonCategory(); // Call displayMostCommonCategory after data is loaded
    topChannelCard(); // Call topChannelCard after data is loaded
});
