"use strict";

// Vérifier si le navigateur est Google Chrome
var isChrome =
	/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

// Vérifier si le navigateur est Chromium (basé sur Chrome)
var isChromium =
	/Chromium/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

// Vérifier si le navigateur est Opera (basé sur Chromium)
var isOpera =
	/OPR/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

// Vérifier si le navigateur est Microsoft Edge (basé sur Chromium)
var isEdge =
	/Edg/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

// Afficher une alerte si le navigateur n'est pas Google Chrome
if (!isChrome && !isChromium && !isOpera && !isEdge) {
	alert(
		"Bonjour,\nNavré de vous apprendre que ce site est optimisé pour Google Chrome.\nVeuillez utiliser ce navigateur pour une meilleure expérience.\nMerci beaucoup.\nL'équipe de SleepCompare ♡"
	);
}

import * as d3 from "d3";

import {
	dataMiguel,
	dataCpap,
	dataCpap2023,
	dataAppleWatch,
	dateFormatDayMonthYear,
} from "./script.js";

const nbCols = 5; // Nombre de colonnes

// Variables globale pour les dimensions des graphs, sera modifié si nécessaire dans les graphs
const margin = { top: 30, right: 30, bottom: 30, left: 30 },
	width = 500,
	height = 500;

// Dimensions des rectangles des heatmaps
const rectWidth = width / 5;
const rectHeight = height / 6;

// Couleurs utilisées pour les graphs
const couleurMin = "#FFFFFF";
const couleurMilieu = "#00A6FF";
const couleurMax = "#0154C2";

// Utilisé pour les libellés des heatmaps
const rowDates = [
	"01.03 - 05.03",
	"06.03 - 10.03",
	"11.03 - 15.03",
	"16.03 - 20.03",
	"21.03 - 25.03",
	"26.03 - 30.03",
];

/*
 * HEATMAP
 */

