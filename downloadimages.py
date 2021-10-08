import json, grequests
from requests_threads import AsyncSession

session = AsyncSession(n=100)

async def _main():
    rs = []
    urls = json.load(open("image_urls.json", "r"))
    urls = dict([(value, key) for key, value in urls.items()])
    for url in urls.keys():
        rs.append(await session.get(url))
    print(rs)
    for r in rs:
      filename = f"stickers/{urls[r.url]}"
      open(filename, "wb").write(r.content)

if __name__ == '__main__':
    session.run(_main)
    
