from flask import Flask, request, jsonify, render_template, json
from route_search import getting_route

app = Flask(__name__)


@app.route("/", methods=["GET"])
def home_page():
    return render_template("selector.html")


@app.route("/route_get", methods=["POST"])
def get_route():
    data = request.get_json()
    line = data.get("line")
    variant = data.get("variant")

    stops = getting_route(line, variant)  # Ensures it returns a clean list

    return jsonify({"success": True, "stops": stops})


if __name__ == "__main__":
    app.run(debug=True)
