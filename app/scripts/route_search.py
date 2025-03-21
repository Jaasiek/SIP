import json

final_path = "data/routes/stops.json"


def getting_route(line: str, variant: str = None):
    with open(final_path, "r", encoding="utf-8") as file:
        data = json.load(file)

    line_data = data.get(line)
    if line_data is None:
        raise KeyError(f"No data found for line {line}")

    if variant == "SHOW":
        variants = list(line_data.keys())
        return {"line": line, "variants": variants, "success": True}

    if variant != "0":
        result = line_data.get(variant)
        if result is None:
            raise KeyError(f"No data found for variant {variant} of line {line}")

        stops = [
            {"name": stop_data["nazwa_zespolu"], "type": stop_data["typ"]}
            for stop_data in result.values()  # Order preserved
        ]

        return {"stops": stops}

    return {"line": line, "variants": list(line_data.keys()), "success": True}


# while True:
#     line = input("Line: ").upper()
#     type = input("Type: ").upper()

#     if line == "QUIT" or type == "QUIT":
#         print("\n shutting down \n")
#         break

#     print(getting_route(line, type))
