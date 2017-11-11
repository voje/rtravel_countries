from flask import Flask
from flask import render_template
from rtravel_countries import sqlite_to_json


app = Flask(__name__)

# For auto refreshing in browser.
# Not secure though. OK for localhost.
app.debug = True


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/data/countries")
def data_contries():
    return sqlite_to_json.dump_json(
        dbname="../data.db", table="countries")


@app.route("/raw")
def raw():
    return render_template("raw.html")


if __name__ == "__main__":
    app.run()
