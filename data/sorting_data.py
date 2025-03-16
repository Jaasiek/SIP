import json

with open("stops_with_names.json", "r", encoding="utf-8") as f:
    stops_with_names = json.load(f)

for line, directions in stops_with_names.items():
    for direction, stops in directions.items():
        sorted_stops = dict(sorted(stops.items(), key=lambda x: x[1]["odleglosc"]))
        stops_with_names[line][direction] = sorted_stops

with open("stops_with_names.json", "w", encoding="utf-8") as f:
    json.dump(stops_with_names, f, indent=4, ensure_ascii=False)
