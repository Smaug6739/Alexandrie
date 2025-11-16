import type MarkdownIt from 'markdown-it';
import container from 'markdown-it-container';
import type Token from 'markdown-it/lib/token.mjs';

interface BlockDef {
  name: string;
  allowTitle?: boolean;
}

const BLOCKS: BlockDef[] = [
  { name: 'frame', allowTitle: true },
  { name: 'card', allowTitle: true },
  { name: 'panel', allowTitle: true },
];

function parseModifiers(params: string) {
  const mods: Record<string, string | true> = {};

  // title="..."
  const titleMatch = params.match(/title="([^"]+)"/);
  if (titleMatch) mods.title = titleMatch[1] || '';

  // key=value
  const regex = /(\w+)=([^\s"]+)/g;
  let m;
  while ((m = regex.exec(params))) {
    const key = m[1];
    const val = m[2];
    if (key && key !== 'title') mods[key] = val || '';
  }

  // flags: rounded, shadow, bordered, nowrap, wrap... without value
  const flagRegex = /\b(rounded|shadow|bordered|nowrap|wrap)\b/g;
  let f;
  while ((f = flagRegex.exec(params))) {
    if (f[1]) mods[f[1]] = true;
  }

  return mods;
}

export function advancedBlocks(md: MarkdownIt) {
  for (const block of BLOCKS) {
    md.use(container, block.name, {
      render(tokens: Token[], idx: number) {
        const token = tokens[idx];
        const info = token?.info.trim() || '';
        const params = info.slice(block.name.length).trim();
        const mods = parseModifiers(params);

        // dynamic classes
        const classes = [`block`, block.name];
        for (const [key, val] of Object.entries(mods)) {
          if (key === 'title') continue;
          if (val === true) classes.push(key);
          else classes.push(`${key}-${val}`);
        }

        const classStr = classes.join(' ');

        // title (if allowed)
        const title = block.allowTitle && mods.title ? `<div class="block-title">${mods.title}</div>` : '';

        // opening
        if (token && token.nesting === 1) {
          return `<div class="${classStr}">${title}\n`;
        }

        // closing
        return `</div>\n`;
      },
    });
  }
}
