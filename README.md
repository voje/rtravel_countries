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

### get_raw.py
Fetch data from r/Travel from current time back in time to the first post. Store data in `data.db`. 

### scrape_countries.py
To keep things simple, I am going to match every reddit post title with a country name. If there's no match, I'll skip and disregard the post from the count. 

There are a number of (free) existing databases with mappings of countries, cities and states. But I like to write my own tools so let's scrape Wikipedia for a list of country names along with alternative names for every country. 

Note: there's some ambiguity regarding the names of North Korea (under Korea, North on one wiki page) and some other countries. I'll leave it at that for now, fine tune later if necessary. 

### calc_freq.py
Loop through every post from reddit and assign it a country. 

## data.db
submissions

|title   |score   |created_utc   |author   |num_comments   |
|---|---|---|---|---|
|text|integer|real|text|integer|


countries

|original_name|alt_names|count|freq|
|---|---|---|---|
|text|text|integer|real|

