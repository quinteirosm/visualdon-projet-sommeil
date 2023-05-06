"use strict";

import * as d3 from "d3";

/*
 *
 *
 * HEATMAP
 *
 *
 **/

// set the dimensions and margins of the graph
const margin = {
		top: 30,
		right: 30,
		bottom: 30,
		left: 30,
	},
	width = 450 - margin.left - margin.right,
	height = 450 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3
	.select("#my_dataviz")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", `translate(${margin.left},${margin.top})`);

// Labels of row and columns
const myGroups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const myVars = ["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10"];

// Build X scales and axis:
const x = d3.scaleBand().range([0, width]).domain(myGroups).padding(0.01);
svg
	.append("g")
	.attr("transform", `translate(0, ${height})`)
	.call(d3.axisBottom(x));

// Build X scales and axis:
const y = d3.scaleBand().range([height, 0]).domain(myVars).padding(0.01);
svg.append("g").call(d3.axisLeft(y));

// Build color scale
const myColor = d3.scaleLinear().range(["white", "#69b3a2"]).domain([1, 100]);

//Read the data
d3
	.csv(
		"https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv"
	)
	.then(function (data) {
		// create a tooltip
		const tooltip = d3
			.select("#my_dataviz")
			.append("div")
			.style("opacity", 0)
			.attr("class", "tooltip")
			.style("background-color", "white")
			.style("border", "solid")
			.style("border-width", "2px")
			.style("border-radius", "5px")
			.style("padding", "5px");

		// Three function that change the tooltip when user hover / move / leave a cell
		const mouseover = function (event, d) {
			tooltip.style("opacity", 1);
		};
		const mousemove = function (event, d) {
			tooltip
				.html("The exact value of<br>this cell is: " + d.value)
				.style("left", event.x / 2 + "px")
				.style("top", event.y / 2 + "px");
		};
		const mouseleave = function (d) {
			tooltip.style("opacity", 0);
		};

		// add the squares
		svg
			.selectAll()
			.data(data, function (d) {
				return d.group + ":" + d.variable;
			})
			.enter()
			.append("rect")
			.attr("x", function (d) {
				return x(d.group);
			})
			.attr("y", function (d) {
				return y(d.variable);
			})
			.attr("width", x.bandwidth())
			.attr("height", y.bandwidth())
			.style("fill", function (d) {
				return myColor(d.value);
			})
			.on("mouseover", mouseover)
			.on("mousemove", mousemove)
			.on("mouseleave", mouseleave);
	});

// append the svg object to the body of the page
const svg2 = d3
	.select("#my_dataviz-second")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", `translate(${margin.left},${margin.top})`);

//Read the data
d3
	.csv(
		"https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv"
	)
	.then(function (data) {
		// create a tooltip
		const tooltip = d3
			.select("#my_dataviz-second")
			.append("div")
			.style("opacity", 0)
			.attr("class", "tooltip")
			.style("background-color", "white")
			.style("border", "solid")
			.style("border-width", "2px")
			.style("border-radius", "5px")
			.style("padding", "5px");

		// Three function that change the tooltip when user hover / move / leave a cell
		const mouseover = function (event, d) {
			tooltip.style("opacity", 1);
		};
		const mousemove = function (event, d) {
			tooltip
				.html("The exact value of<br>this cell is: " + d.value)
				.style("left", event.x / 2 + "px")
				.style("top", event.y / 2 + "px");
		};
		const mouseleave = function (d) {
			tooltip.style("opacity", 0);
		};

		// add the squares
		svg2
			.selectAll()
			.data(data, function (d) {
				return d.group + ":" + d.variable;
			})
			.enter()
			.append("rect")
			.attr("x", function (d) {
				return x(d.group);
			})
			.attr("y", function (d) {
				return y(d.variable);
			})
			.attr("width", x.bandwidth())
			.attr("height", y.bandwidth())
			.style("fill", function (d) {
				return myColor(d.value);
			})
			.on("mouseover", mouseover)
			.on("mousemove", mousemove)
			.on("mouseleave", mouseleave);
	});

/*
 *
 *
 * FIN HEATMAP
 *
 *
 **/

/*
 *
 *
 * GRAPH CIRCULAIRE
 *
 *
 **/

// set the dimensions and margins of the graph
const margin3 = {
		top: 100,
		right: 0,
		bottom: 0,
		left: 0,
	},
	width3 = 460 - margin3.left - margin3.right,
	height3 = 460 - margin3.top - margin3.bottom,
	innerRadius = 90,
	outerRadius = Math.min(width, height3) / 2; // the outerRadius goes from the middle of the SVG area to the border

// append the svg object
const svg3 = d3
	.select("#circular_chart")
	.append("svg")
	.attr("width", width3 + margin3.left + margin3.right)
	.attr("height", height3 + margin3.top + margin3.bottom)
	.append("g")
	.attr(
		"transform",
		`translate(${width / 2 + margin.left}, ${height / 2 + margin3.top})`
	);

d3
	.csv(
		"https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum.csv"
	)
	.then(function (data) {
		// Scales
		const x = d3
			.scaleBand()
			.range([0, 2 * Math.PI]) // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
			.align(0) // This does nothing
			.domain(data.map((d) => d.Country)); // The domain of the X axis is the list of states.
		const y = d3
			.scaleRadial()
			.range([innerRadius, outerRadius]) // Domain will be define later.
			.domain([0, 14000]); // Domain of Y is from 0 to the max seen in the data

		// Add the bars
		svg3
			.append("g")
			.selectAll("path")
			.data(data)
			.join("path")
			.attr("fill", "#69b3a2")
			.attr(
				"d",
				d3
					.arc() // imagine your doing a part of a donut plot
					.innerRadius(innerRadius)
					.outerRadius((d) => y(d["Value"]))
					.startAngle((d) => x(d.Country))
					.endAngle((d) => x(d.Country) + x.bandwidth())
					.padAngle(0.01)
					.padRadius(innerRadius)
			);

		// Add the labels
		svg3
			.append("g")
			.selectAll("g")
			.data(data)
			.join("g")
			.attr("text-anchor", function (d) {
				return (x(d.Country) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) <
					Math.PI
					? "end"
					: "start";
			})
			.attr("transform", function (d) {
				return (
					"rotate(" +
					(((x(d.Country) + x.bandwidth() / 2) * 180) / Math.PI - 90) +
					")" +
					"translate(" +
					(y(d["Value"]) + 10) +
					",0)"
				);
			})
			.append("text")
			.text(function (d) {
				return d.Country;
			})
			.attr("transform", function (d) {
				return (x(d.Country) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) <
					Math.PI
					? "rotate(180)"
					: "rotate(0)";
			})
			.style("font-size", "11px")
			.attr("alignment-baseline", "middle");
	});
