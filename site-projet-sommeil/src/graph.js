"use strict";

import * as d3 from "d3";

import { dataMiguel, dataCpap, dataAppleWatch } from "./script.js";

const nbCols = 5; // Nombre de colonnes
const rectWidth = 100;
const rectHeight = 67;

const width = 600;
const height = 400;

/*
 *
 *
 * HEATMAP
 *
 *
 **/

// const heatmap = (name, donnees, commentaire) => {
// 	// append the svg object to the body of the page
// 	const svg = d3
// 		.select(name)
// 		.append("svg")
// 		.attr("width", width + margin.left + margin.right)
// 		.attr("height", height + margin.top + margin.bottom)
// 		.append("g")
// 		.attr("transform", `translate(${margin.left}, ${margin.top})`);

// 	//Read the data
// 	d3
// 		.csv(
// 			"https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv"
// 		)

// 		.then(function (data) {
// 			// Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
// 			const myGroups = Array.from(new Set(data.map((d) => d.group)));
// 			const myVars = Array.from(new Set(data.map((d) => d.variable)));

// 			// Build X scales and axis:
// 			const x = d3.scaleBand().range([0, width]).domain(myGroups).padding(0.05);
// 			svg
// 				.append("g")
// 				.style("font-size", 15)
// 				.attr("transform", `translate(0, ${height})`)
// 				.call(d3.axisBottom(x).tickSize(0))
// 				.select(".domain")
// 				.remove();

// 			// Build Y scales and axis:
// 			const y = d3.scaleBand().range([height, 0]).domain(myVars).padding(0.05);
// 			svg
// 				.append("g")
// 				.style("font-size", 15)
// 				.call(d3.axisLeft(y).tickSize(0))
// 				.select(".domain")
// 				.remove();

// 			// Build color scale
// 			const myColor = d3
// 				.scaleSequential()
// 				.interpolator(d3.interpolateInferno)
// 				.domain([1, 100]);

// 			// create a tooltip
// 			const tooltip = d3
// 				.select(name)
// 				.append("div")
// 				.style("opacity", 0)
// 				.attr("class", "tooltip")
// 				.style("background-color", "white")
// 				.style("border", "solid")
// 				.style("border-width", "2px")
// 				.style("border-radius", "5px")
// 				.style("padding", "5px");

// 			// Three function that change the tooltip when user hover / move / leave a cell
// 			const mouseover = function (event, d) {
// 				tooltip.style("opacity", 1);
// 				d3.select(this).style("stroke", "black").style("opacity", 1);
// 			};
// 			const mousemove = function (event, d) {
// 				tooltip
// 					.html("The exact value of<br>this cell is: " + d.value)
// 					.style("left", event.x / 2 + "px")
// 					.style("top", event.y / 2 + "px");
// 			};
// 			const mouseleave = function (event, d) {
// 				tooltip.style("opacity", 0);
// 				d3.select(this).style("stroke", "none").style("opacity", 0.8);
// 			};

// 			// add the squares
// 			svg
// 				.selectAll()
// 				.data(data, function (d) {
// 					return d.group + ":" + d.variable;
// 				})
// 				.join("rect")
// 				.attr("x", function (d) {
// 					return x(d.group);
// 				})
// 				.attr("y", function (d) {
// 					return y(d.variable);
// 				})
// 				.attr("rx", 4)
// 				.attr("ry", 4)
// 				.attr("width", x.bandwidth())
// 				.attr("height", y.bandwidth())
// 				.style("fill", function (d) {
// 					return myColor(d.value);
// 				})
// 				.style("stroke-width", 4)
// 				.style("stroke", "none")
// 				.style("opacity", 0.8)
// 				.on("mouseover", mouseover)
// 				.on("mousemove", mousemove)
// 				.on("mouseleave", mouseleave);
// 		});

// 	// Add title to graph
// 	svg
// 		.append("text")
// 		.attr("x", 0)
// 		.attr("y", -50)
// 		.attr("text-anchor", "left")
// 		.style("font-size", "22px")
// 		.text("A d3.js heatmap");

// 	// Add subtitle to graph
// 	svg
// 		.append("text")
// 		.attr("x", 0)
// 		.attr("y", -20)
// 		.attr("text-anchor", "left")
// 		.style("font-size", "14px")
// 		.style("fill", "grey")
// 		.style("max-width", 400)
// 		.text(commentaire);
// };

