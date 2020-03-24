function createCharts(sample){
d3.json("samples.json").then((data) => {
   console.log("data",data);

   var samples = data.samples;
   var samplesArray =samples.filter(sampleObj => sampleObj.id == sample);
   var resultSamples = samplesArray[0];


   var otu_ids = resultSamples.otu_ids;
   var otu_labels = resultSamples.otu_labels;
   var sample_values = resultSamples.sample_values;
   console.log(otu_ids);
   
   //Bar Chart
   var yticks = otu_ids.slice(0, 10).map(otu_ID => `OTU ${otu_ID}`).reverse();
   var barData = [
      {
         y: yticks,
         x: sample_values.slice(0,10).reverse(),
         text: otu_labels.slice(0,10).reverse(),
         type: "bar",
         orientation: "h",
      }
   ];

   var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: {t:30, l:150}
   };

   Plotly.newPlot("bar",barData,barLayout);


//Bubble Chart

  var bubbleLayout = {
     title: "Bacteria Cultures Per Sample",
     margin: {t:0},
     hovermode: "closest",
     xaxis: {title:"OTU ID"},
     margin: {t:30}
  };
  var bubbleData = [
     {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker:{
           size: sample_values,
           color: otu_ids,
           colorscale: "Electric"
        }
     }
  ];

  Plotly.newPlot("bubble",bubbleData,bubbleLayout);

});
}

function createDemographicData(sample){
   d3.json("samples.json").then((data) => {
      console.log("data",data);
   
      var demographicData = data.metadata;
      var demographicDataArray =demographicData.filter(sampleObj => sampleObj.id == sample);
      var resultDemographic = demographicDataArray[0];

      var tag = d3.select("#sample-metadata");

      tag.html("");

      Object.entries(resultDemographic).forEach(([key,value]) =>{
            tag.append("h6").text(`${key.toUpperCase()}: ${value}`);
         });
});
}
function init(){
   var selector = d3.select("#selDataset");

   d3.json("samples.json").then((data)=>{
      var sampleNames = data.names;

      sampleNames = data.names;

      sampleNames.forEach((sample) =>{
         selector
            .append("option")
            .text(sample)
            .property("value",sample);
      });

   var firstSample = sampleNames[0];
   createCharts(firstSample);
   createDemographicData(firstSample);
   });

}

function optionChanged(newSample){
   createCharts(newSample);
   createDemographicData(newSample);
}

init();

