# Google Emoji Kitchen Research
<center>![Google Sticker Banner](https://github.com/UCYT5040/Google-Sticker-Mashup-Research/blob/main/banner.png?raw=true)</center>

Research on how Gboard Emoji Kitchen Stickers work.
> **Note:** It is not recommended to use any of our Python files to download stickers, just clone this repo and use the stickers directory.
## Links
- https://random.ucyt5040.repl.co/ - random sticker (missing new stickers)
- https://sticker-vote.ucyt5040.repl.co/ - vote for your favorite sticker (soon to have new stickers)
## Contribute
Contributing is nice, and you will be listed below for contributing.
### Contributors
- Sebi (@Supersebi3)
- kerky the duck (@kerkpower)
- UCYT5040 (@UCYT5040)
- w4v3 (@w4v3)


If you don't know what to contribute, vote on https://sticker-vote.ucyt5040.repl.co/ for the best sticker. Data is posted in `data.json`. Open an issue if it isnt working.
## Info
```
App: Gboard (10199)
Protocol: QUIC (UDP)
SNI: tenor.googleapis.com
Source: 10.215.173.1:46205
Destination: 142.250.190.74:443
Status: Closed
Bytes: 3.9 KB received — 3.7 KB sent
Packets: 9 received — 9 sent
Duration: < 1 s
First Seen: 10/07/21 14:42:21.691
Last Seen: 10/07/21 14:42:21.817
```
![](https://github.com/UCYT5040/Google-Sticker-Mashup-Research/blob/main/img/nslookup.jpg?raw=true)
`ord37s34-in-f10.1e100.net`
At first we thougt that that doesn't look like Google, but it gives a Google 404 error.
```
  let api = new URL('https://tenor.googleapis.com/v2/featured');
  api.searchParams.append('key', 'AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ');
  api.searchParams.append('client_key', 'gboard');
  api.searchParams.append('contentfilter', 'high');
  api.searchParams.append('media_filter', 'png_transparent');
  api.searchParams.append('component', 'proactive');
  api.searchParams.append('collection', 'emoji_kitchen_v5');
  api.searchParams.append('locale', 'en_US');
  api.searchParams.append('country', 'US');
  api.searchParams.append('q', query2 ? `${query}_${query2}` : query);
```
https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=panda_panda
This link seems to work but the query doesn't match what we are looking for.
**Update:**
Instead of text as the emoji name, use the ascii code.
