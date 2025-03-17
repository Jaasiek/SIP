import json

final_path = "data/routes/stops.json"


def getting_route(line: str, path: str, variant: str = None):
    with open(path, "r", encoding="utf-8") as file:
        data = json.load(file)

    line_data = data.get(line)
    if line_data is None:
        return f"No data found for line {line}"

    if variant == "SHOW":
        variants = list(line_data.keys())
        return json.dumps(variants, indent=4, ensure_ascii=False)

    if variant != "0":
        result = line_data.get(variant)
        if result is None:
            return f"No data found for variant {variant} of line {line}"

        stops = [stop_data["nazwa_zespolu"] for stop_data in result.values()]
        return json.dumps(stops, indent=4, ensure_ascii=False)

    else:
        return json.dumps(line_data, indent=4, ensure_ascii=False)


while True:
    line = input("Line: ").upper()
    type = input("Type: ").upper()

    if line == "QUIT" or type == "QUIT":
        print("\n shutting down \n")
        break

    print(getting_route(line, final_path, type))
