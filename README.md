# Google Emoji Kitchen Research

This repository contains all the emoji kitchen combinations from Google's Emoji Kitchen feature, which allows users to
combine two emojis to create a new one.

All the combinations can be found in the `stickers/` directory.

## Web Interface

A web interface, called "Emoji Chef" is available to combine two emojis.

It will first try to get the cached combinations from the `stickers/` directory, and if not found, it will fetch the
combinations from Google's servers.

### Setup

```shell
npm run build
npm ci --omit dev
node build
```

For more options, see [SvelteKit documentation](https://svelte.dev/docs/kit/adapter-node).

