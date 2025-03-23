import json
import re
from gtts import gTTS
import os
import time
import random


# Funkcja do czyszczenia nazw plików
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


# Wczytanie listy przystanków
stops_list = unique_stops("data/routes/public_transport_stops.json")

# Utworzenie katalogu na zapowiedzi (jeśli nie istnieje)
os.makedirs("data/announcements", exist_ok=True)

# Generowanie plików audio
for i, stop in enumerate(stops_list):
    sanitized_stop = sanitize_filename(stop)
    file_path = f"data/announcements/{sanitized_stop}.mp3"

    if not os.path.exists(file_path):  # Sprawdź, czy plik już istnieje
        try:
            tts = gTTS(f"{stop}", lang="pl")
            tts.save(file_path)
            print(f"✔ Zapowiedź dla {stop} zapisana jako {file_path}")

            # 🔥 Opóźnienie losowe 1-3 sekundy, aby uniknąć blokady
            time.sleep(random.uniform(1, 3))

        except Exception as e:
            print(f"❌ Błąd dla '{stop}': {e}")
            # 🔥 Jeśli dostaniesz 429, zrób dłuższą przerwę i spróbuj ponownie
            if "429" in str(e):
                print("🚨 Wykryto blokadę — czekanie 30 sekund...")
                time.sleep(30)

# Generowanie dodatkowych zapowiedzi
tts = gTTS("Następny przystanek:", lang="pl")
tts.save("data/announcements/next_stop.mp3")
tts = gTTS("Przystanek końcowy, prosimy o opuszczenie pojazdu", lang="pl")
tts.save("data/announcements/last_stop.mp3")

print("✔ Zapowiedzi wygenerowane poprawnie!")
