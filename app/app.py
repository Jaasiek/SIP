from flask import Flask, request, jsonify, render_template, json
from route_search import getting_route

app = Flask(__name__)

stops = []


@app.route("/", methods=["GET"])
def home_page():
    return render_template("selector.html")


@app.post("/route_post")
def get_route():
    global stops
    global line
    data = request.get_json()
    line = data.get("line")
    variant = data.get("variant")
    try:
        stops = getting_route(line, variant)
        return jsonify({"success": True, "stops": stops})  # No need for json.dumps()
    except KeyError:
        return jsonify({"success": False})


@app.get("/route_get")
def route_get():
    return jsonify(
        {
            "stops": stops,
            "line": line,
            "success": True,
        }
    )


@app.get("/metro")
def metro_screen():
    return render_template("/metro/metro.html")


if __name__ == "__main__":
    app.run(debug=True)
