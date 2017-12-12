# No need for database, create a dicionary and pickle it.

import requests
from bs4 import BeautifulSoup
import _pickle as pickle

cnames = {}

# Country names, capital cities, big cities.
soup = BeautifulSoup(
    requests.get(
        # Url broken across 2 lines.
        "https://en.wikipedia.org/wiki/"
        "List_of_countries_by_national_capital_and_largest_cities"
    ).content,
    "html.parser")

wikitables = soup.findAll("table", class_="wikitable")

# Use the first 2 tables on page.
for table in wikitables[0:2]:
    rows = table.findAll("tr")
    for r in rows:
        tds = r.findAll("td")
        if len(tds) == 0:
            continue

        # Fix 'Korea, North' and similar.
        name = tds[0].find("a")["title"]
        sname = name.split(", ")
        if len(sname) == 2:
            name = sname[1] + " " + sname[0]

        capital = tds[1].find("a")["title"]
        other_cities = []
        if len(tds) == 3:
            other_cities = [x["title"] for x in tds[2].findAll("a")]

        cnames[name] = {
            "capital": capital,
            "other_ct": other_cities,
            "alt_n": []
        }


# Alternative country names.
soup = BeautifulSoup(
    requests.get(
        "https://en.wikipedia.org/wiki/List_of_alternative_country_names"
    ).content,
    "html.parser")
wikitables = soup.findAll("table", class_="wikitable")
for table in wikitables:
    rows = table.findAll("tr")
    for r in rows:
        tds = r.findAll("td")
        if len(tds) == 0:
            continue
        name = tds[0].find("a")["title"]
        alt_names = [x.text for x in tds[1].findAll("b")]

        if name not in cnames.keys():
            print(name)
            match_key = None
            match_val = 0
            for key in cnames.keys():
                if name in key:
                    print("%s matched with %s." % (name, key))
                    cnames[key]["alt_n"] = alt_names
                    break
        else:
            cnames[name]["alt_n"] = alt_names


# Add US states, since reddit is a US website.
# I'm going to do the blasphemous deed of appending all the states
# as an alternative name for United States of America
"""
states = []
soup = BeautifulSoup(
    requests.get(
        "https://en.wikipedia.org/wiki/"
        "List_of_states_and_territories_of_the_United_States"
    ).content,
    "html.parser")

table = soup.find("table", class_="wikitable")
rows = table.findAll("tr")
for r in rows[2:]:
    th = r.findAll("th")
    if len(th) == 0:
        continue
    states += [th[0].find("a").text]

cnames["United States"]["alt_n"] += states
"""

# Convert everything to lower case.
lcnames = {}
for key, val in cnames.items():
    lcnames[key.lower()] = {
        "capital": (val["capital"]).lower(),
        "other_ct": [x.lower() for x in val["other_ct"]],
        "alt_n": [x.lower() for x in val["alt_n"]]
    }

# Pickle this file
with open("../countries.pickle", "wb") as file:
    pickle.dump(lcnames, file, -1)

"""
# For loading:
with open("../countries.pickle", "rb") as file:
    cnames1 = pickle.load(file)
"""
