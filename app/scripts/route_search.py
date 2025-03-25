import json

final_path = "../data/routes/stops.json"


def getting_route(line: str, variant: str = None):
    with open(final_path, "r", encoding="utf-8") as file:
        data = json.load(file)

    line_data = data.get(line)
    if line_data is None:
        raise KeyError(f"No data found for line {line}")

    if variant == "SHOW":
        variants = {}
        for variant_key, stops in line_data.items():
            stops_list = list(stops.values())
            if stops_list:
                starting = stops_list[0]["nazwa_zespolu"]
                direction = stops_list[-1]["nazwa_zespolu"]
                variants[variant_key] = {
                    "starting": starting,
                    "direction": direction,
                }

        return {"line": line, "variants": variants}

    if variant != "0":
        result = line_data.get(variant)
        if result is None:
            raise KeyError(f"No data found for variant {variant} of line {line}")

        stops = [
            {
                "name": stop_data["nazwa_zespolu"],
                "type": stop_data["typ"],
                "stop_number": stop_data["nr_przystanku"],
                "stop_street": stop_data["nazwa_ulicy"],
            }
            for stop_data in result.values()
        ]

        for stop in stops:
            if stop["type"] == "4" or stop["type"] == 5:
                direction = stop["name"]
        else:
            direction = stops[-1]["name"]

        streets = []
        previoust_stop = None
        for stop_data in result.values():
            current_street_name = stop_data["nazwa_ulicy"]
            if current_street_name != previoust_stop:
                streets.append(current_street_name)
                previoust_stop = current_street_name

        return {"stops": stops, "streets": streets, "direction": direction}

    return {"line": line, "variants": list(line_data.keys())}


# while True:
#     line = input("Line: ").upper()
#     variant = input("Variant: ").upper()

#     if line == "Q":
#         break

#     print(getting_route(line, variant))
