import * as d3 from "https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.4/d3.js";
import { csv } from "d3";

d3.csv("/data/activity.csv").then(function(data) {
    console.log(data);
    });