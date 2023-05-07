import * as d3 from "d3"

// Fonction qui trie une array par dates
function triArrayDate(array) {
  // Set les dates de début et de fin
  var dateDebut = new Date('2023-03-01');
  var dateFin = new Date('2023-03-30');
  // Converti les dates en timestamps pour pouvoir comparer
  var timestampDebut = dateDebut.getTime();
  var timestampFin = dateFin.getTime();

  // Boucle à l'envers pour ne pas casser les index
  for (var i = array.length - 1; i >= 0; i--) {
    // Enlève des chars parasite au début de la propriété date (pour les dataCpap, ne fait rien sur les autres)
    array[i].heureCoucher = array[i].heureCoucher.replace('SLEEP_RECORD#', '');

    // Converti la date en timestamp
    var timestamp = new Date(array[i].date).getTime(); 

    // Supprime l'objet si la date n'est pas comprise entre les deux timestamps
    if (timestamp <= dateDebut.getTime() || timestamp >= dateFin.getTime()) {
      array.splice(i, 1);
    }
  }
}

let dataMiguel = 
    d3.csv("./src/data/dataMiguel.csv", function(d){
      return {date: d.date, tempsSommeilProfond: d.deepSleepTime, tempsSommeilLeger: d.shallowSleepTime, nombreReveil: d.wakeTime, heureCoucher: d.start};
    })
  .then(function(dataMiguel) {
    triArrayDate(dataMiguel);
    console.log("dataMiguel");
    console.log(dataMiguel);
  })
  .catch(function(error) {
    console.log(error);
  });

let dataCpap = 
    d3.csv("./src/data/cpap-original.csv", function(d){
      return {date: d.approximatecreationdatetime, heureCoucher: d.keys_sort_key, evenementHeure: d.score_detail_ahi, fuiteMoyenne: d.score_detail_leak_95_percentile, tempsUtilisation: d.usage_hours}
    })
    .then(function(dataCpap) {
      triArrayDate(dataCpap)
      
    // fonction pour comparer les dates et tri du tableau
    function comparaison(a, b) {
      return new Date(a.date) - new Date(b.date);
    }
    dataCpap.sort(comparaison);

    console.log("dataCpap")
    console.log(dataCpap);
  })
  .catch(function(error) {
    console.log(error);
  });

/* let dataApWatch = 
    d3.xml("./src/data/sleepdataAppleHealth2023AppleWatch.xml")
    .then(function(dataApWatch) {

      console.log("dataApWatch");
      console.log(dataApWatch);
  })
  .catch(function(error) {
    console.log(error);
  }); */