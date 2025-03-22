import json


def unique_stops(stops_path):
    with open(stops_path, "r", encoding="utf-8") as file:
        data = json.load(file)

    nazwa_zespolu_list = set()
    for entry in data["result"]:
        for value in entry["values"]:
            if value["key"] == "nazwa_zespolu":
                nazwa_zespolu_list.add(value["value"])

    nazwa_zespolu_list = list(nazwa_zespolu_list)

    return nazwa_zespolu_list


print(unique_stops("data/routes/public_transport_stops.json"))
