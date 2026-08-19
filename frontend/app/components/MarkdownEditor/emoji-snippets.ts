// @ts-expect-error no types provided
import emojiData from 'markdown-it-emoji/lib/data/full.mjs';

export const emojiSnippets = Object.entries(emojiData as Record<string, string>).map(([name, char]) => ({
  id: `:${name}:`,
  label: `:${name}: `,
  emoji: char,
}));
