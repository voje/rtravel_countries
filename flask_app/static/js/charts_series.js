var data = null
var cdata = null
var charts = []

// for debugging
var tm1
var tm2
var tm3

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
    charts[0] = dc.seriesChart("#series-chart")
    cdata = crossfilter(data)

    // first, get an array of top 20 countries by using reduceCount
    // then filter out all other countries and remove them
    var filter_countries = []
    var dim_filter_countries = cdata.dimension((d) => { return d.country })

    // Remove "united states" data.
    dim_filter_countries.filterFunction((d)=>{ return d == "united states" })
    cdata.remove()
    dim_filter_countries.filter(null) // remove this filter

    dim_filter_countries.group().reduceCount().top(20).forEach((d) => {
        filter_countries.push(d.key)
    })

    console.log(filter_countries)

    dim_filter_countries.filterFunction((d) => {
        return filter_countries.indexOf(d) < 0  // filter all that are NOT in the list
    })
    cdata.remove() // remove everything that matches the current filter
    dim_filter_countries.filterAll() //reset filter


    // UTC to Date
    data.forEach((d)=>{
        // convert to Date format + round to month + convert back to int representation
        // !!! using int instead of Date object is a huge performance boost for crossfilter !!!
        d.created_utc = d3.time.month(new Date(d.created_utc * 1000)).getTime()
    })

    var dim_series = cdata.dimension((d) => {
        //Each iteration is constant (cca 0.35ms). This will scale with data.  
        //Iterations represent 1/3 of processing time. 2/3 is the time the function
        //needs from last iteration to exit. 
        return [d.created_utc, d.country] 
    })
    //var grp_series = dim_series.group().reduceCount((d) => { return d.country })
    var grp_series = dim_series.group()

    var min_max = d3.extent(data, (d)=>{ return d.created_utc }) 

    // Sort legend alphabetically. 
    dc.override(charts[0], 'legendables', function() {
        var items = charts[0]._legendables();
        console.log(items)
        return items.sort((a,b) => { return a < b });
    });

    // series chart
    charts[0]
        .title((d) => { return "[" + new Date(d.key[0]).toDateString() + ", " + d.key[1] + "]: " + d.value })
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
            .itemWidth(180)
        )
        .margins().bottom = 120


    render_all()
}
