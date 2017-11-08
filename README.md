# rtravel_countries
Data visualization of r/Travel.

I'll be using the following:
* Python3  
    * PRAW (Reddit API)
    * beautifulsoup4 (Web scraper)
* SqLite
* D3JS

## Python code
Packing everything into a python package for easier install.  
You should be in the innermost `rtravel_countries` directory when running these scripts. The relative links will be a database `../data.db`.

### get_raw.py
Fetch data from r/Travel from current time back in time to the first post. Store data in `data.db`. It took me about 30 minutes to scrape all 9 years of the subreddit. I didn't include post texts, only titles and some other data. 

### scrape_countries.py
There are a number of (free) existing databases with mappings of countries, cities and states. But I like to write my own tools so let's scrape Wikipedia for a list of country names along with alternative names for every country. 

Note: there's some ambiguity regarding the names of North Korea (under Korea, North on one wiki page) and some other countries. I'll leave it at that for now, fine tune later if necessary. 

### calc_freq.py
Loop through every post in `DB: submissions` and find a reference to a country in the title. Leave NULL if no reference found. 
For now it simply matches all stored country names with the title text. 

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

