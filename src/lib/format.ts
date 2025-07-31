/**
 * @file format.ts
 * @description Contains functions to format emojis into a specific string representation.
 */

/**
 * Converts an emoji to a string format where each code point is represented as `uXXXX` and joined by hyphen-minus.
 * @param {string} emoji The emoji to convert.
 * @param {boolean} [includeU=true] Whether to include the 'u' prefix in the code point representation.
 * @returns {string} The formatted string with code points.
 */
export function emojiToCodepointString(emoji: string, includeU: boolean = true): string {
    const codepoints = [];
    // for...of loop to handle each code point in the emoji (rather than each character).
    for (const char of emoji) {
        // Get the hexadecimal value of the code point.
        const codepoint = (char.codePointAt(0) as number) // The string has at least one character, so type as number.
            .toString(16);
        codepoints.push(`${includeU ? 'u' : ''}${codepoint}`);
    }
    // Join the parts of a single emoji with a hyphen-minus.
    return codepoints.join('-');
}

/**
 * Formats a pair of emojis into a string where two emojis are joined by an underscore, with their code points joined by
 * a hyphen-minus.
 * @param {string} emojiA The first emoji.
 * @param {string} emojiB The second emoji.
 * @returns {string} The formatted string.
 */
export function formatEmojiPair(emojiA: string, emojiB: string): string {
    const stringA = emojiToCodepointString(emojiA);
    const stringB = emojiToCodepointString(emojiB);

    let codepoints = [stringA, stringB];

    // Join the two emoji strings with an underscore.
    return codepoints.join('_');
}

export function codepointStringToEmoji(codepointString: string): string {
    // Split the code point string by hyphen-minus and convert each part back to a character.
    return codepointString.split('-').map(cp => String.fromCodePoint(parseInt(cp.replace('u', ''), 16))).join('');
}

export function formattedPairToEmojis(formattedPair: string): [string, string] {
    // Split the formatted pair by underscore and convert each part back to an emoji.
    const [emojiA, emojiB] = formattedPair.split('_');
    return [codepointStringToEmoji(emojiA), codepointStringToEmoji(emojiB)];
}