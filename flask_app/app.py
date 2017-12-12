from flask import Flask
from flask import render_template
from rtravel_countries import sqlite_to_json
import sqlite3
import json


app = Flask(__name__)

# For auto refreshing in browser.
# Not secure though. OK for localhost.
app.debug = True


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/index_series.html")
def index_series():
    return render_template("index_series.html")


@app.route("/data/countries")
def data_contries():
    return sqlite_to_json.dump_json(
        dbname="../data.db", table="countries")


@app.route("/data/submissions1")
def data_submissions1():
    conn = sqlite3.connect("../data.db")
    conn.row_factory = sqlite3.Row

    cur = conn.cursor()
    cur.execute(str.format("""
        SELECT created_utc, country
        FROM submissions
        WHERE country NOT NULL
    """))

    rows = cur.fetchall()

    json_dump = json.dumps([dict(x) for x in rows])

    # Use this to dump to file.
    conn.commit()
    conn.close()

    return json_dump


@app.route("/test")
def test():
    return render_template("test.html")


@app.route("/test_series")
def test_series():
    return render_template("test_series.html")


if __name__ == "__main__":
    app.run()
