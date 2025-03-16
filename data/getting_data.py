import urllib.request, json
import os


def public_transport_routes_get() -> None:
    with urllib.request.urlopen(
        "https://api.um.warszawa.pl/api/action/public_transport_routes/?apikey=12f6c8fa-cc23-4405-9c42-30071dbcbfba"
    ) as url:
        data = json.load(url)
        with open("data/public_transport_routes.json", "w") as file:
            file.write(json.dumps(data))
        print("collected")


def public_transport_stops_get() -> None:
    with urllib.request.urlopen(
        "https://api.um.warszawa.pl/api/action/dbstore_get/?id=ab75c33d-3a26-4342-b36a-6e5fef0a3ac3&12f6c8fa-cc23-4405-9c42-30071dbcbfba"
    ) as url:
        data = json.load(url)
        with open("data/public_transport_stops.json", "w") as file:
            file.write(json.dumps(data))
        print("collected")


public_transport_routes_get()
public_transport_stops_get()