// dataCpap.then((data) => {
// 	console.log("essai HEATMAP CPAP PATRICK");
// 	data.forEach((element) => {
// 		console.log(element.evenementHeure + " " + element.date);
// 	});
// });

// heatmap(".heatmap_profond_patrick");

const heatmapApneePatrick = (name, donnees) => {
	const dates = [];
	const values = [];

	donnees.then((dataRecue) => {
		let maxValue = 0;
		let minValue = 100;

		dataRecue.forEach((element) => {
			dates.push(element.date);
			values.push(element.evenementHeure);

			if (element.evenementHeure > maxValue) {
				maxValue = element.evenementHeure;
			}
			if (element.evenementHeure < minValue) {
				minValue = element.evenementHeure;
			}
		});

		const xScale = d3
			.scaleTime()
			.domain([new Date(dates[0]), new Date(dates[dates.length - 1])])
			.range([0, width]);

		const colorScale = d3
			.scaleLinear()
			.domain([minValue, maxValue])
			.range(["#00FFFF", "#000000"]);

		let compteur = 0;
		const data = [];
		for (let i = 0; i < dates.length; i++) {
			data[i] = [];
			for (let j = 0; j < nbCols; j++) {
				data[i][j] = values[compteur];
				compteur++;
				// data[i][j] = Math.floor(Math.random() * 11); // Remplacer par vos propres données
			}
		}

		const svg = d3
			.select(name)
			.append("svg")
			.attr("width", width)
			.attr("height", height);

		const rows = svg
			.selectAll("g")
			.data(data)
			.enter()
			.append("g")
			.attr("transform", (d, i) => `translate(0, ${i * rectHeight})`);

		const rects = rows
			.selectAll("rect")
			.data((d) => d)
			.enter()
			.append("rect")
			.attr(
				"x",
				(d, i) =>
					(i % nbCols) * rectWidth +
					Math.floor(i / nbCols) * dates.length * rectWidth
			)
			.attr("y", (d, i) => Math.floor(i / nbCols) * rectHeight)
			.attr("width", rectWidth)
			.attr("height", rectHeight)
			.attr("fill", (d) => colorScale(d));
	});
};

heatmapApneePatrick(".heatmap_nb_apnee", dataCpap);

const heatmapProfondMiguel = (name, donnees) => {
	const dates = [];
	const values = [];

	donnees.then((dataRecue) => {
		let maxValue = 0;
		let minValue = 100;

		dataRecue.forEach((element) => {
			dates.push(element.heureReveil);
			values.push(element.pourcentagePhaseProfond);

			if (element.pourcentagePhaseProfond > maxValue) {
				maxValue = element.pourcentagePhaseProfond;
			}
			if (element.pourcentagePhaseProfond < minValue) {
				minValue = element.pourcentagePhaseProfond;
			}
		});

		const xScale = d3
			.scaleTime()
			.domain([new Date(dates[0]), new Date(dates[dates.length - 1])])
			.range([0, width]);

		const colorScale = d3
			.scaleLinear()
			.domain([minValue, maxValue])
			.range(["#00FFFF", "#000000"]);

		let compteur = 0;
		const data = [];
		for (let i = 0; i < dates.length; i++) {
			data[i] = [];
			for (let j = 0; j < nbCols; j++) {
				data[i][j] = values[compteur];
				compteur++;
				// data[i][j] = Math.floor(Math.random() * 11); // Remplacer par vos propres données
			}
		}

		// const rectWidth = width / (dates.length * nbCols);
		// const rectHeight = height / nbCols;

		// const rectWidth = 50;
		// const rectHeight = 50;

		const svg = d3
			.select(name)
			.append("svg")
			.attr("width", width)
			.attr("height", height);

		const rows = svg
			.selectAll("g")
			.data(data)
			.enter()
			.append("g")
			.attr("transform", (d, i) => `translate(0, ${i * rectHeight})`);

		const rects = rows
			.selectAll("rect")
			.data((d) => d)
			.enter()
			.append("rect")
			.attr(
				"x",
				(d, i) =>
					(i % nbCols) * rectWidth +
					Math.floor(i / nbCols) * dates.length * rectWidth
			)
			.attr("y", (d, i) => Math.floor(i / nbCols) * rectHeight)
			.attr("width", rectWidth)
			.attr("height", rectHeight)
			.attr("fill", (d) => colorScale(d));
	});
};

heatmapProfondMiguel(".heatmap_profond_miguel", dataMiguel);

