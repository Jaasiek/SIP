import json

final_path = "data/routes/stops.json"


def getting_route(line: str, path: str, variant: str = None) -> str:
    with open(path, "r", encoding="utf-8") as file:
        data = json.load(file)

    line_data = data.get(line)
    if line_data is None:
        return f"No data found for line {line}"

    if variant:
        result = line_data.get(variant)
        if result is None:
            return f"No data found for variant {variant} of line {line}"

        return json.dumps(result, indent=4, ensure_ascii=False)

    else:
        return json.dumps(line_data, indent=4, ensure_ascii=False)


print(getting_route("33", final_path))
