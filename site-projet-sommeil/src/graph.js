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

const margin = { top: 30, right: 30, bottom: 30, left: 30 },
	width = 500,
	height = 500;

const rectWidth = width / 5;
const rectHeight = height / 6;

const couleurMin = "#FFFFFF";
const couleurMilieu = "#00A6FF";
const couleurMax = "#0154C2";

/*
 * HEATMAP
 */

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

		dataRecueCpap.forEach((element, index) => {
			let tempsProfond = tableauCopie[index].tempsSommeilProfond
				? tableauCopie[index].tempsSommeilProfond
				: 1;
			let dureeNuit = element.dureeSommeil;

			let pourcentageProfondAppleWatchEtNuitCpap = 0;

			if (!tempsProfond) {
				tempsProfond = 1;
			}

			if (!dureeNuit) {
				dureeNuit = 1;
			}

			console.log("tempsProfond : " + tempsProfond);
			console.log("dureeNuit : " + dureeNuit);

			if (tempsProfond == 1 || dureeNuit == 1) {
				pourcentageProfondAppleWatchEtNuitCpap = 0;
			} else {
				pourcentageProfondAppleWatchEtNuitCpap =
					(tempsProfond / (dureeNuit * 60)) * 100;
			}

			// console.log("pourcentage : " + pourcentageProfondAppleWatchEtNuitCpap);

			dates.push(element.date);
			values.push(pourcentageProfondAppleWatchEtNuitCpap);

			// console.log(pourcentageProfondAppleWatchEtNuitCpap);

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

heatmapProfondPatrick(".heatmap_profond_patrick_deux", [
	dataCpap,
	dataAppleWatch,
]);
heatmapProfondMiguel(".heatmap_profond_miguel", dataMiguel);

/*
 * BAR CHART
 */

const bar = (name, donnees) => {
	// append the svg object to the body of the page
	const svg = d3
		.select(name)
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + 100)
		// .attr("width", width)
		// .attr("height", height)
		.append("g")
		.attr("transform", `translate(${margin.left},${margin.top})`);

	donnees.then(function (data) {
		let maxValue = 0;
		let minValue = 100;

		data.forEach((element) => {
			if (element.evenementHeure > maxValue) {
				maxValue = element.evenementHeure;
			}
			if (element.evenementHeure < minValue) {
				minValue = element.evenementHeure;
			}
		});

		// X axis
		const x = d3
			.scaleBand()
			.range([0, width - margin.left - margin.right])
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
		const y = d3.scaleLinear().domain([0, maxValue]).range([height, 0]);
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

/*
 * GRAPH CIRCULAIRE
 */

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
 * LIGNES
 */

// const line = (name, donnees) => {
// 	// append the svg object to the body of the page
// 	const svg = d3
// 		.select(name)
// 		.append("svg")
// 		.attr("width", width + margin.left + margin.right)
// 		.attr("height", height + margin.top + margin.bottom)
// 		.append("g")
// 		.attr("transform", `translate(${margin.left},${margin.top})`);

// 	//Read the data
// 	d3
// 		.csv(
// 			"https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered.csv"
// 		)
// 		.then(function (data) {
// 			// group the data: I want to draw one line per group
// 			const sumstat = d3.group(data, (d) => d.name); // nest function allows to group the calculation per level of a factor

// 			// Add X axis --> it is a date format
// 			const x = d3
// 				.scaleLinear()
// 				.domain(
// 					d3.extent(data, function (d) {
// 						return d.year;
// 					})
// 				)
// 				.range([0, width]);
// 			svg
// 				.append("g")
// 				.attr("transform", `translate(0, ${height})`)
// 				.call(d3.axisBottom(x).ticks(5));

// 			// Add Y axis
// 			const y = d3
// 				.scaleLinear()
// 				.domain([
// 					0,
// 					d3.max(data, function (d) {
// 						return +d.n;
// 					}),
// 				])
// 				.range([height, 0]);
// 			svg.append("g").call(d3.axisLeft(y));

// 			// color palette (A voir parce que pour les autres, il y a que deux couleurs et ensuite cela se fait automatiquement)
// 			const color = d3
// 				.scaleOrdinal()
// 				.range([
// 					"#e41a1c",
// 					"#377eb8",
// 					"#4daf4a",
// 					"#984ea3",
// 					"#ff7f00",
// 					"#ffff33",
// 					"#a65628",
// 					"#f781bf",
// 					"#999999",
// 				]);

// 			// Draw the line
// 			svg
// 				.selectAll(".line")
// 				.data(sumstat)
// 				.join("path")
// 				.attr("fill", "none")
// 				.attr("stroke", function (d) {
// 					return color(d[0]);
// 				})
// 				.attr("stroke-width", 1.5)
// 				.attr("d", function (d) {
// 					return d3
// 						.line()
// 						.x(function (d) {
// 							return x(d.year);
// 						})
// 						.y(function (d) {
// 							return y(+d.n);
// 						})(d[1]);
// 				});
// 		});
// };

const line = (name, donnees) => {
	// append the svg object to the body of the page
	const svg = d3
		.select(name)
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", `translate(${margin.left},${margin.top})`);

	d3.csv("./test.csv").then(function (data) {
		// Promise.all(donnees).then(([dataRecueMiguel, dataRecueAppleWatch]) => {
		// 	const id = 10;

		// 	const nuitMiguel = {
		// 		leger: dataRecueMiguel[id].tempsSommeilLeger,
		// 		paradoxale: dataRecueMiguel[id].tempsSommeilParadoxal,
		// 		profond: dataRecueMiguel[id].tempsSommeilProfond,
		// 	};
		// 	const nuitPatrick = {
		// 		leger: dataRecueAppleWatch[id].tempsSommeilLeger,
		// 		paradoxale: dataRecueAppleWatch[id].tempsSommeilParadoxal,
		// 		profond: dataRecueAppleWatch[id].tempsSommeilProfond,
		// 	};

		// 	console.log(nuitMiguel);
		// 	console.log(nuitPatrick);

		// 	let sleepData = [
		// 		{
		// 			dataMiguelComparaison: {
		// 				leger: dataRecueMiguel[id].tempsSommeilLeger,
		// 				paradoxale: dataRecueMiguel[id].tempsSommeilParadoxal,
		// 				profond: dataRecueMiguel[id].tempsSommeilProfond,
		// 			},
		// 		},
		// 		{
		// 			dataAppleWatchComparaison: {
		// 				leger: dataRecueAppleWatch[id].tempsSommeilLeger,
		// 				paradoxale: dataRecueAppleWatch[id].tempsSommeilParadoxal,
		// 				profond: dataRecueAppleWatch[id].tempsSommeilProfond,
		// 			},
		// 		},
		// 	];

		// 	let data = sleepData;

		// List of subgroups = header of the csv files = soil condition here
		const subgroups = data.columns.slice(1);

		// List of groups = species here = value of the first column called group -> I show them on the X axis
		const groups = data.map((d) => d.personne);

		// Add X axis
		const x = d3.scaleBand().domain(groups).range([0, width]).padding([0.2]);
		svg
			.append("g")
			.attr("transform", `translate(0, ${height})`)
			.call(d3.axisBottom(x).tickSizeOuter(0));

		// Add Y axis
		const y = d3.scaleLinear().domain([0, 550]).range([height, 0]);
		svg.append("g").call(d3.axisLeft(y));

		// color palette = one color per subgroup
		const color = d3
			.scaleOrdinal()
			.domain(subgroups)
			.range([couleurMin, couleurMilieu, couleurMax]);

		//stack the data? --> stack per subgroup
		const stackedData = d3.stack().keys(subgroups)(data);

		// ----------------
		// Create a tooltip
		// ----------------
		const tooltip = d3
			.select(name)
			.append("div")
			.style("opacity", 0)
			.attr("class", "tooltip")
			.style("background-color", "white")
			.style("border", "solid")
			.style("border-width", "1px")
			.style("border-radius", "5px")
			.style("padding", "10px");

		// Three function that change the tooltip when user hover / move / leave a cell
		const mouseover = function (event, d) {
			const subgroupName = d3.select(this.parentNode).datum().key;
			const subgroupValue = d.data[subgroupName];
			tooltip
				.html("subgroup: " + subgroupName + "<br>" + "Value: " + subgroupValue)
				.style("opacity", 1);
		};
		const mousemove = function (event, d) {
			tooltip
				.style("transform", "translateY(-55%)")
				.style("left", event.x / 2 + "px")
				.style("top", event.y / 2 - 30 + "px");
		};
		const mouseleave = function (event, d) {
			tooltip.style("opacity", 0);
		};

		// Show the bars
		svg
			.append("g")
			.selectAll("g")
			// Enter in the stack data = loop key per key = group per group
			.data(stackedData)
			.join("g")
			.attr("fill", (d) => color(d.key))
			.selectAll("rect")
			// enter a second time = loop subgroup per subgroup to add all rectangles
			.data((d) => d)
			.join("rect")
			.attr("x", (d) => x(d.data.personne))
			.attr("y", (d) => y(d[1]))
			.attr("height", (d) => y(d[0]) - y(d[1]))
			.attr("width", x.bandwidth())
			.attr("stroke", "grey")
			.on("mouseover", mouseover)
			.on("mousemove", mousemove)
			.on("mouseleave", mouseleave);
	});
};

line("#line_chart", [dataMiguel, dataAppleWatch]);
