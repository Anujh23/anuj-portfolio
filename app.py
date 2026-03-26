from flask import Flask, render_template
import threading
import time
import urllib.request

app = Flask(__name__)

SELF_URL = "https://anuj-portfolio-bzx7.onrender.com"

def keep_alive():
    while True:
        time.sleep(30)
        try:
            urllib.request.urlopen(SELF_URL)
        except Exception:
            pass

threading.Thread(target=keep_alive, daemon=True).start()


@app.route("/")
def index():
    return render_template("index.html")


if __name__ == "__main__":
    app.run(port=5000)
