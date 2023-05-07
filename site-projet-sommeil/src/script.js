import * as d3 from "d3"

let dataMiguel = 
    d3.csv("./src/data/dataMiguel.csv").then(function(dataMiguel) {
    console.log("dataMiguel");
    console.log(dataMiguel);
  })
  .catch(function(error) {
    console.log(error);
  });

let dataCpap = 
    d3.csv("./src/data/cpap-original.csv").then(function(dataCpap) {
    console.log("dataCpap");
    console.log(dataCpap);
  })
  .catch(function(error) {
    console.log(error);
  });

let dataApWatch = 
    d3.xml("./src/data/sleepdataAppleHealth2023AppleWatch.xml").then(function(dataApWatch) {
    console.log("dataApWatch");
    console.log(dataApWatch);
  })
  .catch(function(error) {
    console.log(error);
  });