/*
 *
 *
 * FIN HEATMAP
 *
 *
 **/

/**
 *
 *
 *
 * BAR CHART
 */

const bar = (name, donnees) => {
	// append the svg object to the body of the page
	const svg = d3
		.select(name)
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", `translate(${margin.left},${margin.top})`);

	// Parse the Data
	// d3
	// 	.csv(
	// 		"https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv"
	// 	)
	donnees.then(function (data) {
		/* 		console.log(data);
		 */
		// X axis
		const x = d3
			.scaleBand()
			.range([0, width])
			.domain(
				data.map((d) => {
					// let newDate = new Date(d.date);
					// console.log(d.date);

					// let jour = newDate.getDate();
					// let mois = newDate.getMonth() + 1;
					// console.log(jour);
					// console.log(mois);
					// return `${jour}.${mois}`;
					return d.date;
				})
			)
			.padding(0.2);
		svg
			.append("g")
			.attr("transform", `translate(0,${height})`)
			.call(d3.axisBottom(x))
			.selectAll("text")
			.attr("transform", "translate(-10,0)rotate(-45)")
			.style("text-anchor", "end");

		// Add Y axis
		const y = d3.scaleLinear().domain([0, 7]).range([height, 0]);
		svg.append("g").call(d3.axisLeft(y));

		// Bars
		svg
			.selectAll("mybar")
			.data(data)
			.join("rect")
			.attr("x", (d) => x(d.date))
			.attr("width", x.bandwidth())
			.attr("fill", "#ffffff")
			// no bar at the beginning thus:
			.attr("height", (d) => height - y(0)) // always equal to 0
			.attr("y", (d) => y(0));

		// Animation
		svg
			.selectAll("rect")
			.transition()
			.duration(800)
			.attr("y", (d) => y(d.evenementHeure))
			.attr("height", (d) => height - y(d.evenementHeure))
			.delay((d, i) => {
				return i * 100;
			});
	});
};

bar("#bar_chart", dataCpap);

/* console.log("Essai");
console.log(dataCpap); */

// import { dataMiguel, dataCpap, dataAppleWatch } from "./script.js";

/**
 * FIN BAR CHART
 *
 *
 *
 * */

/*
 *
 *
 * GRAPH CIRCULAIRE
 *
 *
 **/

// set the dimensions and margins of the graph

const circular = (name, donnees) => {
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
		.select(name)
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
};

circular("#circular_chart");

/*
 *
 *
 * FIN GRAPH CIRCULAIRE
 *
 *
 * */

/*
 *
 *
 * LIGNES
 *
 *
 *
 * */

const line = (name, donnees) => {
	// append the svg object to the body of the page
	const svg = d3
		.select(name)
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", `translate(${margin.left},${margin.top})`);

	//Read the data
	d3
		.csv(
			"https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered.csv"
		)
		.then(function (data) {
			// group the data: I want to draw one line per group
			const sumstat = d3.group(data, (d) => d.name); // nest function allows to group the calculation per level of a factor

			// Add X axis --> it is a date format
			const x = d3
				.scaleLinear()
				.domain(
					d3.extent(data, function (d) {
						return d.year;
					})
				)
				.range([0, width]);
			svg
				.append("g")
				.attr("transform", `translate(0, ${height})`)
				.call(d3.axisBottom(x).ticks(5));

			// Add Y axis
			const y = d3
				.scaleLinear()
				.domain([
					0,
					d3.max(data, function (d) {
						return +d.n;
					}),
				])
				.range([height, 0]);
			svg.append("g").call(d3.axisLeft(y));

			// color palette
			const color = d3
				.scaleOrdinal()
				.range([
					"#e41a1c",
					"#377eb8",
					"#4daf4a",
					"#984ea3",
					"#ff7f00",
					"#ffff33",
					"#a65628",
					"#f781bf",
					"#999999",
				]);

			// Draw the line
			svg
				.selectAll(".line")
				.data(sumstat)
				.join("path")
				.attr("fill", "none")
				.attr("stroke", function (d) {
					return color(d[0]);
				})
				.attr("stroke-width", 1.5)
				.attr("d", function (d) {
					return d3
						.line()
						.x(function (d) {
							return x(d.year);
						})
						.y(function (d) {
							return y(+d.n);
						})(d[1]);
				});
		});
};

line("#line_chart");

/*
 *
 *
 * FIN LIGNES
 *
 *
 * */
