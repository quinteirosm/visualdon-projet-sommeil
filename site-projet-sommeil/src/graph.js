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
		// // ----------------
		// // Create a tooltip
		// // ----------------
		// const tooltip = d3
		// 	.select(name)
		// 	.append("div")
		// 	.style("opacity", 0)
		// 	.attr("class", "tooltip")
		// 	.style("background-color", "#005fc8")
		// 	.style("border", "solid")
		// 	.style("border-width", "1px")
		// 	.style("border-radius", "5px")
		// 	.style("padding", "10px");

		// // Three function that change the tooltip when user hover / move / leave a cell
		// const mouseover = function (event, d) {
		// 	// valeur arrondie à 2 chiffres après la virgule
		// 	let valeur = Math.round(d * 100) / 100;

		// 	tooltip.html(`${valeur}`).style("opacity", 1);
		// };

		// const mousemove = function (event, d) {
		// 	tooltip
		// 		.html(`${valeur}`)
		// 		.style("opacity", 1)
		// 		.style("position", "absolute")
		// 		.style("left", event.pageX + "px")
		// 		.style("top", event.pageY + "px")
		// 		.style("z-index", 1000);
		// };

		// const mouseleave = function (event, d) {
		// 	tooltip.style("opacity", 0);
		// };

		let maxValue = 26;
		let minValue = 0;

		let tableauCopie = [...dataRecueAppleWatch];

		dataRecueCpap.forEach((element, index) => {
			let tempsProfond = tableauCopie[index].tempsSommeilProfond
				? tableauCopie[index].tempsSommeilProfond
				: 1;
			let dureeNuit = tableauCopie[index].duree ? tableauCopie[index].duree : 1;

			let pourcentageProfond = 0;

			if (tempsProfond == 1 || dureeNuit == 1) {
				pourcentageProfond = 0;
			} else {
				pourcentageProfond = (tempsProfond / (dureeNuit * 60)) * 100;
			}

			dates.push(element.date);
			values.push(pourcentageProfond);
		});

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
		// .on("mouseover", mouseover)
		// .on("mousemove", mousemove)
		// .on("mouseleave", mouseleave);

		// Insertion de texte dans chaque case
		rows
			.selectAll("text")
			.data((d) => d)
			.enter()
			.append("text")
			.attr(
				"x",
				(d, i) =>
					(i % nbCols) * rectWidth +
					Math.floor(i / nbCols) * dates.length * rectWidth +
					10
			)
			.attr("y", (d, i) => Math.floor(i / nbCols) * rectHeight + 20)
			.text((d) => Math.round(d * 100) / 100 + "%")
			.attr("fill", "black");
	});
};

heatmapProfondPatrick(".heatmap_profond_patrick", [dataCpap, dataAppleWatch]);
heatmapProfondPatrick(".heatmap_profond_patrick_deux", [
	dataCpap,
	dataAppleWatch,
]);

// const heatmapApneePatrick = (name, donnees) => {
// 	const dates = [];
// 	const values = [];

// 	donnees.then((dataRecue) => {
// 		// // ----------------
// 		// // Create a tooltip
// 		// // ----------------
// 		// const tooltip = d3
// 		// 	.select(name)
// 		// 	.append("div")
// 		// 	.style("opacity", 0)
// 		// 	.attr("class", "tooltip")
// 		// 	.style("background-color", "#005fc8")
// 		// 	.style("border", "solid")
// 		// 	.style("border-width", "1px")
// 		// 	.style("border-radius", "5px")
// 		// 	.style("padding", "10px");

// 		// // Three function that change the tooltip when user hover / move / leave a cell
// 		// const mouseover = function (event, d) {
// 		// 	// valeur arrondie à 2 chiffres après la virgule
// 		// 	let valeur = Math.round(d * 100) / 100;

// 		// 	tooltip.html(`${valeur}`).style("opacity", 1);
// 		// };
// 		// const mousemove = function (event, d) {
// 		// 	tooltip
// 		// 		.style("transform", "translateY(-55%)")
// 		// 		.style("left", event.x / 2 + "px")
// 		// 		.style("top", event.y / 2 - 30 + "px");
// 		// };
// 		// const mouseleave = function (event, d) {
// 		// 	tooltip.style("opacity", 0);
// 		// };

// 		let maxValue = 0;
// 		let minValue = 100;

// 		dataRecue.forEach((element) => {
// 			dates.push(element.date);
// 			values.push(element.evenementHeure);

// 			if (element.evenementHeure > maxValue) {
// 				maxValue = element.evenementHeure;
// 			}
// 			if (element.evenementHeure < minValue) {
// 				minValue = element.evenementHeure;
// 			}
// 		});

// 		const colorScale = d3
// 			.scaleLinear()
// 			.domain([minValue, maxValue])
// 			.range([couleurMin, couleurMax]);

// 		let compteur = 0;
// 		const data = [];
// 		for (let i = 0; i < dates.length; i++) {
// 			data[i] = [];
// 			for (let j = 0; j < nbCols; j++) {
// 				data[i][j] = values[compteur];
// 				compteur++;
// 				// data[i][j] = Math.floor(Math.random() * 11); // Remplacer par vos propres données
// 			}
// 		}

