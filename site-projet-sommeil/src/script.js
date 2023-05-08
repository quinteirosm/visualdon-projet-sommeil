import * as d3 from "d3";

// Fonction qui trie une array par dates
function triArrayDate(array) {
	// Set les dates de début et de fin
	var dateDebut = new Date("2023-03-01");
	var dateFin = new Date("2023-03-31");
	// Converti les dates en timestamps pour pouvoir comparer
	var timestampDebut = dateDebut.getTime();
	var timestampFin = dateFin.getTime();

	// Boucle à l'envers pour ne pas casser les index
	for (var i = array.length - 1; i >= 0; i--) {
		// Converti la date en timestamp
		var timestamp = new Date(array[i].date).getTime();

		// Supprime l'objet si la date n'est pas comprise entre les deux timestamps
		if (timestamp < timestampDebut || timestamp > timestampFin) {
			array.splice(i, 1);
		}
	}

	array.sort(function (a, b) {
		return new Date(a.date) - new Date(b.date);
	});
}

// Fonction qui calcule le pourcentage de sommeil profond par nuit
function pourcentagePhaseProfondParNuit(array) {
	for (var i = 0; i < array.length; i++) {
		array[i].pourcentagePhaseProfond =
			(array[i].tempsSommeilProfond / 60 / array[i].dureeSommeil) * 100;
	}
}

let dataMiguel = d3
	.csv("./src/data/dataMiguel.csv", function (d) {
		return {
			date: d.date,
			tempsSommeilProfond: parseInt(d.deepSleepTime),
			tempsSommeilLeger: parseInt(d.shallowSleepTime),
			tempsSommeilParadoxal: parseInt(d.REMTime),
			nombreReveil: parseInt(d.wakeTime),
			heureCoucher: d.start,
		};
	})
	.then(function (data) {
		// Boucle sur les données pour donner la durée totale
		// Insertion en tant que nouvelle propriété
		for (var i = 0; i < data.length; i++) {
			data[i].dureeSommeil =
				(data[i].tempsSommeilProfond +
					data[i].tempsSommeilLeger +
					data[i].tempsSommeilParadoxal) /
				60;

			data[i].heureReveil = new Date(new Date(data[i].heureCoucher).getTime() + (data[i].dureeSommeil*3600000))
		}

		triArrayDate(data);

		console.log("dataMiguel");
		console.log(data);

		return data;
	})
	.catch(function (error) {
		console.log(error);
	});

let dataCpap = d3
	.csv("./src/data/cpap-original.csv", function (d) {
		return {
			heureReveil: d.approximatecreationdatetime,
			date: d.keys_sort_key.replace("SLEEP_RECORD#", ""),
			evenementHeure: parseFloat(d.score_detail_ahi),
			fuiteMoyenne: parseFloat(d.score_detail_leak_95_percentile),
			dureeSommeil: parseFloat(d.usage_hours),
		};
	})
	.then(function (data) {
		for (var i = 0; i < data.length; i++) {
			let heureReveilDate = new Date(data[i].heureReveil)
			data[i].heureCoucher = new Date(heureReveilDate.getTime() - (data[i].dureeSommeil*3600000));
		}

		triArrayDate(data);

		console.log("dataCpap");
		console.log(data);

		return data;
	})
	.catch(function (error) {
		console.log(error);
	});

let dataAppleWatch = d3
	.xml("./src/data/sleepdataAppleHealth2023AppleWatch.xml")
	.then(function (xml) {
		const records = xml.getElementsByTagName("Record");
		const data = [];
		// Création d'un objet pour chaque record, et push dans l'array data
		for (let i = 0; i < records.length; i++) {
				const obj = {
					date: new Date(records[i].getAttribute("creationDate")),
					valeur: records[i].getAttribute("value"),
					dureeSommeil: (new Date(records[i].getAttribute("endDate")).getTime() - new Date(records[i].getAttribute("startDate")).getTime())/60000,
				}
			data.push(obj);
		};
		triArrayDate(data)


		let dateSave
		let obj = {}
		let tabFinal = []
		for (let i = 0; i < data.length; i++) {
			if(i==0){
				dateSave = data[i].date;
				obj = {
					date: data[i].date,
					tempsSommeilLeger: data[i].valeur=="HKCategoryValueSleepAnalysisAsleepCore"?data[i].dureeSommeil:0,
					tempsSommeilParadoxal: data[i].valeur=="HKCategoryValueSleepAnalysisAsleepREM"?data[i].dureeSommeil:0,
					tempsSommeilProfond: data[i].valeur=="HKCategoryValueSleepAnalysisAsleepDeep"?data[i].dureeSommeil:0,
					duree:0,
				}
			}
			if(dateSave.getTime()!=data[i].date.getTime()){
				console.log('nouveau jour')
				dateSave = data[i].date;
				obj.duree = (obj.tempsSommeilLeger+obj.tempsSommeilParadoxal+obj.tempsSommeilProfond)/60
				tabFinal.push(obj)
				obj = {
					date: data[i].date,
					tempsSommeilLeger: data[i].valeur=="HKCategoryValueSleepAnalysisAsleepCore"?data[i].dureeSommeil:0,
					tempsSommeilParadoxal: data[i].valeur=="HKCategoryValueSleepAnalysisAsleepREM"?data[i].dureeSommeil:0,
					tempsSommeilProfond: data[i].valeur=="HKCategoryValueSleepAnalysisAsleepDeep"?data[i].dureeSommeil:0,
				}
			}else{
				if(i!=0){
					obj.tempsSommeilLeger+= data[i].valeur=="HKCategoryValueSleepAnalysisAsleepCore"?data[i].dureeSommeil:0
					obj.tempsSommeilParadoxal+= data[i].valeur=="HKCategoryValueSleepAnalysisAsleepREM"?data[i].dureeSommeil:0
					obj.tempsSommeilProfond+= data[i].valeur=="HKCategoryValueSleepAnalysisAsleepDeep"?data[i].dureeSommeil:0
				}
			}
			if(i==data.length-1){
				tabFinal.push(obj)
			}
		};
		console.log("dataAppleWatch");
		console.log(tabFinal)

		return data;
	})
	.catch(function (error) {
		console.log(error);
	});

export { dataMiguel, dataCpap, dataAppleWatch };

