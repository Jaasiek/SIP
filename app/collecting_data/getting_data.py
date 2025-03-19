import urllib.request, json
from sorting_data import sorting_data
from stops_with_names import naming_stops

routes_path = "data/routes/public_transport_routes.json"
stops_path = "data/routes/public_transport_stops.json"
final_path = "data/routes/stops.json"


def public_transport_routes_get(path) -> None:
    with urllib.request.urlopen(
        "https://api.um.warszawa.pl/api/action/public_transport_routes/?apikey=12f6c8fa-cc23-4405-9c42-30071dbcbfba"
    ) as url:
        data = json.load(url)
        with open(path, "w") as file:
            file.write(json.dumps(data))
        print("collected")


def public_transport_stops_get(path) -> None:
    with urllib.request.urlopen(
        "https://api.um.warszawa.pl/api/action/dbstore_get/?id=ab75c33d-3a26-4342-b36a-6e5fef0a3ac3&12f6c8fa-cc23-4405-9c42-30071dbcbfba"
    ) as url:
        data = json.load(url)
        with open(path, "w") as file:
            file.write(json.dumps(data))
        print("collected")


if __name__ == "__main__":
    try:
        public_transport_routes_get(routes_path)
        public_transport_stops_get(stops_path)
        naming_stops(
            routes_path=routes_path, stops_path=stops_path, final_path=final_path
        )
        sorting_data(final_path)
        print("power up complete")
    except:
        print("Internet connection fail")
