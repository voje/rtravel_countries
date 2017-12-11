import sqlite3
import re
from nltk import everygrams
from nltk import word_tokenize

re_capital = re.compile('[A-Z][a-z,A-Z]+')


def guess_country(txt):
    global alts
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

    # Iterate original names
    for key, val in cnames.items():
        if key in names:
            return key

    # Iterate alt names
    for key, val in cnames.items():
        for alt in val["alts"]:
            if alt in names:
                alts = alts + 1
                print(alt)
                return key

    return None


conn = sqlite3.connect("../data.db")
cur = conn.cursor()

# Clear the tables before reapplying results
cur.execute("UPDATE submissions SET country=NULL")
cur.execute("UPDATE countries SET count=0")

# Prepare country names
cur.execute("SELECT * FROM countries")
cnames1 = cur.fetchall()
cnames = {}
for cn in cnames1:
    cnames[cn[0]] = {
        "alts": cn[1].split(', '),
        "count": cn[2]
    }

# Prepare for looping
cur.execute("SELECT rowid,* FROM submissions")
fall = cur.fetchall()


i = 0
for tpl in fall:

    # Some feedback in the terminal.
    """
    if i % 100 == 0:
        print("row: %d" % i)
    """

    # Set a limit for testing.
    """
    if i >= 10000:
        break
    """

    country = guess_country(tpl[1])
    if country is not None:
        cnames[country]["count"] += 1
        cur.execute(str.format(
            "UPDATE submissions SET country='%s' WHERE rowid=%d" %
            (country, tpl[0])
        ))

    subm = cur.fetchone()
    i += 1


# Store the updated cnames back to db
# Note: we may not need the count attribute; aggregation
# possible with JavaScript in browser (Crossfilter library)
for key, val in cnames.items():
    conn.execute(str.format(
        "UPDATE countries SET count=%d WHERE name='%s'" %
        (val["count"], key)
    ))

print(alts)

conn.commit()
conn.close()
