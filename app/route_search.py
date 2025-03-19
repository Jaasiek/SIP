import json

final_path = "data/routes/stops.json"


def getting_route(line: str, variant: str = None):
    with open("data/routes/stops.json", "r", encoding="utf-8") as file:
        data = json.load(file)

    line_data = data.get(line)
    if line_data is None:
        return {
            "error": f"No data found for line {line}"
        }  # Return a dictionary instead of a string

    if variant == "SHOW":
        variants = list(line_data.keys())
        return variants  # Return as a Python list (Flask will convert it to JSON automatically)

    if variant != "0":
        result = line_data.get(variant)
        if result is None:
            return {
                "error": f"No data found for variant {variant} of line {line}"
            }  # Return dict instead of string

        stops = [stop_data["nazwa_zespolu"] for stop_data in result.values()]
        return stops  # Return as a Python list

    return line_data  # Return as a dictionary (Flask will convert it)


# while True:
#     line = input("Line: ").upper()
#     type = input("Type: ").upper()

#     if line == "QUIT" or type == "QUIT":
#         print("\n shutting down \n")
#         break

#     print(getting_route(line, type))
