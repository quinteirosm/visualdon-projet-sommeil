import * as d3 from "d3";

// Fonction qui trie une array pour ne retenir que le mois de mars 2023
export function triArrayDate(array) {
	// Set les dates de début et de fin
	var dateDebut = new Date("2023-03-01");
	var dateFin = new Date("2023-03-30");
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

// Fonction qui trie une array pour ne retenir que l'année 2023
export function triArrayDate2023(array) {
	// Set les dates de début et de fin
	var dateDebut = new Date("2023-01-01");
	var dateFin = new Date("2023-12-31");
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

// Fonction qui parse une date en format "jour mois année" avec le mois en lettres
export function dateFormatDayMonthYear(date) {
  let options = { month: "long" };
  let moisEnLettres = new Intl.DateTimeFormat("fr-FR", options).format(date);

  console.log(moisEnLettres);
}

// Fonction qui parse une date en format "mois année" avec le mois en lettres
export function dateFormatMonthYear(date) {
  const options = { year: "numeric", month: "long" };
  const moisEtAnnee = date.toLocaleDateString("fr-FR", options);

  console.log(moisEtAnnee);
}

// Fonction qui calcule le pourcentage de sommeil profond par nuit pour miguel
function pourcentagePhaseProfondParNuitMi(array) {
  for (var i = 0; i < array.length; i++) {
    array[i].pourcentagePhaseProfond =
      (array[i].tempsSommeilProfond / 60 / array[i].dureeSommeil) * 100;
  }
}

// Fetch, parse, trie et retourne les données de dataMiguel.csv
let dataMiguel = d3
  .csv("./dataMiguel.csv", function (d) {
    return {
      date: d.date || 0,
      tempsSommeilProfond: parseInt(d.deepSleepTime) || 0,
      tempsSommeilLeger: parseInt(d.shallowSleepTime) || 0,
      tempsSommeilParadoxal: parseInt(d.REMTime) || 0,
      nombreReveil: parseInt(d.wakeTime) || 0,
      heureCoucher: d.start || 0,
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

      data[i].heureReveil = new Date(
        new Date(data[i].heureCoucher).getTime() +
          data[i].dureeSommeil * 3600000
      );
    }

    triArrayDate(data);
    pourcentagePhaseProfondParNuitMi(data);
    console.log("dataMiguel");
    console.log(data);

    return data;
  })
  .catch(function (error) {
    console.log(error);
  });

// Fetch, parse, trie et retourne les données de dataCpap.csv
let dataCpap = d3
  .csv("./cpap-original.csv", function (d) {
    return {
      heureReveil: d.approximatecreationdatetime || 0,
      date: d.keys_sort_key.replace("SLEEP_RECORD#", "") || 0,
      evenementHeure: parseFloat(d.score_detail_ahi) || 0,
      fuiteMoyenne: parseFloat(d.score_detail_leak_95_percentile) || 0,
      dureeSommeil: parseFloat(d.usage_hours) || 0,
    };
  })
  .then(function (data) {
    for (var i = 0; i < data.length; i++) {
      let heureReveilDate = new Date(data[i].heureReveil);
      data[i].heureCoucher = new Date(
        heureReveilDate.getTime() - data[i].dureeSommeil * 3600000
      );
    }

    triArrayDate(data);

    console.log("dataCpap");
    console.log(data);

    return data;
  })
  .catch(function (error) {
    console.log(error);
  });

// Fetch, parse, trie et retourne les données de dataCpap2023.csv
let dataCpap2023 = d3
  .csv("./cpap-original.csv", function (d) {
    return {
      heureReveil: d.approximatecreationdatetime || 0,
      date: d.keys_sort_key.replace("SLEEP_RECORD#", "") || 0,
      evenementHeure: parseFloat(d.score_detail_ahi) || 0,
      fuiteMoyenne: parseFloat(d.score_detail_leak_95_percentile) || 0,
      dureeSommeil: parseFloat(d.usage_hours) || 0,
    };
  })
  .then(function (data) {
    for (var i = 0; i < data.length; i++) {
      let heureReveilDate = new Date(data[i].heureReveil);
      data[i].heureCoucher = new Date(
        heureReveilDate.getTime() - data[i].dureeSommeil * 3600000
      );
    }

    triArrayDate2023(data);

    console.log("dataCpapYear");
    console.log(data);

    return data;
  })
  .catch(function (error) {
    console.log(error);
  });

// Fetch, parse, trie et retourne les données de dataAppleWatch.csv
let dataAppleWatch = d3
  .xml("./sleepdataAppleHealth2023AppleWatch.xml")
  .then(function (xml) {
    const records = xml.getElementsByTagName("Record");
    const data = [];
    // Création d'un objet pour chaque record, et push dans l'array data
    for (let i = 0; i < records.length; i++) {
      const obj = {
        date: new Date(records[i].getAttribute("creationDate")) || 0,
        valeur: records[i].getAttribute("value") || 0,
        dureeSommeil:
          (new Date(records[i].getAttribute("endDate")).getTime() -
            new Date(records[i].getAttribute("startDate")).getTime()) /
            60000 || 0,
      };
      data.push(obj);
    }
    let dateSave;
    let obj = {};
    let tabFinal = [];
    for (let i = 0; i < data.length; i++) {
      if (i == 0) {
        dateSave = data[i].date;
        obj = {
          date: data[i].date,
          tempsSommeilLeger:
            data[i].valeur == "HKCategoryValueSleepAnalysisAsleepCore"
              ? data[i].dureeSommeil
              : 0,
          tempsSommeilParadoxal:
            data[i].valeur == "HKCategoryValueSleepAnalysisAsleepREM"
              ? data[i].dureeSommeil
              : 0,
          tempsSommeilProfond:
            data[i].valeur == "HKCategoryValueSleepAnalysisAsleepDeep"
              ? data[i].dureeSommeil
              : 0,
          duree: 0,
        };
      }
      if (dateSave.getTime() != data[i].date.getTime()) {
        dateSave = data[i].date;
        obj.duree =
          (obj.tempsSommeilLeger +
            obj.tempsSommeilParadoxal +
            obj.tempsSommeilProfond) /
          60;
        tabFinal.push(obj);
        obj = {
          date: data[i].date,
          tempsSommeilLeger:
            data[i].valeur == "HKCategoryValueSleepAnalysisAsleepCore"
              ? data[i].dureeSommeil
              : 0,
          tempsSommeilParadoxal:
            data[i].valeur == "HKCategoryValueSleepAnalysisAsleepREM"
              ? data[i].dureeSommeil
              : 0,
          tempsSommeilProfond:
            data[i].valeur == "HKCategoryValueSleepAnalysisAsleepDeep"
              ? data[i].dureeSommeil
              : 0,
        };
      } else {
        if (i != 0) {
          obj.tempsSommeilLeger +=
            data[i].valeur == "HKCategoryValueSleepAnalysisAsleepCore"
              ? data[i].dureeSommeil
              : 0;
          obj.tempsSommeilParadoxal +=
            data[i].valeur == "HKCategoryValueSleepAnalysisAsleepREM"
              ? data[i].dureeSommeil
              : 0;
          obj.tempsSommeilProfond +=
            data[i].valeur == "HKCategoryValueSleepAnalysisAsleepDeep"
              ? data[i].dureeSommeil
              : 0;
        }
      }
      if (i == data.length - 1) {
        tabFinal.push(obj);
      }
    }
    for (let index = 0; index < 7; index++) {
      tabFinal.unshift(1);
    }
    tabFinal.splice(12, 0, 1);
    tabFinal.splice(25, 0, 1);
    tabFinal.splice(28, 0, 1);
    tabFinal.splice(30, 0, 1);
    triArrayDate(tabFinal);
    console.log("dataAppleWatch");
    console.log(tabFinal);

    return tabFinal;
  })
  .catch(function (error) {
    console.log(error);
  });

export { dataMiguel, dataCpap, dataCpap2023, dataAppleWatch };