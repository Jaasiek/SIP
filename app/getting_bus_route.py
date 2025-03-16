import json


def getting_route(line: str, name: str) -> json:
    with open("public_transport_routes.json", "r") as file:
        data = json.load(file)

    result = data["result"].get(line, {}).get(name, {})

    return json.dumps(result, indent=4)