const heatmapProfondPatrick = (name, donnees) => {
	const dates = [];
	const values = [];

	Promise.all(donnees).then(([dataRecueCpap, dataRecueAppleWatch]) => {
		let maxValue = 26;
		let minValue = 0;

		let tableauCopie = [...dataRecueAppleWatch];

		// Insertion de données et si manquantes, ajout de 1
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

		// On récupère les valeurs min et max pour les couleurs
		const colorScale = d3
			.scaleLinear()
			.domain([minValue, maxValue])
			.range([couleurMin, couleurMax]);

		// On crée un tableau de données pour les heatmaps
		let compteur = 0;
		const data = [];
		for (let i = 0; i < dates.length; i++) {
			data[i] = [];
			for (let j = 0; j < nbCols; j++) {
				data[i][j] = values[compteur];
				compteur++;
			}
		}

		// On crée le SVG
		const svg = d3
			.select(name)
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", `translate(${margin.left + 40}, ${margin.top})`);

		// On crée les lignes
		const rows = svg
			.selectAll("g")
			.data(data.slice(0, 6))
			.enter()
			.append("g")
			.attr("transform", (d, i) => `translate(0, ${i * rectHeight})`);

		// On crée les rectangles
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

		// On crée l'axe Y et on mets les dates
		const yScale = d3.scaleBand().domain(rowDates).range([0, height]);

		// On crée l'axe Y
		const yAxis = d3.axisLeft(yScale);
		svg.append("g").attr("class", "axis").call(yAxis);

		// On crée les libellés
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

// Appel des fonctions pour les heatmaps
heatmapProfondPatrick(".heatmap_profond_patrick", [dataCpap, dataAppleWatch]);
heatmapProfondPatrick(".heatmap_profond_patrick_deux", [
	dataCpap,
	dataAppleWatch,
]);

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

		// On récupère les valeurs min et max pour les couleurs
		const colorScale = d3
			.scaleLinear()
			.domain([minValue, maxValue])
			.range([couleurMin, couleurMax]);

		// On crée un tableau de données pour les heatmaps
		let compteur = 0;
		const data = [];
		for (let i = 0; i < dates.length; i++) {
			data[i] = [];
			for (let j = 0; j < nbCols; j++) {
				data[i][j] = values[compteur];
				compteur++;
			}
		}

		// On crée le SVG
		const svg = d3
			.select(name)
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", `translate(${margin.left + 40}, ${margin.top})`);

		// On crée les lignes
		const rows = svg
			.selectAll("g")
			.data(data.slice(0, 6))
			.enter()
			.append("g")
			.attr("transform", (d, i) => `translate(0, ${i * rectHeight})`);

		// On crée les rectangles
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

		// On crée l'axe Y et on mets les dates
		const yScale = d3.scaleBand().domain(rowDates).range([0, height]);

		// On crée l'axe Y
		const yAxis = d3.axisLeft(yScale);
		svg.append("g").attr("class", "axis").call(yAxis);

		// On crée les libellés
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

// Appel des fonctions pour les heatmaps
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

		// On récupère les valeurs min et max pour les couleurs
		const colorScale = d3
			.scaleLinear()
			.domain([minValue, maxValue])
			.range([couleurMin, couleurMax]);

		// On crée un tableau de données pour les heatmaps
		let compteur = 0;
		const data = [];
		for (let i = 0; i < dates.length - 1; i++) {
			data[i] = [];
			for (let j = 0; j < nbCols; j++) {
				data[i][j] = values[compteur];
				compteur++;
			}
		}

		// On crée le SVG
		const svg = d3
			.select(name)
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", `translate(${margin.left + 40}, ${margin.top})`);

		// On crée les lignes
		const rows = svg
			.selectAll("g")
			.data(data.slice(0, 6))
			.enter()
			.append("g")
			.attr("transform", (d, i) => `translate(0, ${i * rectHeight})`);

		// On crée les rectangles
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

		// On crée l'axe Y et on mets les dates
		const yScale = d3.scaleBand().domain(rowDates).range([0, height]);

		// On crée l'axe Y
		const yAxis = d3.axisLeft(yScale);
		svg.append("g").attr("class", "axis").call(yAxis);

		// On crée les libellés
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

// Appel des fonctions pour les heatmaps
heatmapProfondMiguel(".heatmap_profond_miguel", dataMiguel);

/*
 * BAR CHART
 */

const bar = (name, donnees) => {
	// Ajout du SVG
	const svg = d3
		.select(name)
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", `translate(${60},${margin.top})`);

	donnees.then((data) => {
		// ----------------
		// Création du tooltip
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

		// Trois fonctions qui changent le tooltip quand l'utilisateur survole / bouge / quitte une cellule
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

		// Création de l'axe X
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

// Appel des fonctions pour les bar charts
bar("#bar_chart", dataCpap);

/*
 * GRAPH CIRCULAIRE
 */

const circular = (name, donnees) => {
	const innerRadius = 90;
	const outerRadius = Math.min(width, height) / 2;

	// Ajout du SVG
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

		// On crée les fonctions qui changent le tooltip quand l'utilisateur survole / bouge / quitte une cellule
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
			.range([0, 2 * Math.PI])
			.align(0)
			.domain(data.map((d) => d.date));

		// On crée les échelles
		const y = d3
			.scaleRadial()
			.range([innerRadius, outerRadius])
			.domain([minValue, maxValue]);

		// Ajout des axes
		svg
			.append("g")
			.selectAll("path")
			.data(data)
			.join("path")
			.attr("fill", couleurMin)
			.attr(
				"d",
				d3
					.arc() // Imaginez que vous faites une partie d'un graphique en anneau
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

		// Ajout des libellés
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
// Si on veut afficher les données de 2023 on décommente la ligne suivante et on commente la ligne précédent ce commentaire
// circular("#circular_chart", dataCpap2023);

const line = (name, donnees) => {
	// Ajout du SVG
	const svg = d3
		.select(name)
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", `translate(${margin.left},${margin.top})`);

	// Nous avons du mettre à la main les données dans un fichier csv pour pouvoir les utiliser avec d3 en raison de la complexité de la structure de données et de la difficulté à les manipuler avec d3
	// Nous avons recherché manuellement deux nuits de la même durée approximative pour pouvoir comparer les données

	d3.csv("./sommeilprofond.csv").then(function (data) {
		const subgroups = data.columns.slice(1);

		const groups = data.map((d) => d.personne);

		// Ajout de l'axe X
		const x = d3.scaleBand().domain(groups).range([0, width]).padding([0.2]);
		svg
			.append("g")
			.attr("transform", `translate(0, ${height})`)
			.call(d3.axisBottom(x).tickSizeOuter(0));

		// Ajout de l'axe Y
		const y = d3
			.scaleLinear()
			.domain([0, 7.25 * 60])
			.range([height, 0]);
		svg.append("g").call(d3.axisLeft(y));

		// Ajout des couleurs
		const color = d3
			.scaleOrdinal()
			.domain(subgroups)
			.range([couleurMin, couleurMilieu, couleurMax]);

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

		// On crée les fonctions qui changent le tooltip quand l'utilisateur survole / bouge / quitte une cellule
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

		// Afficher des barres
		svg
			.append("g")
			.selectAll("g")
			.data(stackedData)
			.join("g")
			.attr("fill", (d) => {
				console.log("d.key : " + d.key);
				return color(d.key);
			})
			.selectAll("rect")
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

// Appel des fonctions pour les bar charts
line("#line_chart", [dataMiguel, dataAppleWatch]);
