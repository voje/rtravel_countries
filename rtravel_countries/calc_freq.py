import sqlite3
import re

re_words = re.compile("[A-Z][a-z]+")

def guess_country(txt):
    # Extract names from txt
    names = re_words.findall(txt)

    # Iterate original names
    for key, val in cnames.items():
        if key in names:
            return key

    # Iterate alt names
    for key, val in cnames.items():
        for alt in val["alts"]:
            if alt in names:
                return key

    return None


conn = sqlite3.connect("../data.db")
cur = conn.cursor()

# Clear the tables before reapplying results
cur.execute("UPDATE submissions SET country=NULL")
cur.execute("UPDATE countries SET count=0")

cur.execute("SELECT * FROM countries")
cnames1 = cur.fetchall()
cnames = {}
for cn in cnames1:
    cnames[cn[0]] = {
        "alts": cn[1].split(', '),
        "count": cn[2],
        "freq": cn[3]
    }

cur.execute("SELECT rowid,* FROM submissions")
fall = cur.fetchall()
i = 0
for tpl in fall:
    print("row: %d" % i)
    # Set a limit for testing.
    if i >= 1000:
        break
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
for key, val in cnames.items():
    conn.execute(str.format(
        "UPDATE countries SET count=%d WHERE name='%s'" %
        (val["count"], key)
    ))

conn.commit()
conn.close()
