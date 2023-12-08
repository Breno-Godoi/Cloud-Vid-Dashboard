// Find the most common category
function findMostCommonCategory() {

    // Count the occurrences of each category
    let categoryCount = {};
    top100data.forEach((entry) => {
      let category = entry.Category; // Assuming the column name is "Catagory"
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
  
    // Find the category with the maximum count
    let mostCommonCategory = Object.keys(categoryCount).reduce((a, b) =>
      categoryCount[a] > categoryCount[b] ? a : b
    );
  
    return mostCommonCategory;
}

// Display the most common category
function displayMostCommonCategory() {
    let mostCommonCategory = findMostCommonCategory();
    if (mostCommonCategory !== null) {
        document.getElementById("mostPopularCatagoryCard").textContent = mostCommonCategory;
    } else {
        console.error('Most common category is null or undefined.');
    }
}

// Fix data loading before this.
setTimeout(displayMostCommonCategory, 20);