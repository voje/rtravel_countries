$("#pie-chart").text("Hello from Pie chart!")
/*
var chart = dc.pieChart("#pie-chart");
d3.csv("morley.csv", function(error, experiments) {
    var ndx           = crossfilter(experiments),
        runDimension  = ndx.dimension(function(d) {return "run-"+d.Run;})
    speedSumGroup = runDimension.group().reduceSum(function(d) {return d.Speed * d.Run;});
    chart
        .width(768)
        .height(480)
        .slicesCap(4)
        .innerRadius(100)
        .externalLabels(50)
        .externalRadiusPadding(50)
        .drawPaths(true)
        .dimension(runDimension)
        .group(speedSumGroup)
        .legend(dc.legend());
    // example of formatting the legend via svg
    // http://stackoverflow.com/questions/38430632/how-can-we-add-legends-value-beside-of-legend-with-proper-alignment
    chart.on('pretransition', function(chart) {
        chart.selectAll('.dc-legend-item text')
            .text('')
          .append('tspan')
            .text(function(d) { return d.name; })
          .append('tspan')
            .attr('x', 100)
            .attr('text-anchor', 'end')
            .text(function(d) { return d.data; });
    });
    chart.render();
});
*/
