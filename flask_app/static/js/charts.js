var data = null
var cdata = null
var pie
var bar

get_data(draw_chart)

function get_data(_callback) {
    d3.json("/data/submissions1", (d) => {
        data = d
        _callback()
    })
}

window.reset_filter = function() {
    bar.filter(null)
    bar.render()
}

function draw_chart() {
    pie = dc.pieChart("#pie-chart")
    bar = dc.barChart("#bar-chart")
    cdata = crossfilter(data)

    // UTC to Date
    data.forEach((d)=>{
        d.created_utc = new Date(d.created_utc * 1000)
    })

    // In case we needed a filter, we would need a separate dimension just for filtering.
    //dim_num = cdata.dimension((d) => { return d.count })
    //dim_num.filter((d) => { return d > 0 })

    var dim_cntry = cdata.dimension((d) => { return d.country })
    var dim_time = cdata.dimension((d) => { return d.created_utc })

    var grp_cntry = dim_cntry.group()
    var grp_time = dim_time.group(d3.time.month)

    var count_cntry = grp_cntry.reduceCount()
    var count_per_month = grp_time.reduceCount()

    pie
        //.width(1000)
        .height(450)
        .slicesCap(25)
        //.innerRadius(100)
        //.externalLabels(100)
        .externalRadiusPadding(50)
        //.drawPaths(false)
        .dimension(dim_cntry)
        .group(count_cntry)
        .legend(dc.legend())
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
            .text(function(d) { return d.data; })
    })
    pie.render()


    var min_max = d3.extent(data, (d)=>{ return d.created_utc }) 

    bar
      .dimension(dim_time)
      .group(count_per_month)
      .x(d3.time.scale()
        .domain([ min_max[0], min_max[1] ])
        )
    bar.render()
}
