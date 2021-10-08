all_emojis = open("emojis.txt").read()
import itertools, requests

for emoji1, emoji2 in list(itertools.combinations(all_emojis, 2)):
    e1 = hex(ord(emoji1))[2:]
    e2 = hex(ord(emoji2))[2:]
    filename = "all_emojis/u{0}_u{1}.png"
    url = "https://www.gstatic.com/android/keyboard/emojikitchen/20201001/u{0}/u{0}_u{1}.png"
    image = url.format(e1, e2)
    r = requests.get(url.format(e1, e2), allow_redirects=True)
    if r.headers.get('content-type') == 'image/png':open(filename.format(e1, e2), "wb").write(r.content)
for emoji1 in all_emojis:
    e1 = hex(ord(emoji1))[2:]
    e2 = hex(ord(emoji2))[2:]
    filename = "all_emojis/u{0}_u{1}.png"
    url = "https://www.gstatic.com/android/keyboard/emojikitchen/20201001/u{0}/u{0}_u{1}.png"
    image = url.format(e1, e2)
    r = requests.get(url.format(e1, e2), allow_redirects=True)
    if r.headers.get('content-type') == 'image/png':open(filename.format(e1, e2), "wb").write(r.content)