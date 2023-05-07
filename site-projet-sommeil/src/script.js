import * as d3 from "d3"

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
    if (array[i].date) {
      // Enlève des chars parasite au début de la propriété date (pour les dataCpap, ne fait rien sur les autres)
      array[i].date = array[i].date.replace("SLEEP_RECORD#", "");
    }
    // Converti la date en timestamp
    var timestamp = new Date(array[i].date).getTime();

    // Supprime l'objet si la date n'est pas comprise entre les deux timestamps
    if (timestamp < dateDebut.getTime() || timestamp > dateFin.getTime()) {
      array.splice(i, 1);
    }
  }

  array.sort(function (a, b) {
    return new Date(a.date) - new Date(b.date);
  });
}

function dureeSommeil(array) {
  for (var i = 0; i < array.length; i++) {
    array[i].dureeSommeil =
      (array[i].tempsSommeilProfond +
        array[i].tempsSommeilLeger +
        array[i].tempsSommeilParadoxal) /
      60;
  }
}

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
    triArrayDate(data);
    dureeSommeil(data);

    console.log("dataMiguel");
    console.log(data);
  })
  .catch(function (error) {
    console.log(error);
  });

let dataCpap = d3
  .csv("./src/data/cpap-original.csv", function (d) {
    return {
      heureReveil: d.approximatecreationdatetime,
      date: d.keys_sort_key,
      evenementHeure: parseFloat(d.score_detail_ahi),
      fuiteMoyenne: parseFloat(d.score_detail_leak_95_percentile),
      tempsUtilisation: parseFloat(d.usage_hours),
    };
  })
  .then(function (data) {
    triArrayDate(data);
    console.log("dataCpap");
    console.log(data);
  })
  .catch(function (error) {
    console.log(error);
  });

let dataAppleWatch = d3
  .xml("./src/data/sleepdataAppleHealth2023AppleWatch.xml")
  .then(function (xml) {
    const records = xml.getElementsByTagName("Record");
    const data = [];

    for (let i = 0; i < records.length; i++) {
      const record = records[i];

      if (
        record.getAttribute("type") ===
          "HKCategoryTypeIdentifierSleepAnalysis" &&
        record.getAttribute("creationDate") &&
        record.getAttribute("startDate") &&
        record.getAttribute("endDate")
      ) {
        const obj = {
          dateDeCreation: record.getAttribute("creationDate"),
          dateDeDebut: record.getAttribute("startDate"),
          dateDeFin: record.getAttribute("endDate"),
          valeur: record.getAttribute("value"),
        };
        data.push(obj);
      }
    }
    console.log("dataAppleWatch");
    console.log(data); // Affiche le tableau d'objets
  })
  .catch(function (error) {
    console.log(error);
  });

export { dataMiguel, dataCpap, dataAppleWatch };