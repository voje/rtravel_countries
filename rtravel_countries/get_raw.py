# Scrape reddit's r/Travel using reddit API (praw)

import praw
import json
import sqlite3
import time
import datetime

# API credentials
with open('credentials.json') as raw:
    credentials = json.load(raw)

# Login
reddit = praw.Reddit(client_id=credentials['client_id'],
                     client_secret=credentials['client_secret'],
                     user_agent=credentials['user_agent']
                     )

print("Connected to reddit: %s" % reddit.read_only)

# Prepare database
conn = sqlite3.connect('../data.db')
cur = conn.cursor()
cur.execute(''' CREATE TABLE submissions
                (title text, score integer,
                created_utc real, author text,
                num_comments integer, country text) ''')

# For testing: mine the latest weekly updates.
# now
timestamp_end = int(time.time())
# a week ago
timestamp_start = time.mktime(datetime.date(2017, 6, 1).timetuple())

subreddit = reddit.subreddit('travel')
# Set first argument to None if you want to scrape all posts since
# the beginning of /r/Travel
for s in subreddit.submissions(None, timestamp_end):
    # print(s.__dict__)
    cur.execute('INSERT INTO submissions VALUES (?,?,?,?,?,?)', (
        s.title, s.score, s.created_utc, s.author.name,
        s.num_comments, 0)
    )


conn.commit()
conn.close()
