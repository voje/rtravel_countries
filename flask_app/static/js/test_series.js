var mydata = 
[
  {
    "class": "A",
    "score": 37,
    "registered": "2017-01-01"
  },
  {
    "class": "A",
    "score": 11,
    "registered": "2017-01-12"
  },
  {
    "class": "B",
    "score": 39,
    "registered": "2017-01-13"
  },
  {
    "class": "B",
    "score": 39,
    "registered": "2017-01-13"
  },
  {
    "class": "B",
    "score": 39,
    "registered": "2017-01-13"
  },
  {
    "class": "B",
    "score": 39,
    "registered": "2017-02-13"
  },
  {
    "class": "B",
    "score": 39,
    "registered": "2017-02-13"
  },
  {
    "class": "C",
    "score": 28,
    "registered": "2017-01-22"
  },
  {
    "class": "C",
    "score": 28,
    "registered": "2017-04-22"
  },
  {
    "class": "C",
    "score": 28,
    "registered": "2017-05-22"
  },
  {
    "class": "C",
    "score": 28,
    "registered": "2017-05-22"
  },
  {
    "class": "A",
    "score": 20,
    "registered": "2017-04-01"
  },
  {
    "class": "A",
    "score": 20,
    "registered": "2017-04-01"
  },
  {
    "class": "A",
    "score": 20,
    "registered": "2017-04-01"
  },
  {
    "class": "A",
    "score": 20,
    "registered": "2017-04-01"
  },
  {
    "class": "B",
    "score": 39,
    "registered": "2017-03-05"
  },
  {
    "class": "B",
    "score": 22,
    "registered": "2017-03-11"
  },
  {
    "class": "C",
    "score": 29,
    "registered": "2017-02-22"
  },
  {
    "class": "A",
    "score": 36,
    "registered": "2017-05-01"
  },
  {
    "class": "B",
    "score": 25,
    "registered": "2017-04-11"
  },
  {
    "class": "B",
    "score": 12,
    "registered": "2017-04-13"
  },
  {
    "class": "B",
    "score": 13,
    "registered": "2017-04-04"
  },
  {
    "class": "C",
    "score": 32,
    "registered": "2017-03-22"
  },
  {
    "class": "C",
    "score": 01,
    "registered": "2017-03-12"
  }
]

var cdata = crossfilter(mydata)

// Transform date data into Date objects
var dateFormat = d3.time.format("%Y-%m-%d");
mydata.forEach( (d) => {
  d.registered = dateFormat.parse(d.registered)
})
console.log(mydata)

var dim_series = cdata.dimension((d) => {
    return [d.class, d3.time.month(d.registered)]
})
var grp_scores = dim_series.group().reduceCount((d) => {
    return d.class
})

var chart = dc.seriesChart("#chart")

// find x range
var all_dates = mydata.map( function(x){ return new Date(x.registered) } )
var latest = new Date(Math.max.apply(null,all_dates))
var earliest = new Date(Math.min.apply(null,all_dates))

console.log(latest, earliest)

chart
    .x(d3.time.scale()
        .domain([earliest, latest])
    )
    .dimension(dim_series)
    .group(grp_scores)
    .seriesAccessor(function(d) { console.log(d); return d.key[0];})
    .keyAccessor(function(d) {return d.key[1];})
    .valueAccessor(function(d) {return d.value;})
chart.render()