// 		const svg = d3
// 			.select(name)
// 			.append("svg")
// 			.attr("width", width)
// 			.attr("height", height);

// 		const rows = svg
// 			.selectAll("g")
// 			.data(data)
// 			.enter()
// 			.append("g")
// 			.attr("transform", (d, i) => `translate(0, ${i * rectHeight})`);

// 		const rects = rows
// 			.selectAll("rect")
// 			.data((d) => d)
// 			.enter()
// 			.append("rect")
// 			.attr(
// 				"x",
// 				(d, i) =>
// 					(i % nbCols) * rectWidth +
// 					Math.floor(i / nbCols) * dates.length * rectWidth
// 			)
// 			.attr("y", (d, i) => Math.floor(i / nbCols) * rectHeight)
// 			.attr("width", rectWidth)
// 			.attr("height", rectHeight)
// 			.attr("fill", (d) => colorScale(d));
// 		// .on("mouseover", mouseover)
// 		// .on("mousemove", mousemove)
// 		// .on("mouseleave", mouseleave);

// 		// Insertion de texte dans chaque case
// 		rows
// 			.selectAll("text")
// 			.data((d) => d)
// 			.enter()
// 			.append("text")
// 			.attr(
// 				"x",
// 				(d, i) =>
// 					(i % nbCols) * rectWidth +
// 					Math.floor(i / nbCols) * dates.length * rectWidth +
// 					10
// 			)
// 			.attr("y", (d, i) => Math.floor(i / nbCols) * rectHeight + 20)
// 			.text((d) => d)
// 			.attr("fill", "black");
// 	});
// };

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
			}
		}

		const svg = d3
			.select(name)
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", `translate(${margin.left + 40}, ${margin.top})`);

		const rows = svg
			.selectAll("g")
			.data(data.slice(0, 6))
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

		const rowDates = [
			"01.03 - 05.03",
			"06.03 - 10.03",
			"11.03 - 15.03",
			"16.03 - 20.03",
			"21.03 - 25.03",
			"26.03 - 30.03",
		];

		const yScale = d3.scaleBand().domain(rowDates).range([0, height]);

		const yAxis = d3.axisLeft(yScale);
		svg.append("g").attr("class", "axis").call(yAxis);

		rows
			.selectAll("text")
			.data((d) => d)
			.enter()
			.append("text")
			.attr(
				"x",
				(d, i) =>
					(i % nbCols) * rectWidth +
					Math.floor(i / nbCols) * dates.length * rectWidth +
					10
			)
			.attr("y", (d, i) => Math.floor(i / nbCols) * rectHeight + 20)
			.text((d) => d)
			.attr("fill", "black");
	});
};

heatmapApneePatrick(".heatmap_nb_apnee", dataCpap);

