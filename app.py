from flask import Flask, render_template
import threading
import time
import urllib.request

app = Flask(__name__)

SELF_URL = "https://anuj-portfolio-bzx7.onrender.com"
keep_alive_started = False

def keep_alive():
    while True:
        time.sleep(300)
        try:
            urllib.request.urlopen(SELF_URL, timeout=10)
        except Exception:
            pass


@app.before_request
def start_keep_alive():
    global keep_alive_started
    if not keep_alive_started:
        keep_alive_started = True
        threading.Thread(target=keep_alive, daemon=True).start()


@app.route("/")
def index():
    return render_template("index.html")


if __name__ == "__main__":
    app.run(port=5000)
