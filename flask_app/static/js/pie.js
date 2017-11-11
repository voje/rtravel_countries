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

    // Filter out countries with 0 hits.
    dim_num = cdata.dimension((d) => { return d.count })
    dim_num.filter((d) => { return d > 0 })

    dim_name = cdata.dimension((d) => { return d.name })
    grp_count = dim_name.group().reduceSum( (d) => {return d.count} )

    var chart = dc.pieChart("#pie-chart")
    chart
        .width(1000)
        .height(600)
        .slicesCap(30)
        .innerRadius(100)
        //.externalLabels(100)
        //.externalRadiusPadding(0)
        //.drawPaths(false)
        .dimension(dim_name)
        .group(grp_count)
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