const heatmapProfondMiguel = (name, donnees) => {
	const dates = [];
	const values = [];

	donnees.then((dataRecue) => {
		let maxValue = 26;
		let minValue = 0;

		dataRecue.forEach((element) => {
			dates.push(element.heureReveil);
			values.push(element.pourcentagePhaseProfond);
		});

		const colorScale = d3
			.scaleLinear()
			.domain([minValue, maxValue])
			.range([couleurMin, couleurMax]);

		let compteur = 0;
		const data = [];
		for (let i = 0; i < dates.length - 1; i++) {
			// Modifier ici pour exclure la dernière ligne
			data[i] = [];
			for (let j = 0; j < nbCols; j++) {
				data[i][j] = values[compteur];
				compteur++;
			}
		}

		const svg = d3
			.select(name)
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", `translate(${margin.left + 40}, ${margin.top})`);

		const rows = svg
			.selectAll("g")
			.data(data.slice(0, 6))
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
			.attr("y", 0)
			.attr("width", rectWidth)
			.attr("height", rectHeight)
			.attr("fill", (d) => colorScale(d));

		const rowDates = [
			"01.03 - 05.03",
			"06.03 - 10.03",
			"11.03 - 15.03",
			"16.03 - 20.03",
			"21.03 - 25.03",
			"26.03 - 30.03",
		];

		const yScale = d3.scaleBand().domain(rowDates).range([0, height]);

		const yAxis = d3.axisLeft(yScale);
		svg.append("g").attr("class", "axis").call(yAxis);

		rows
			.selectAll("text")
			.data((d) => d)
			.enter()
			.append("text")
			.attr(
				"x",
				(d, i) =>
					(i % nbCols) * rectWidth +
					Math.floor(i / nbCols) * dates.length * rectWidth +
					10
			)
			.attr("y", 20)
			.text((d) => Math.round(d * 100) / 100 + "%")
			.attr("fill", "black");
	});
};

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
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", `translate(${60},${margin.top})`);

	donnees.then((data) => {
		// ----------------
		// Create a tooltip
		// ----------------
		const tooltip = d3
			.select(name)
			.append("div")
			.style("opacity", 0)
			.attr("class", "tooltip")
			.style("background-color", "#005fc8")
			.style("border", "solid")
			.style("border-width", "1px")
			.style("border-radius", "5px")
			.style("padding", "10px");

		// Three function that change the tooltip when user hover / move / leave a cell
		const mouseover = function (event, d) {
			let apneeSingulierPluriel = d.evenementHeure > 1 ? "apnées" : "apnée";

			tooltip
				.html(`${d.evenementHeure} ${apneeSingulierPluriel}/heure`)
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

		// Y axis
		const y = d3
			.scaleBand()
			.range([0, height])
			.domain(
				data.map((d) => {
					// Si nous mettons la date au bon format, le graph n'affichera que la première ligne
					//let date = dateFormatDayMonthYear(new Date(d.date));
					return d.date;
				})
			)
			.padding(0.2);

		svg.append("g").call(d3.axisLeft(y));

		// Add X axis
		const x = d3.scaleLinear().domain([0, maxValue]).range([0, width]);
		svg
			.append("g")
			.attr("transform", `translate(0, ${height})`)
			.call(d3.axisBottom(x));

		// Bars
		svg
			.selectAll("mybar")
			.data(data)
			.join("rect")
			.attr("y", (d) => y(d.date))
			.attr("height", y.bandwidth())
			.attr("fill", couleurMin)
			.attr("x", (d) => x(0))
			.attr("width", (d) => x(d.evenementHeure))
			.on("mouseover", mouseover)
			.on("mousemove", mousemove)
			.on("mouseleave", mouseleave);

		// Animation
		svg
			.selectAll("rect")
			.transition()
			.duration(800)
			.attr("x", (d) => x(0))
			.attr("width", (d) => x(d.evenementHeure))
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
	const svg = d3
		.select(name)
		.append("svg")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr(
			"transform",
			`translate(${width / 2 + margin.left}, ${height / 2 + margin.top + 10})`
		);

	donnees.then((data) => {
		// ----------------
		// Create a tooltip
		// ----------------
		const tooltip = d3
			.select(name)
			.append("div")
			.style("opacity", 0)
			.attr("class", "tooltip")
			.style("background-color", "#005fc8")
			.style("border", "solid")
			.style("border-width", "1px")
			.style("border-radius", "5px")
			.style("padding", "10px");

		// Three function that change the tooltip when user hover / move / leave a cell
		const mouseover = function (event, d) {
			let litreSingulierPluriel = d.fuiteMoyenne > 1 ? "litres" : "litre";

			let supplementDeTexteSiPasDeFuite = "";

			if (d.fuiteMoyenne == 0 && d.evenementHeure == 0) {
				supplementDeTexteSiPasDeFuite = `<br> L'appareil n'a pas été utilisé.`;
			}
			if (d.fuiteMoyenne == 0 && d.evenementHeure > 0) {
				supplementDeTexteSiPasDeFuite = `<br> L'appareil a bel et bien été utilisé mais il n'y a pas eu de fuite.`;
			}

			tooltip
				.html(
					`${d.fuiteMoyenne} ${litreSingulierPluriel}/minute ${supplementDeTexteSiPasDeFuite}`
				)
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
		svg
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
			)
			.on("mouseover", mouseover)
			.on("mousemove", mousemove)
			.on("mouseleave", mouseleave);

		// Add the labels
		svg
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
			.attr("alignment-baseline", "middle")
			.on("mouseover", mouseover)
			.on("mousemove", mousemove)
			.on("mouseleave", mouseleave);
	});
};

circular("#circular_chart", dataCpap);

// circular("#circular_chart", dataCpap2023);

const line = (name, donnees) => {
	// append the svg object to the body of the page
	const svg = d3
		.select(name)
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", `translate(${margin.left},${margin.top})`);

	d3.csv("./sommeilprofond.csv").then(function (data) {
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
		const y = d3
			.scaleLinear()
			.domain([0, 7.25 * 60])
			.range([height, 0]);
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
			.style("background-color", "#005fc8")
			.style("border", "solid")
			.style("border-width", "1px")
			.style("border-radius", "5px")
			.style("padding", "10px");

		// Three function that change the tooltip when user hover / move / leave a cell
		const mouseover = function (event, d) {
			const subgroupName = d3.select(this.parentNode).datum().key;
			const subgroupValue = d.data[subgroupName];
			tooltip
				.html("Sommeil " + subgroupName + "<br>" + subgroupValue + " min")
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
			.attr("fill", (d) => {
				console.log("d.key : " + d.key);
				return color(d.key);
			})
			.selectAll("rect")
			// enter a second time = loop subgroup per subgroup to add all rectangles
			.data((d) => d)
			.join("rect")
			.attr("x", (d) => x(d.data.personne))
			.attr("y", (d) => y(d[1]))
			.attr("height", (d) => y(d[0]) - y(d[1]))
			.attr("width", x.bandwidth())
			.attr("stroke", "white")
			.on("mouseover", mouseover)
			.on("mousemove", mousemove)
			.on("mouseleave", mouseleave);
	});
};

line("#line_chart", [dataMiguel, dataAppleWatch]);
