var data = null
var cdata = null

get_data(draw_chart)

function get_data(_callback) {
    d3.json("/data/countries", (d) => {
        data = d
        _callback()
    })
}

function draw_chart() {
    cdata = crossfilter(data)

    num_dim = cdata.dimension((d) => { return d.count })
    num_dim.filter((d) => { return d > 0 })

    name_dim = cdata.dimension((d) => { return d.name })
    var grp = name_dim.group()

    var chart = dc.pieChart("#pie-chart")
    chart
        .width(1000)
        .height(700)
        .slicesCap(30)
        .innerRadius(100)
        .externalLabels(50)
        .externalRadiusPadding(100)
        .drawPaths(true)
        .dimension(name_dim)
        .group(name_dim.group().reduceSum((d)=>{return d.count}))
        .legend(dc.legend());
    // example of formatting the legend via svg
    // http://stackoverflow.com/questions/38430632/how-can-we-add-legends-value-beside-of-legend-with-proper-alignment
    chart.on('pretransition', function(chart) {
        chart.selectAll('.dc-legend-item text')
            .text('')
          .append('tspan')
            .text(function(d) { return d.name; })
          .append('tspan')
            .attr('x', 150)
            .attr('text-anchor', 'end')
            .text(function(d) { return d.data; });
    });
    chart.render();
}
