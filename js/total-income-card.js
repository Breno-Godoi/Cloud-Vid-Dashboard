// total-income-card.js
function totalIncomeCard() {
    // Your existing totalIncomeCard code goes here
    let totalIncomeQ1 = d3.sum(top100data, d => +d["Income q1"]);
    let totalIncomeQ2 = d3.sum(top100data, d => +d["Income q2"]);
    let totalIncomeQ3 = d3.sum(top100data, d => +d["Income q3"]);
    let totalIncomeQ4 = d3.sum(top100data, d => +d["Income q4"]);

    // Format numbers with commas for thousands.
    function formatNumberWithCommas(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // Display totals in the corresponding elements.
    document.getElementById("totalq1").textContent = `Quarter 1: $${formatNumberWithCommas(totalIncomeQ1.toFixed(2))}`;
    document.getElementById("totalq2").textContent = `Quarter 2: $${formatNumberWithCommas(totalIncomeQ2.toFixed(2))}`;
    document.getElementById("totalq3").textContent = `Quarter 3: $${formatNumberWithCommas(totalIncomeQ3.toFixed(2))}`;
    document.getElementById("totalq4").textContent = `Quarter 4: $${formatNumberWithCommas(totalIncomeQ4.toFixed(2))}`;
}
