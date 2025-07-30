/**
 * @file download.ts
 * @description Utilities to download emoji pairs from the Google Emoji Kitchen and save them to the file system.
 */


import {emojiToCodepointString, formatEmojiPair} from './format';
import fs from 'fs';

export const stickerPath = process.env.STICKER_PATH || 'stickers';

export function getUrl(emojiA: string, emojiB: string): string {
    return `https://www.gstatic.com/android/keyboard/emojikitchen/20220815/${
        emojiToCodepointString(emojiA)
    }/${
        formatEmojiPair(emojiA, emojiB)
    }.png`;
}

interface QueueItem {
    url: string;
    filename: string; // Without the extension.
    resolve: () => void;
    reject: (reason?: any) => void;
}

const failureExpiration = 1000 * 60 * 60 * 24; // 24 hours in milliseconds.

let queue: QueueItem[] = [];

async function processQueue() {
    if (queue.length === 0) return;

    const {url, resolve, reject} = queue[0];

    // Ensure filename.png does not exist and filename.txt does not exist, or contains a date greater than failureExpiration.
    const filename = queue[0].filename;
    const filePath = `${stickerPath}/${filename}.png`;
    const failureFilePath = `${stickerPath}/${filename}.txt`;
    const failureFileExists = fs.existsSync(failureFilePath);
    const failureFileDate = failureFileExists ? new Date(fs.statSync(failureFilePath).mtime) : null;
    const now = new Date();
    if (fs.existsSync(filePath) ||
        (failureFileExists && failureFileDate && (now.getTime() - failureFileDate.getTime() < failureExpiration))) {
        // If the file already exists or the failure file is too recent, resolve immediately.
        resolve();
        queue.shift(); // Remove the processed item from the queue.
        processQueue(); // Process the next item in the queue.
        return;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to download emoji pair: ${response.statusText}`);
        }
        if (!response.headers.get('content-type')?.startsWith('image/png')) {
            throw new Error(`Unexpected content type: ${response.headers.get('content-type')}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Ensure the sticker_path directory exists.
        fs.mkdirSync(stickerPath, {recursive: true});

        // Write the image to the file system.
        fs.writeFileSync(filePath, buffer);

        // Remove any existing failure file.
        if (fs.existsSync(failureFilePath)) {
            fs.unlinkSync(failureFilePath);
        }

        resolve();
    } catch (error) {
        // Write a failure file with the current date
        fs.writeFileSync(failureFilePath, new Date().toISOString());.
        reject(error);
    } finally {
        queue.shift(); // Remove the processed item from the queue.
        processQueue(); // Process the next item in the queue.
    }
}

export function downloadEmojiPair(emojiA: string, emojiB: string): Promise<string> {
    const url = getUrl(emojiA, emojiB);
    const filename = formatEmojiPair(emojiA, emojiB);
    return new Promise((resolve, reject) => {
        queue.push(<QueueItem>{url, filename, resolve, reject});
        if (queue.length === 1) {
            processQueue();
        }
    });
}