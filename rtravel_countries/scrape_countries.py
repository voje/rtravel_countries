# Script deprecated, use scrape_countries1.py

import requests
from bs4 import BeautifulSoup
import sqlite3

cnames = {}

# List of country names
soup = BeautifulSoup(requests.get(
    "https://en.wikipedia.org/wiki/List_of_sovereign_states").content,
    "html.parser")
table = soup.find("table", class_="sortable wikitable")
rows = table.find_all("tr")[3:]
for row in rows:
    a = row.find("a")
    if a is not None:
        cnames[a.text] = []

# Alternative country names
soup = BeautifulSoup(requests.get(
    "https://en.wikipedia.org/wiki/List_of_alternative_country_names").content,
    "html.parser")
wikitables = soup.find_all("table", class_="wikitable")

for wt in wikitables:
    # skip header row
    rows = wt.find_all("tr")[1:]
    for row in rows:
        tds = row.find_all("td")
        main = tds[0].find("a")["title"]
        alts = [x.text for x in tds[1].find_all("b")]
        if main not in cnames:
            cnames[main] = alts
        else:
            cnames[main] += alts

# Save to db
conn = sqlite3.connect("../data.db")
cur = conn.cursor()
cur.execute("DROP TABLE IF EXISTS countries")
cur.execute("""
    CREATE TABLE countries(name text, alts text, count integer, freq real)
""")

for key, val in cnames.items():
    alts = ', '.join(val)
    cur.execute("INSERT INTO countries VALUES (?, ?, ?, ?)", (
        key, alts, 0, 0))

conn.commit()
conn.close()
