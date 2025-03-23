import os


def stream_audio(filenames, announcement_folder):
    for filename in filenames:
        file_path = os.path.join(announcement_folder, filename)
        if os.path.exists(file_path):
            with open(file_path, "rb") as file:
                chunk = file.read(1024)
                while chunk:
                    yield chunk
                    chunk = file.read(1024)
