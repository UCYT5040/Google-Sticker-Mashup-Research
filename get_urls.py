from urllib.parse import quote
import grequests
import itertools

api_url_format = "https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q={}_{}"

print("Generating URLs...")

with open("emojis.txt") as f:
    emojis = set(f.read().strip().splitlines())

multichar_ord = lambda s: '-'.join(map(lambda c: f"{ord(c):x}", (s)))

api_urls = [api_url_format.format(quote(combo[0]), quote(combo[1])) for combo in itertools.combinations(emojis, 2)]

rs = (grequests.get(url) for url in api_urls)

done = 0

print("Sending & parsing requests...")

requests = grequests.imap(rs)

length = len(api_urls)

image_urls = {}

try:
    for request in tuple(requests):
        done += 1
        data = request.json()
        if data["results"]:
            result = data["results"][0]
            image = result["media_formats"]["png_transparent"]["url"]
            title = f"{multichar_ord(result['tags'][0])}_{multichar_ord(result['tags'][1])}"
            print(f"{done}/{length} & {length-done} left - {title} found")
            image_urls[title] = image
        else:
            print(f"{done}/{length} & {length-done} left - skipped")
except Exception:
    pass # We don't want the code to ever stop.

