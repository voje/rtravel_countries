var data = null
var cdata = null
var charts = []

// Main
get_data(draw_chart)

function get_data(_callback) {
    d3.json("/data/submissions1", (d) => {
        data = d
        _callback()
    })
}

reset_filters = function() {
    charts.forEach((d)=> {
        d.filter(null)
    })
}

render_all = function() {
    charts.forEach((d)=> {
        d.render()
    })
}

window.reset_all = function() {
    reset_filters()
    render_all()
}

function count_all(data) {
    var all = 0
    data.forEach( (d) => {
        all += d.value
    })
    return all
}

function draw_chart() {
    charts[0] = dc.pieChart("#pie-chart")
    charts[1] = dc.barChart("#bar-chart")
    cdata = crossfilter(data)

    // UTC to Date
    data.forEach((d)=>{
        d.created_utc = new Date(d.created_utc * 1000)
    })

    // In case we needed a filter, we would need a separate dimension just for filtering.
    //dim_num = cdata.dimension((d) => { return d.count })
    //dim_num.filter((d) => { return d > 0 })

    // pie chart 
    var dim_cntry = cdata.dimension((d) => { return d.country })
    var grp_cntry = dim_cntry.group()
    var count_cntry = grp_cntry.reduceCount()

    // bar chart
    var dim_time = cdata.dimension((d) => { return d.created_utc })
    var grp_time = dim_time.group(d3.time.month)
    var count_per_month = grp_time.reduceCount()


    // pie chart
    charts[0] 
        //.width(1000)
        .height(450)
        .slicesCap(25)
        .cx(400)        //x offset
        //.innerRadius(100)
        //.externalLabels(100)
        .externalRadiusPadding(50)
        //.drawPaths(false)
        .dimension(dim_cntry)
        .group(count_cntry)
        .legend(dc.legend())
    // example of formatting the legend via svg
    // http://stackoverflow.com/questions/38430632/how-can-we-add-legends-value-beside-of-legend-with-proper-alignment
    charts[0].on('pretransition', function(chart) {
        var percent_helper = 0
        charts[0].selectAll('.dc-legend-item text')
            .text('')
          .append('tspan')
            .text(function(d) { return d.name; })
          .append('tspan')
            .attr('x', 120)
            .attr('text-anchor', 'end')
            .text(function(d) {
                percent_helper += d.data
                return d.data
            })
          .append('tspan')
            .attr('x', 130)
            .attr('text-anchor', 'start')
            .text(function(d) { 
                return ( "(" + ( 100*d.data/percent_helper ).toFixed(1) + "%)" )
            })
    })

    var min_max = d3.extent(data, (d)=>{ return d.created_utc }) 

    // bar chart
    charts[1]
      .dimension(dim_time)
      .group(count_per_month)
      .x(d3.time.scale()
        .domain([ min_max[0], min_max[1] ])
        )

    render_all()
}
