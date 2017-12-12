import sqlite3
import json


def dump_json(dbname="../data.db", table="countries"):
    conn = sqlite3.connect(dbname)
    conn.row_factory = sqlite3.Row

    cur = conn.cursor()
    cur.execute(str.format("SELECT * FROM %s" % table))

    rows = cur.fetchall()

    json_dump = json.dumps([dict(x) for x in rows])
    return json_dump

    conn.commit()
    conn.close()


def dump_json_to_file(dbname="../data.db", filename="../data.json"):
    # Dump submissions table to .json file (for online diaplay)
    conn = sqlite3.connect(dbname)
    conn.row_factory = sqlite3.Row

    cur = conn.cursor()
    cur.execute("""
        SELECT created_utc, country
        FROM submissions
        WHERE country not NULL
    """)

    rows = cur.fetchall()

    json_dump = json.dumps([dict(x) for x in rows])
    with open(filename, "w") as file:
        file.write(json_dump)

    conn.commit()
    conn.close()
