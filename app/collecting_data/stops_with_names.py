import json


def naming_stops(routes_path, stops_path, final_path) -> None:
    with open(routes_path, "r", encoding="utf-8") as f:
        routes_data = json.load(f)

    with open(stops_path, "r", encoding="utf-8") as f:
        stops_data = json.load(f)

    zespol_to_nazwa = {}
    for stop in stops_data["result"]:
        zespol = None
        nazwa_zespolu = None
        for entry in stop["values"]:
            if entry["key"] == "zespol":
                zespol = entry["value"]
            elif entry["key"] == "nazwa_zespolu":
                nazwa_zespolu = entry["value"]

        if zespol and nazwa_zespolu:
            zespol_to_nazwa[zespol] = nazwa_zespolu

    stops_with_names = {}
    for line, directions in routes_data["result"].items():
        stops_with_names[line] = {}
        for direction, stops in directions.items():
            stops_with_names[line][direction] = {}
            for stop_id, stop_data in stops.items():
                nr_zespolu = stop_data["nr_zespolu"]
                nazwa_zespolu = zespol_to_nazwa.get(nr_zespolu, "Unknown")
                stops_with_names[line][direction][stop_id] = {
                    "odleglosc": stop_data["odleglosc"],
                    "ulica_id": stop_data["ulica_id"],
                    "nr_zespolu": nr_zespolu,
                    "nazwa_zespolu": nazwa_zespolu,
                    "typ": stop_data["typ"],
                    "nr_przystanku": stop_data["nr_przystanku"],
                }

    with open(final_path, "w", encoding="utf-8") as f:
        json.dump(stops_with_names, f, indent=4, ensure_ascii=False)

    print("named")
