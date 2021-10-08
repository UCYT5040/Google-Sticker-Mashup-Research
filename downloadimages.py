import json, grequests
urls = json.load(open("image_urls", "r"))
urls = dict([(value, key) for key, value in urls.items()])
responses = (grequests.get(url) for url in urls.keys())
responses = grequests.map(responses)
for r in responses:
  filename = f"stickers/{urls[r.url]}"
  open(filename, "wb").write(r.content)
