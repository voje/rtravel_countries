# This script processes 'submissions' table and
# adds a country class to each entry.

import sqlite3
import re
from nltk import everygrams
from nltk import word_tokenize
import _pickle as pickle


hits = {
    "name": 0,
    "capital": 0,
    "alt_n": 0,
    "other_ct": 0,
    "none": 0
}


def guess_country(txt):
    re_capital = re.compile('[A-Z][a-z,A-Z]+')
    # Extract names from txt

    # First, split by punctuations
    snt = re.split('[.,?!;]', txt)
    ngrsnt = []
    # Then, tokenize
    for s in snt:
        if len(s) <= 1:
            continue
        tks = word_tokenize(s)
        # Keep the ngrams that start with a capital word
        ngrsnt += [
            x for x in everygrams(tks, max_len=4) if re_capital.match(x[0])
        ]

    # transpose everything to lower case, join tokens into strings
    names = [(" ".join(x)).lower() for x in ngrsnt]

    # Iterate cnames table, find a match.
    # Match name.
    for key, val in cnames.items():
        if key in names:
            hits["name"] += 1
            return key

    # Match capital.
    for key, val in cnames.items():
        if val["capital"] in names:
            hits["capital"] += 1
            return key

    # Match alt names.
    for key, val in cnames.items():
        for altn in val["alt_n"]:
            if altn in names:
                hits["alt_n"] += 1
                return key

    # Match big cities.
    for key, val in cnames.items():
        for city in val["other_ct"]:
            if city in names:
                hits["other_ct"] += 1
                return key

    # No match found.
    hits["none"] += 1
    return None


conn = sqlite3.connect("../data.db")
cur = conn.cursor()

# Clear the tables before reapplying results
cur.execute("UPDATE submissions SET country=NULL")

# Prepare country names
with open("../countries.pickle", "rb") as file:
    cnames = pickle.load(file)

# Prepare for looping (add row id info for reinserting information)
cur.execute("SELECT rowid,* FROM submissions")
fall = cur.fetchall()


i = 0
for tpl in fall:
    # Some feedback in the terminal.
    if i % 100 == 0:
        print("row: %d" % i)

    # Set a limit for testing.
    """
    if i >= 10000:
        break
    """

    country = guess_country(tpl[1])

    # Insert into DB
    if country is not None:
        cur.execute(str.format(
            "UPDATE submissions SET country='%s' WHERE rowid=%d" %
            (country, tpl[0])
        ))

    subm = cur.fetchone()
    i += 1


# Display statistics.
for key, val in hits.items():
    print(key + ": " + str(val))
tmp = hits["none"]
print("Matched %d out of %d (%f%%)." % (i - tmp, i, (i - tmp) / i))

conn.commit()
conn.close()
