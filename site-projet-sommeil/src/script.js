import * as d3 from "d3";

d3.csv("./data/activity.csv").then(function(data) {
    console.log(data);
    });

(async () => {
    const response = await fetch('/data/activity.csv');
    const text = await response.text();

    console.log(text)
  })()