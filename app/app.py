from flask import Flask, request, jsonify, render_template
from scripts.route_search import getting_route

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
        return jsonify({"success": True, "route": stops})
    except KeyError:
        stops = []
        return jsonify({"success": False})


@app.get("/route_get")
def route_get():
    return jsonify(
        {
            "route": stops,
            "line": line,
            "success": True,
        }
    )


@app.get("/bus/info_screen")
def bus_info_sceen():
    return render_template("/bus/info_screen.html")


@app.get("/metro")
def metro_screen():
    return render_template("/metro/metro.html")


if __name__ == "__main__":
    app.run(debug=True)
