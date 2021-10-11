# Google-Sticker-Mashup-Research
Research on how Gboard Stickers work.
## Contribute
Contributing is nice, and you will be listed below for contributing.
### Contributors
- Sebi (@Supersebi3)
- kerky the duck (@kerkpower)
- UCYT5040 (@UCYT5040)
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
