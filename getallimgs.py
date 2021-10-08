from urllib.parse import quote
import json

import requests

api_url_format = "https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q={}_{}"

with open("emojis.txt") as f:
    emojis = set(f.read().strip())

image_urls = {}

for emoji1 in emojis:
    for emoji2 in emojis:
        print(f"{ord(emoji1):x}_{ord(emoji2):x} ({emoji1} + {emoji2})")
        api_url = api_url_format.format(quote(emoji1), quote(emoji2))
        data = requests.get(api_url).json()
        results = data["results"]
        if not results:
            print("  - skipped")
            continue
        url = results[0]["media_formats"]["png_transparent"]["url"]
        fp = url.split('/')[-1]
        if fp in image_urls:
            print("  + duplicate")
        image_urls[fp] = url

with open("image_urls.json", "w") as f:
    json.dump(image_urls, f, indent=2)


