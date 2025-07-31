/**
 * @file download.ts
 * @description Utilities to download emoji pairs from the Google Emoji Kitchen and save them to the file system.
 */


import {emojiToCodepointString, formatEmojiPair} from './format';
import fs from 'fs';

export const stickerPath = process.env.STICKER_PATH || 'stickers';

const dates = ["20201001", "20210831", "20220815", "20230803", "20240530"]

export function getUrls(emojiA: string, emojiB: string): string[] {
    return dates.map(date =>
        `https://www.gstatic.com/android/keyboard/emojikitchen/${date}/${
            emojiToCodepointString(emojiA)
        }/${
            formatEmojiPair(emojiA, emojiB)
        }.png`
    );
}

interface QueueItem {
    urls: string[];
    filename: string; // Without the extension.
    resolve: () => void;
    reject: (reason?: any) => void;
}

let queue: QueueItem[] = [];

async function processQueue() {
    if (queue.length === 0) return;

    const {urls, filename, resolve, reject} = queue[0];

    const filePath = `${stickerPath}/${filename}.png`;
    if (fs.existsSync(filePath)) {
        resolve();
        queue.shift();
        processQueue();
        return;
    }

    try {
        // Try all URLs in parallel, return the first valid one
        const results = await Promise.all(urls.map(async (url) => {
            try {
                const response = await fetch(url);
                console.log(response);
                if (!response.ok) return null;
                const arrayBuffer = await response.arrayBuffer();
                return { buffer: Buffer.from(arrayBuffer), url };
            } catch {
                return null;
            }
        }));
        const valid = results.find(r => r !== null);
        if (!valid) throw new Error('No valid URL found');
        const { buffer } = valid;

        fs.mkdirSync(stickerPath, {recursive: true});
        fs.writeFileSync(filePath, buffer);
        resolve();
    } catch (error) {
        reject(error);
    } finally {
        queue.shift();
        processQueue();
    }
}

export function downloadEmojiPair(emojiA: string, emojiB: string): Promise<string> {
    const urls = getUrls(emojiA, emojiB);
    const filename = formatEmojiPair(emojiA, emojiB);
    return new Promise((resolve, reject) => {
        queue.push(<QueueItem>{urls, filename, resolve, reject});
        if (queue.length === 1) {
            processQueue();
        }
    });
}