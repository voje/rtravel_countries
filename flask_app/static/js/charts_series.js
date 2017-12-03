var data = null
var cdata = null
var charts = []

// for debugging
var tm

console.time("main")

// Main
get_data(draw_chart)

function get_data(_callback) {
    console.time("get_data")
    d3.json("/data/submissions1", (d) => {
        data = d
        _callback()
    })
    console.timeEnd("get_data")
}

reset_filters = function() {
    charts.forEach((d)=> {
        d.filter(null)
    })
}

render_all = function() {
    console.time("render_all")
    charts.forEach((d)=> {
        d.render()
    })
    console.timeEnd("render_all")
}

window.reset_all = function() {
    reset_filters()
    render_all()
}

function count_all(data) {
    console.time("count_all")
    var all = 0
    data.forEach( (d) => {
        all += d.value
    })
    console.timeEnd("count_all")
    return all
}

function draw_chart() {
    console.time("draw_chart")
    charts[0] = dc.seriesChart("#series-chart")
    cdata = crossfilter(data)

    // first, get an array of top 20 countries by using reduceCount
    // then filter out all other countries and remove them
    var filter_countries = []
    var dim_filter_countries = cdata.dimension((d) => { return d.country })

    console.time("dim_filter_countries1")
    dim_filter_countries.group().reduceCount().top(20).forEach((d) => {
        filter_countries.push(d.key)
    })
    console.timeEnd("dim_filter_countries1")
    console.time("dim_filter_countries2")
    dim_filter_countries.filterFunction((d) => {
        return filter_countries.indexOf(d) < 0  // filter all that are NOT in the list
    })
    console.timeEnd("dim_filter_countries2")
    cdata.remove() // remove everything that matches the current filter
    dim_filter_countries.filterAll() //reset filter


    // UTC to Date
    console.time("data_utc_time")
    data.forEach((d)=>{
        // convert to Date format + round to month
        d.created_utc = d3.time.month(new Date(d.created_utc * 1000))
    })
    console.timeEnd("data_utc_time")

    console.time("dim_series")
    //huge bottlenect (50s)
    // TODO write your own reduce function to optimize the bottleneck
    // graph date-value while mapping to countries in a dictionary cntry: [indices]
    var dim_series = cdata.dimension((d) => { return [d.created_utc, d.country] })
    console.timeEnd("dim_series")
    var grp_series = dim_series.group().reduceCount((d) => { return d.country })
    tm = grp_series

    console.time("minmax")
    var min_max = d3.extent(data, (d)=>{ return d.created_utc }) 
    console.timeEnd("minmax")

    // series chart
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
        .seriesAccessor(function(d) {return d.key[1];}) //d.key = [ date, cntry ]
        .keyAccessor(function(d) {return d.key[0];})
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
    console.timeEnd("draw_chart")
}

console.timeEnd("main")
