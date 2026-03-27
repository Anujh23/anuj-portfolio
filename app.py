from flask import Flask, render_template
import threading
import time
import urllib.request

app = Flask(__name__)

SELF_URL = "https://anuj-portfolio-bzx7.onrender.com"

def keep_alive():
    time.sleep(30)
    while True:
        try:
            urllib.request.urlopen(SELF_URL, timeout=10)
        except Exception:
            pass
        time.sleep(30)

threading.Thread(target=keep_alive, daemon=True).start()


@app.route("/")
def index():
    return render_template("index.html")


if __name__ == "__main__":
    app.run(port=5000)
