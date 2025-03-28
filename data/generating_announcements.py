import json
import re
from gtts import gTTS
import os
import time
import random


def sanitize_filename(name):
    name = re.sub(r'[<>:"/\\|?*]', "_", name)
    name = name.strip()
    name = name[:100]
    return name


def unique_stops(stops_path):
    with open(stops_path, "r", encoding="utf-8") as file:
        data = json.load(file)

    nazwa_zespolu_list = set()
    for entry in data["result"]:
        for value in entry["values"]:
            if value["key"] == "nazwa_zespolu":
                nazwa_zespolu_list.add(value["value"])

    return list(nazwa_zespolu_list)


stops_list = unique_stops("data/routes/public_transport_stops.json")


os.makedirs("data/announcements", exist_ok=True)


for i, stop in enumerate(stops_list):
    sanitized_stop = sanitize_filename(stop)
    file_path = f"data/announcements/{sanitized_stop}.mp3"

    if not os.path.exists(file_path):
        try:
            tts = gTTS(f"{stop}", lang="pl")
            tts.save(file_path)
            print(f"✔ Zapowiedź dla {stop} zapisana jako {file_path}")

            time.sleep(random.uniform(1, 3))

        except Exception as e:
            print(f"❌ Błąd dla '{stop}': {e}")

            if "429" in str(e):
                print("🚨 Wykryto blokadę — czekanie 30 sekund...")
                time.sleep(30)


tts = gTTS("Następny przystanek:", lang="pl")
tts.save("data/announcements/next_stop.mp3")
tts = gTTS("Przystanek końcowy, prosimy o opuszczenie pojazdu", lang="pl")
tts.save("data/announcements/last_stop.mp3")
tts = gTTS("Przystanek na żądanie", lang="pl")
tts.save("data/announcements/on_request.mp3")
tts = gTTS("Uwaga! Zjazd do zajezdni, ostatni przystanek na trasie:", lang="pl")
tts.save("data/announcements/depot_return.mp3")
tts = gTTS("Uwaga! Kurs skrócony, ostatni przystanek:", lang="pl")
tts.save("data/announcements/shortened_course.mp3")


print("✔ Zapowiedzi wygenerowane poprawnie!")
