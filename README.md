# rtravel_countries
Data visualization of r/Travel.

I'll be using the following:
* Python3  
    * PRAW (Reddit API)
    * NLTK
* SqLite
* D3JS

## Python code
Packing everything into a python package for easier install.  

## get_raw.py
Fetch data from r/Travel from current time back in time to the first post. Store data in `data.db`. 

## data.db
|title   |score   |created_utc   |author   |num_comments   |
|---|---|---|---|---|
|text|integer|real|text|integer|
