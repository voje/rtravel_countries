var data = null
var cdata = null

get_data(draw_chart)

function get_data(_callback) {
    d3.json("/data/submissions1", (d) => {
        data = d
        _callback()
    })
}

function draw_chart() {
    var pie = dc.pieChart("#pie-chart")
    var bar = dc.barChart("#bar-chart")
    cdata = crossfilter(data)

    // In case we needed a filter, we would need a separate dimension just for filtering.
    //dim_num = cdata.dimension((d) => { return d.count })
    //dim_num.filter((d) => { return d > 0 })

    var dim_cntry = cdata.dimension((d) => { return d.country })
    var dim_time = cdata.dimension((d) => { return d.created_utc })

    var grp_cntry = dim_cntry.group()

    var count_cntry = grp_cntry.reduceCount()

    console.log(count_cntry.all())

    pie
        .width(1000)
        .height(600)
        .slicesCap(30)
        .innerRadius(100)
        //.externalLabels(100)
        //.externalRadiusPadding(0)
        //.drawPaths(false)
        .dimension(dim_cntry)
        .group(count_cntry)
        .legend(dc.legend());
    // example of formatting the legend via svg
    // http://stackoverflow.com/questions/38430632/how-can-we-add-legends-value-beside-of-legend-with-proper-alignment
    pie.on('pretransition', function(chart) {
        pie.selectAll('.dc-legend-item text')
            .text('')
          .append('tspan')
            .text(function(d) { return d.name; })
          .append('tspan')
            .attr('x', 150)
            .attr('text-anchor', 'end')
            .text(function(d) { return d.data; });
    });
    pie.render();

}
