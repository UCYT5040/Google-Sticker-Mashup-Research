/**
 * @file emojiThemes.ts
 * @description Constant & type definitions for emoji themes.
 */


export const emojiThemes = ['noto', 'twemoji', 'native'] as const;
export type EmojiTheme = typeof emojiThemes[number];