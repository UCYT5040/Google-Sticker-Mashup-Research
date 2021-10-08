all_emojis = open("emojis.txt").read()
import itertools, requests

for emoji1, emoji2 in list(itertools.combinations(all_emojis, 2)):
    e1 = hex(ord(emoji1))[2:]
    e2 = hex(ord(emoji2))[2:]
    filename = "u{0}_u{1}.png"
    url = "https://www.gstatic.com/android/keyboard/emojikitchen/20201001/u{0}/u{0}_u{1}.png"
    image = url.format(e1, e2)
    url = "https://www.facebook.com/favicon.ico"
    r = requests.get(url, allow_redirects=True)
    open(filename.format(e1, e2), "wb").write(r.content)
