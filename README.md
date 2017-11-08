# rtravel_countries
Visualization of /r/Travel data. I want to figure out, which countries are the most popular tourist destinations (according to this specific subreddit).  

I'll be using the following tools:
* Python3
    * PRAW (Reddit API)
    * beautifulsoup4 (Web scraper)
* SqLite (simple database)
* D3JS (data visualization)

## Python code
Packing everything into a python package for easier install.  
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

