import sqlite3


def guess_country(txt):
    return "South Korea"


conn = sqlite3.connect("../data.db")
cur = conn.cursor()

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
    if i > 10:
        break
    country = guess_country(tpl[1])
    if country is not None:
        cnames[country]["count"] += 1
        cur.execute(
            str.format("UPDATE submissions SET country='%s' WHERE rowid=%d" % (
                country, tpl[0]))
        )

    subm = cur.fetchone()
    i += 1

conn.commit()
conn.close()
