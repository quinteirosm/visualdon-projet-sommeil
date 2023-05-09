"use strict";

import * as d3 from "d3";

import {
	dataMiguel,
	dataCpap,
	dataCpap2023,
	dataAppleWatch,
	dateFormatDayMonthYear,
} from "./script.js";

const nbCols = 5; // Nombre de colonnes

// const width = 600;
// const height = 400;

const margin = { top: 30, right: 30, bottom: 30, left: 30 },
	width = 600,
	height = 500;

const rectWidth = width / 5;
const rectHeight = height / 6;

const couleurMin = "#FFFFFF";
const couleurMax = "#0154C2";

/*
 *
 *
 * HEATMAP
 *
 *
 **/

const heatmapProfondPatrick = (name, donnees) => {
	const dates = [];
	const values = [];

	Promise.all(donnees).then(([dataRecueCpap, dataRecueAppleWatch]) => {
		let maxValue = 0;
		let minValue = 100;

		/**
		 * dataCpap[i].tempsSommeil/dataCpap[i].tempsSommeilProfond *100
		 */

		// console.log(dataRecueCpap);
		// console.log(dataRecueAppleWatch);

		let tableauCopie = [...dataRecueAppleWatch];
		// for (let i = 0; i <= 7; i++) {
		// 	tableauCopie.unshift({ tempsSommeilProfond: 1 });
		// }

		// tableauCopie.push({ tempsSommeilProfond: 1 });

		console.log("Tentative d'avoir tout dans la même boucle");
		dataRecueCpap.forEach((element, index) => {
			const num2 = tableauCopie[index].tempsSommeilProfond;
			// console.log(element.dureeSommeil * 60, num2);

			// console.log(num2);

			let pourcentageProfondAppleWatchEtNuitCpap =
				((tableauCopie[index].tempsSommeilProfond
					? tableauCopie[index].tempsSommeilProfond
					: 1) /
					60 /
					(element.dureeSommeil ? element.dureeSommeil : 1)) *
				100;

			console.log(pourcentageProfondAppleWatchEtNuitCpap);

			dates.push(element.date);
			values.push(pourcentageProfondAppleWatchEtNuitCpap);

			if (pourcentageProfondAppleWatchEtNuitCpap > maxValue) {
				maxValue = pourcentageProfondAppleWatchEtNuitCpap;
			}
			if (pourcentageProfondAppleWatchEtNuitCpap < minValue) {
				minValue = pourcentageProfondAppleWatchEtNuitCpap;
			}
		});

		const xScale = d3
			.scaleTime()
			.domain([new Date(dates[0]), new Date(dates[dates.length - 1])])
			.range([0, width]);

		const colorScale = d3
			.scaleLinear()
			.domain([minValue, maxValue])
			.range([couleurMin, couleurMax]);

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

heatmapProfondPatrick(".heatmap_profond_patrick", [dataCpap, dataAppleWatch]);

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
			.range([couleurMin, couleurMax]);

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
			.range([couleurMin, couleurMax]);

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
					// Si je mets date à la place de d.date, cela ne fonctionne pas
					let date = dateFormatDayMonthYear(new Date(d.date));
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
			.attr("fill", couleurMin)
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
	const innerRadius = 90;
	const outerRadius = Math.min(width, height) / 2; // the outerRadius goes from the middle of the SVG area to the border

	// append the svg object
	const svg3 = d3
		.select(name)
		.append("svg")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr(
			"transform",
			`translate(${width / 2 + margin.left}, ${height / 2 + margin.top})`
		);

	// d3
	// 	.csv(
	// 		"https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum.csv"
	// 	)

	donnees.then((data) => {
		let maxValue = 0;
		let minValue = 100;

		console.log(data);

		data.forEach((element) => {
			if (element.fuiteMoyenne > maxValue) {
				maxValue = element.fuiteMoyenne;
			}
			if (element.fuiteMoyenne < minValue) {
				minValue = element.fuiteMoyenne;
			}
		});
		// Scales
		const x = d3
			.scaleBand()
			.range([0, 2 * Math.PI]) // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
			.align(0) // This does nothing
			.domain(data.map((d) => d.date)); // The domain of the X axis is the list of states.
		const y = d3
			.scaleRadial()
			.range([innerRadius, outerRadius]) // Domain will be define later.
			.domain([minValue, maxValue]); // Domain of Y is from 0 to the max seen in the data

		// Add the bars
		svg3
			.append("g")
			.selectAll("path")
			.data(data)
			.join("path")
			.attr("fill", couleurMin)
			.attr(
				"d",
				d3
					.arc() // imagine your doing a part of a donut plot
					.innerRadius(innerRadius)
					.outerRadius((d) => y(d.fuiteMoyenne))
					.startAngle((d) => x(d.date))
					.endAngle((d) => x(d.date) + x.bandwidth())
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
				return (x(d.date) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI
					? "end"
					: "start";
			})
			.attr("transform", function (d) {
				return (
					"rotate(" +
					(((x(d.date) + x.bandwidth() / 2) * 180) / Math.PI - 90) +
					")" +
					"translate(" +
					(y(d.fuiteMoyenne) + 10) +
					",0)"
				);
			})
			.append("text")
			.text(function (d) {
				let date = dateFormatDayMonthYear(new Date(d.date));
				console.log(date);
				return date;
			})
			.attr("transform", function (d) {
				return (x(d.date) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI
					? "rotate(180)"
					: "rotate(0)";
			})
			.style("font-size", "11px")
			.attr("alignment-baseline", "middle");
	});
};

circular("#circular_chart", dataCpap);

// circular("#circular_chart", dataCpap2023);

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

			// color palette (A voir parce que pour les autres, il y a que deux couleurs et ensuite cela se fait automatiquement)
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
