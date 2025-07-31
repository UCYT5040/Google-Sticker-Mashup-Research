import {error, json} from '@sveltejs/kit';
import type {RequestHandler} from './$types';
import {formatEmojiPair} from '$lib/format';
import {downloadEmojiPair, stickerPath} from '$lib/download';
import fs from 'fs';

async function getSticker(emojiA: string, emojiB: string): Promise<Response> {
    const formattedPair = formatEmojiPair(emojiA, emojiB);
    const flippedFormattedPair = formatEmojiPair(emojiB, emojiA);

    console.log(`Fetching sticker for emojis: ${emojiA} and ${emojiB} (formatted as ${formattedPair})`);

    const filePath = `${stickerPath}/${formattedPair}.png`;
    const flippedFilePath = `${stickerPath}/${flippedFormattedPair}.png`;

    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath);
        const base64Data = data.toString('base64');
        return json({image: `data:image/png;base64,${base64Data}`});
    } else if (fs.existsSync(flippedFilePath)) {
        const data = fs.readFileSync(flippedFilePath);
        const base64Data = data.toString('base64');
        return json({image: `data:image/png;base64,${base64Data}`});
    } else {
        try {
            await Promise.all([downloadEmojiPair(emojiA, emojiB), downloadEmojiPair(emojiB, emojiA)]);
            return await getSticker(emojiA, emojiB);
        } catch (err) {
            console.error(`Error downloading sticker for ${emojiA} and ${emojiB}:`, err);
            throw error(503, `Failed to download sticker for ${emojiA} and ${emojiB}. Please try again later.`);
        }
    }
}

export const GET: RequestHandler = async ({url}) => {
    const emojiA = url.searchParams.get('emojiA');
    const emojiB = url.searchParams.get('emojiB');

    if (!emojiA || !emojiB) {
        throw error(400, 'Both emojiA and emojiB query parameters are required.');
    }

    return await getSticker(emojiA, emojiB);
};