from flask import Flask, request, jsonify, render_template
from flask_socketio import SocketIO
from scripts.route_search import getting_route

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

stops = []

stop_iterator = 0


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
        socketio.emit(
            "update_route",
            {
                "success": True,
                "route": stops,
                "line": line,
                "streets": stops["streets"],
            },
        )
        return jsonify(
            {
                "success": True,
            }
        )
    except KeyError:
        stops = []
        return jsonify({"success": False})


@app.get("/route_get")
def route_get():
    global stop_iterator
    stop_iterator = 0
    try:
        return jsonify(
            {
                "route": stops,
                "line": line,
                "success": True,
            }
        )
    except:
        return jsonify(
            {
                "message": "No data yet",
                "success": False,
            }
        )


@app.post("/next_stop")
def next_stop_post():
    global stop_iterator, stop_name, stop_number

    stop_name = stops["stops"][stop_iterator]["name"]
    stop_type = stops["stops"][stop_iterator]["type"]
    stop_number = stops["stops"][stop_iterator]["stop_number"]
    stop_iterator += 1
    if stop_type == "2":
        stop_name = f"{stop_name} - NŻ"

    socketio.emit(
        "next_stop",
        {"next_stop": stop_name, "stop_number": stop_number, "success": True},
    )
    return jsonify({"success": True})


@app.post("/current_stop")
def current_stop_post():
    global stop_name, stop_name

    socketio.emit(
        "current_stop",
        {"current_stop": stop_name, "stop_number": stop_number, "success": True},
    )
    return jsonify({"success": True})


@app.get("/bus/info_screen")
def bus_info_sceen():
    return render_template("/bus/info_screen.html")


@app.get("/metro")
def metro_screen():
    return render_template("/metro/metro.html")


if __name__ == "__main__":
    socketio.run(app, debug=True, allow_unsafe_werkzeug=True)
