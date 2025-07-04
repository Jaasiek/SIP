from flask import Flask, request, jsonify, render_template, Response
from flask_socketio import SocketIO
from scripts.route_search import getting_route
from scripts.sanitize_filename import sanitize_filename
from scripts.announcements_stream import stream_audio


app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

stops = []
stop_iterator = 0
ANNOUNCEMENTS_FOLDER = "../data/announcements/"


@app.get("/")
def driver_get():
    return render_template("driver.html"), 200


@app.get("/bus/info_screen")
def bus_info_sceen():
    return render_template("/bus/info_screen.html"), 200


@app.get("/tram/info_screen")
def tram_info_screen():
    return render_template("/tram/info_screen.html"), 200


@app.get("/metro")
def metro_screen():
    return render_template("/metro/metro.html"), 200


@app.get("/bus/koral")
def bus_koral():
    return render_template("/bus/koral.html"), 200


@app.get("/tram/koral")
def tram_koral():
    return render_template("/tram/koral.html"), 200


@app.post("/driver")
def driver_post():
    data = request.get_json()
    line = data.get("line")
    try:
        variants = getting_route(line, "SHOW")
        return (
            jsonify(
                {
                    "variants": variants,
                    "success": True,
                }
            ),
            201,
        )
    except KeyError:
        return jsonify({"success": False}), 400


@app.post("/route_post")
def get_route():
    global stops, line, stop_iterator
    data = request.get_json()
    line = data.get("line")
    variant = data.get("variant")
    brigade = data.get("brigade")
    driverID = data.get("driverID")
    stop_iterator = 0
    try:
        stops = getting_route(line, variant)
        socketio.emit(
            "update_route",
            {
                "success": True,
                "route": stops,
                "line": line,
                "streets": stops["streets"],
                "variant": variant,
                "brigade": brigade,
                "driverID": driverID,
            },
        )
        return (
            jsonify(
                {
                    "success": True,
                }
            ),
            200,
        )
    except KeyError:
        stops = []
        return jsonify({"success": False}), 400


@app.post("/next_stop")
def next_stop_post():
    global stop_iterator, stop_name, stop_number, stop_street, stop_type
    try:
        stop_name = stops["stops"][stop_iterator]["name"]
        stop_type = stops["stops"][stop_iterator]["type"]
        stop_number = stops["stops"][stop_iterator]["stop_number"]
        stop_street = stops["stops"][stop_iterator]["stop_street"]
        stop_iterator += 1
        if stop_type == "2":
            stop_name = f"{stop_name} - NA ŻĄDANIE (ON REQUEST)"

        socketio.emit(
            "next_stop",
            {
                "next_stop": stop_name,
                "stop_number": stop_number,
                "success": True,
            },
        )
        return jsonify({"success": True}), 202
    except:
        return jsonify({"success": False, "error": "List index out of range"}), 404


@app.post("/current_stop")
def current_stop_post():
    global stop_name, stop_name, stop_street, stop_type
    try:
        socketio.emit(
            "current_stop",
            {
                "current_stop": stop_name,
                "stop_number": stop_number,
                "stop_street": stop_street,
                "stop_type": stop_type,
                "success": True,
            },
        )
        return jsonify({"success": True}), 202
    except:
        return jsonify({"success": False}), 404


@app.get("/next_stop_announcement/<string:filename>")
def next_stop_announcement(filename: str):
    filename = sanitize_filename(filename)

    next_stop = "next_stop.mp3"
    on_request = "on_request.mp3"

    if filename.endswith(" - NA ŻĄDANIE (ON REQUEST).mp3"):
        filename = filename.replace(" - NA ŻĄDANIE (ON REQUEST).mp3", "")
        filename = f"{filename}.mp3"
        print(filename)
        filenames = [next_stop, filename, on_request]
    else:
        filenames = [next_stop, filename]

    return (
        Response(
            stream_audio(filenames, "../data/announcements"), mimetype="audio/mpeg"
        ),
        200,
    )


@app.get("/current_stop_announcement/<string:filename>")
def current_stop_announcement(filename):
    filename = sanitize_filename(filename)

    on_request = "on_request.mp3"

    if filename.endswith(" - NA ŻĄDANIE (ON REQUEST).mp3"):
        filename = filename.replace(" - NA ŻĄDANIE (ON REQUEST).mp3", "")
        filename = f"{filename}.mp3"
        print(filename)
        filenames = [filename, on_request]
    else:
        filenames = [filename]

    return (
        Response(
            stream_audio(filenames, "../data/announcements"), mimetype="audio/mpeg"
        ),
        200,
    )


@app.get("/last_stop_announcement/<string:filename>")
def last_stop_announcement(filename):
    filename = sanitize_filename(filename)

    last_stop = "last_stop.mp3"
    filenames = [filename, last_stop]

    return (
        Response(
            stream_audio(filenames, "../data/announcements"), mimetype="audio/mpeg"
        ),
        200,
    )


@app.get("/shortened_course/<string:filename>")
def shortened_course_annoncement(filename):
    filename = sanitize_filename(filename)

    shortened_course = "shortened_course.mp3"
    filenames = [shortened_course, filename]

    return (
        Response(
            stream_audio(filenames, "../data/announcements"), mimetype="audio/mpeg"
        ),
        200,
    )


if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, debug=True, allow_unsafe_werkzeug=True)
