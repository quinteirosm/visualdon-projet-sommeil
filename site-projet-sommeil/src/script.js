import * as d3 from "../node_modules/d3/dist/d3.js";

// Load the CSV file using D3's built-in function
d3.csv("data/activity.csv").then(function(data) {
    // Convert the CSV data to a JSON object using D3's built-in function
    var jsonData = d3.csvFormat(data);
  
    // Convert the JSON object to a string using JavaScript's JSON.stringify function
    var jsonString = JSON.stringify(jsonData);
  
    // Log the JSON string to the console
    console.log(jsonString);
  });