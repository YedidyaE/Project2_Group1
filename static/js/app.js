var rawData = rawData2;

var parseTime = d3.timeParse("%b-%Y");

rawData.forEach(function(d) {
  d.dates.forEach(function(data, index) {
    d.dates[index] = parseTime(data);
  })
  if ((d.y === "GDP-Total($T)") || (d.y === "GDP-Retail($T)") || (d.y === "GDP-Tourism($T)") || (d.y === "Employment(M)") || (d.y === "Population(M)")) {
    d.series.forEach(function(data) {
      data.values.forEach(function(dd, index) {
        data.values[index] = dd/1000000
      })
    })
  }
});

// Initial Params
var metricSelection = "GDP-Total($T)"
var stateSelection = ["Colorado", "Oregon", "Washington"]

var metricIndex = rawData.findIndex(d => d.y === metricSelection)
var stateIndex = rawData[metricIndex].series.findIndex(d => d.name === stateSelection)

var svgWidth = 1350;
var svgHeight = 600;

var margin = {
  top: 50,
  right: 100,
  bottom: 50,
  left: 75
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select("#line")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 1350 600")
  .classed("svg-content", true);

// Append an SVG group
var chartGroup = svg.append("g")
  .classed("chart-content",true)
  .attr("transform", `translate(${margin.left+100}, ${margin.top})`)

chartGroup
  .append("rect")
  .attr("x", -20)
  .attr("y", -30)
  .style("stroke", "black")
  .style("stroke-width", 1.5)
  .style("fill","none")
  .style("opacity", 0.5)
  .attr("width", 950)
  .attr("height", 570);

// Create user selection groups for metric and state
var metricSelectionGroup = svg.append("g")
  .classed("metric-group", true)
  .attr("transform", `translate(${svgWidth-215}, ${svgHeight})`);

metricSelectionGroup
  .append("rect")
  .attr("x", -1130)
  .attr("y", -580)
  .style("stroke", "black")
  .style("stroke-width", 1.5)
  .style("fill","none")
  .style("opacity", 0.5)
  .attr("width", 150)
  .attr("height", 570);

var stateSelectionGroup = svg.append("g")
  .classed("state-group", true)
  .attr("transform", `translate(${(svgWidth-310)/2}, ${svgHeight})`);

stateSelectionGroup
  .append("rect")
  .attr("x", 585)
  .attr("y", -580)
  .style("stroke", "black")
  .style("stroke-width", 1.5)
  .style("fill","none")
  .style("opacity", 0.5)
  .attr("width", 240)
  .attr("height", 570);

var stateSelectionGroup2 = svg.append("g")
  .classed("state-group", true)
  .attr("transform", `translate(${(svgWidth/2)-45}, ${svgHeight-520})`);

function rebuildData(metricSelection, stateSelection){
  var newMetricIndex = rawData.findIndex(d => d.y === metricSelection)
  var newStateIndex = rawData[metricIndex].series.findIndex(d => d.name === stateSelection)
  var newMetricData = rawData.slice(newMetricIndex,newMetricIndex + 1)
  var newStateData = newMetricData[0].series.filter(d => stateSelection.includes(d.name))

  var newData = [{y: metricSelection, series: newStateData, dates: rawData[newMetricIndex].dates}]

  buildGraph(newData, newMetricIndex, newStateIndex)
}

// Loop through data to population metric selection group
for (i = 0; i < rawData.length; i++) {
  if (rawData[i].y === metricSelection) {
    metricSelectionGroup.append("text")
      .attr("x", -svgWidth + 230)
      .attr("y", -svgHeight + margin.top + i*50)
      .attr("value", rawData[i].y) // value to grab for event listener
      .classed("metric", true)
      .text(rawData[i].y)
      .style("fill","blue");
    }
  else {
    metricSelectionGroup.append("text")
      .attr("x", -svgWidth + 230)
      .attr("y", -svgHeight + margin.top + i*50)
      .attr("value", rawData[i].y) // value to grab for event listener
      .classed("metric", true)
      .text(rawData[i].y)
      .style("fill","grey");
  }};

// Loop through states to population 1st state selection group
for (j = 0; j < 26; j++) {
  if (stateSelection.includes(rawData[0].series[j].name)) {
    stateSelectionGroup.append("text")
      .attr("x", margin.right + 495)
      .attr("y", 0 - svgHeight+margin.top + j*20)
      .attr("value", rawData[0].series[j].name) // value to grab for event listener
      .classed("state", true)
      .text(rawData[0].series[j].name)
      .style("fill","blue");
    }
  else {
    stateSelectionGroup.append("text")
      .attr("x", margin.right + 495)
      .attr("y", 0 - svgHeight+margin.top + j*20)
      .attr("value", rawData[0].series[j].name) // value to grab for event listener
      .classed("state", true)
      .text(rawData[0].series[j].name)
      .style("fill","grey");
  }};

// Loop through states to population 2nd state selection group
for (j = 26; j < rawData[0].series.length; j++) {
  if (stateSelection.includes(rawData[0].series[j].name)) {
    stateSelectionGroup2.append("text")
      .attr("x", margin.right + 495)
      .attr("y", 0 - svgHeight+margin.top + j*20)
      .attr("value", rawData[0].series[j].name) // value to grab for event listener
      .classed("state", true)
      .text(rawData[0].series[j].name)
      .style("fill","blue");
    }
  else {
    stateSelectionGroup2.append("text")
      .attr("x", margin.right + 495)
      .attr("y", 0 - svgHeight+margin.top + j*20)
      .attr("value", rawData[0].series[j].name) // value to grab for event listener
      .classed("state", true)
      .text(rawData[0].series[j].name)
      .style("fill","grey");
  }};

// Event listners
stateSelectionGroup.selectAll("text")
  .on("click", function() {
    var value = d3.select(this).attr("value");

    if (stateSelection.includes(value)) {
      stateSelection = stateSelection.filter(function removeData(data) {return data !== value});
      d3.select(this).style("fill","grey");
    }
    else {
      stateSelection.push(value);
      d3.select(this).style("fill","blue");
    };

  rebuildData(metricSelection, stateSelection)
  });

stateSelectionGroup2.selectAll("text")
  .on("click", function() {
    var value = d3.select(this).attr("value");

    if (stateSelection.includes(value)) {
      stateSelection = stateSelection.filter(function removeData(data) {return data !== value});
      d3.select(this).style("fill","grey");
    }
    else {
      stateSelection.push(value);
      d3.select(this).style("fill","blue");
    };

  rebuildData(metricSelection, stateSelection)
  });

metricSelectionGroup.selectAll("text")
  .on("click", function() {
    var value = d3.select(this).attr("value");

    if (metricSelection !== value) {
      metricSelection = value
      metricSelectionGroup.selectAll("text").style("fill","grey")
      d3.select(this).style("fill","blue");
    }

  rebuildData(metricSelection, stateSelection)
  });

function buildGraph(buildData, metricIndex, stateIndex) {
  d3.select(".x-axis").remove()
  d3.select(".y-axis").remove()
  d3.select(".data-group").remove()

  var xTimeScale1 = d3.scaleTime()
    .domain(d3.extent(buildData[0].dates))
    .range([0, width-300]);

  var yLinearScale1 = d3.scaleLinear()
    .domain([0, d3.max(buildData[0].series, d => d3.max(d.values))]).nice()
    .range([height, 0]);

    // d3.min(buildData[0].series, d => d3.max(d.values))*.75

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xTimeScale1);
  var leftAxis = d3.axisLeft(yLinearScale1);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(35, ${height})`)
    .call(bottomAxis.ticks(width/75).tickSizeOuter(0));

  // append y axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .attr("transform", `translate(35, 0)`)
    .call(leftAxis);

  // create group for data
  var dataGroup = chartGroup.append("g")
    .classed("data-group", true)
    .attr("fill","none")

  var line = d3.line()
    .defined(d => !isNaN(d))
    .x((d,i) => xTimeScale1(buildData[0].dates[i]))
    .y(d => yLinearScale1(d))

  dataGroup.selectAll("path")
    .data(buildData[0].series)
    .enter()
    .append("path")
    .style("mix-blend-mode", "multiply")
    .attr("transform", `translate(35, 0)`)
    .attr("d", d => line(d.values))
    .classed("line blue", true)

  var textGroup = dataGroup.selectAll("text")
    .data(buildData[0].series)
    .enter()
    .append("text")
    .html(function(d) {return (`${d.name}`);})
    .attr('fill', "black")
    .attr('alignment-baseline', 'right')
    .attr('x', 800)
    .attr('y', d => yLinearScale1(d.values[d.values.length-1]));
};

rebuildData(metricSelection, stateSelection);
