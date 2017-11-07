import praw
import json

with open('credentials.json') as raw:
    credentials = json.load(raw)

reddit = praw.Reddit(client_id=credentials['client_id'],
                     client_secret=credentials['client_secret'],
                     user_agent=credentials['user_agent']
                     )

print("Connected to reddit: %s" % reddit.read_only)
