var mydata = 
[
  {
    "balance": "$2,460.20",
    "age": 37,
    "registered": "2016-03-19"
  },
  {
    "balance": "$2,439.14",
    "age": 39,
    "registered": "2016-03-18"
  },
  {
    "balance": "$2,666.42",
    "age": 28,
    "registered": "2017-04-20"
  },
  {
    "balance": "$1,922.68",
    "age": 20,
    "registered": "2017-04-29"
  },
  {
    "balance": "$3,739.95",
    "age": 39,
    "registered": "2016-03-05"
  },
  {
    "balance": "$3,539.57",
    "age": 29,
    "registered": "2015-11-25"
  },
  {
    "balance": "$3,935.49",
    "age": 36,
    "registered": "2015-04-29"
  },
  {
    "balance": "$3,283.89",
    "age": 25,
    "registered": "2015-11-27"
  },
  {
    "balance": "$1,000.15",
    "age": 32,
    "registered": "2016-02-08"
  }
]

var cdata = crossfilter(mydata)

// Transform date data into Date objects
var dateFormat = d3.time.format("%Y-%m-%d");
mydata.forEach( (d) => {
  d.registered = dateFormat.parse(d.registered)
})
console.log(mydata)

var all = cdata.groupAll()
var dim_date = cdata.dimension((d) => { return d.registered })
var grp_by_date = dim_date.group(d3.time.month)
var grp_age = grp_by_date.reduceCount((d) => { return d.age})
console.log(grp_age.all())

var chart = dc.barChart("#chart")

var all_dates = mydata.map( function(x){ return new Date(x.registered) } )
var latest = new Date(Math.max.apply(null,all_dates))
var earliest = new Date(Math.min.apply(null,all_dates))

console.log(latest, earliest)

chart
  .dimension(dim_date)
  .group(grp_age)
  .x(d3.time.scale()
    .domain([earliest, latest])
    )
chart.render()















