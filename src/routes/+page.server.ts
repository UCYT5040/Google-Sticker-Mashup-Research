import type {PageLoad} from './$types';
import {stickerPath} from '$lib/download';
import fs from 'fs';
import {formattedPairToEmojis} from '$lib/format';

export const load: PageLoad = () => {
    // Find a list of all emojis that have at least one sticker
    let emojisWithStickers: Set<string> = new Set();
    // List all files in the stickers directory
    const files = fs.readdirSync(stickerPath);
    // Assume all files are in the format "emojiA_emojiB.png"
    for (const file of files) {
        const emojis = formattedPairToEmojis(file.replace(/\.png$/, ''));
        if (emojis.length === 2) {
            emojisWithStickers.add(emojis[0]);
            emojisWithStickers.add(emojis[1]);
        }
    }
    // Convert the set to an array and return it
    return {
        emojisWithStickers: Array.from(emojisWithStickers)
    };
};