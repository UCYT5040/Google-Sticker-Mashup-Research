export const emojiThemes = ['noto', 'twemoji', 'native'] as const;
export type EmojiTheme = typeof emojiThemes[number];