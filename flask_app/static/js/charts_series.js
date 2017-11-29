var data = null
var cdata = null
var charts = []

// for debugging
var tm

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
    charts[0] = dc.seriesChart("#series-chart")
    cdata = crossfilter(data)

    // first, get an array of top 20 countries by using reduceCount
    // then filter out all other countries and remove them
    var filter_countries = []
    console.log(cdata.size())
    var dim_filter_countries = cdata.dimension((d) => { return d.country })
    dim_filter_countries.group().reduceCount().top(20).forEach((d) => {
        filter_countries.push(d.key)
    })
    dim_filter_countries.filterFunction((d) => {
        return filter_countries.indexOf(d) < 0  // filter all that are NOT in the list
    })
    cdata.remove() // remove everything that matches the current filter
    dim_filter_countries.filterAll() //reset filter
    console.log(cdata.size())


    // UTC to Date
    data.forEach((d)=>{
        d.created_utc = new Date(d.created_utc * 1000)
    })

    var dim_series = cdata.dimension((d) => { return [d.country, d3.time.month(d.created_utc)] })
    var grp_series = dim_series.group().reduceCount((d) => { return d.country })

    var min_max = d3.extent(data, (d)=>{ return d.created_utc }) 

    // series chart
    tm = charts[0]
    charts[0]
        .colors(d3.scale.category20())
        .yAxisLabel("hits per month")
        .x(d3.time.scale()
            .domain([ min_max[0], min_max[1] ])
        )
        .height(500)
        .brushOn(false)
        .dimension(dim_series)
        .group(grp_series)
        .seriesAccessor(function(d) { return d.key[0];}) //d.key = [ cntry, date ]
        .keyAccessor(function(d) {return d.key[1];})
        .valueAccessor(function(d) {return d.value;}) //d.value = count
        .legend(dc.legend()
            .x(50)
            .y(charts[0].height() - 70)
            .itemHeight(13)
            .gap(5)
            .legendWidth(1000) 
            .horizontal(1)
            .itemWidth(100)
        )
        .margins().bottom = 120


    render_all()
}
