# rtravel_countries
Visualization of /r/Travel data. I want to figure out, which countries are the most popular tourist destinations (according to this specific subreddit).  

I'll be using the following tools:
* Python3
    * PRAW (Reddit API)
    * beautifulsoup4 (Web scraper)
* SqLite (simple database)
* JS
    * Crossfilter
    * D3JS
    * DC.js

Packing everything into a python package for easier install.  

## Getting the data
You should be in the innermost `rtravel_countries` directory when running these scripts so the relative path to the SQLite DB is `../data.db`. 

### get_raw.py
This will use Reddit API to fetch data about every post ever created on /r/Travel. Storing the data into `../data.db`.

### scrape_countries.py
There are a number of (free) existing databases with mappings of countries, cities and states. But I like to catch my data in the wilds. So let's scrape Wikipedia for a list of country names along with a few lists of alternative names. 

Note: there's some ambiguity regarding the names of North Korea (under Korea, North on one wiki page) and some other countries. I'll leave it at that for now, fine tune later if necessary. 

### calc_freq.py
Loop through every post title in `DB: submissions` and find a reference to a country. Leave NULL if no reference found. 
For now it simply matches all stored country names with the title text. No fancy netural language processing - possible update though.  

## data.db
Tables in the database: 

* submissions

|title   |score   |created_utc   |author   |num_comments   |country|
|---|---|---|---|---|---|
|text|integer|real|text|integer|text|


* countries

|name|alt_names|count|freq|
|---|---|---|---|
|text|text|integer|real|


## Visualizing the data
I'll be using Flask to server my data.  
Server in `/flask_app`.  

## Python shenanigans
I've had some trouble with the flask app seeing all the functinos in rtravel_contries package.  

* Accidently installed the package globally. After making changes to the package, the old (global) was still imported.  
* After making changes in package, I needed to run `pip install --upgrade .` on my package.  
* Seems that it's best to install custon packages in virtualenv.  

## Starting flask:
From root directory:  
```bash
$ source venv/bin/activate`
$ cd flask_app
$ export FLASK_APP="app.py"
$ flask run
```


## Crossfilter
The library has a bit of a learning curve.  
It's used to quickly order multidimensional data and gropu in in your browser.  
Sort of like a browser-side SQL query.  
Basic steps:
```javascript
data = [
    {day: "2017-01-15", score: 20},
    {day: "2017-01-22", score: 50},
    {day: "2017-02-13", score: 60}
]

//read data into a crossfilter object
var cdata = crossfilter(data)

//define dimensions
var dim_day = cdata.dimension((d)=>{ return d.day })
var dim_scr = cdata.dimension((d)=>{ return d.score })

//define groups
var grp_by_month = dim_day.group((d)=>{ return d.substr(1,7) })

//perform aggregation on gropus
var score_per_month = grp_by_month.reduceSum((d)=>{ d.score })
```

Quick recap on 26 slides: [link](https://www.slideshare.net/esjewett/crossfilter-mad-js)  



## TODO: 
* I was able to match about 1/4 of all titles with a specific country. 
Possible improvements. Levenshein distance?  
* Add search for a specific country score.  (nationalism and stuff...)
* Add a time range filter.  