import { renderToString } from 'katex';
import type MarkdownIt from 'markdown-it';
import type { StateInline } from 'markdown-it/dist/index.cjs.js';

function markdownItKatexPlugin(md: MarkdownIt) {
  md.inline.ruler.after('escape', 'katex', (state: StateInline, silent: boolean) => {
    if (silent) return false;

    const startMathPos = state.pos;
    if (state.src.charCodeAt(startMathPos) !== 0x24 /* $ */) return false;

    // Check if it's display math ($$) or inline math ($)
    const isDisplay = state.src.charCodeAt(startMathPos + 1) === 0x24;
    const endMarker = isDisplay ? '$$' : '$';

    let found = false;
    let endMathPos = -1;
    const searchStart = startMathPos + (isDisplay ? 2 : 1);

    // Search for the end delimiter
    for (let i = searchStart; i < state.src.length; i++) {
      if (state.src.charCodeAt(i) === 0x24 /* $ */) {
        // If we have $$ at the end
        if (isDisplay && state.src.charCodeAt(i + 1) === 0x24 && state.src.charCodeAt(i - 1) !== 0x5c) {
          found = true;
          endMathPos = i;
          break;
        }
        // Si on a $ en fin
        if (!isDisplay && state.src.charCodeAt(i - 1) !== 0x5c) {
          found = true;
          endMathPos = i;
          break;
        }
      }
    }

    if (!found) return false;

    const token = state.push(isDisplay ? 'katex_display' : 'katex_inline', '', 0);
    token.markup = endMarker;
    token.content = state.src.slice(startMathPos + endMarker.length, endMathPos);

    state.pos = endMathPos + endMarker.length;
    return true;
  });

  // Inline math ($...$)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  md.renderer.rules.katex_inline = (tokens: any, idx: any) => {
    return mdToKatex(tokens[idx].content, false);
  };

  // Display math ($$...$$)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  md.renderer.rules.katex_display = (tokens: any, idx: any) => {
    return mdToKatex(tokens[idx].content, true);
  };
}

function mdToKatex(text: string, centered: boolean): string {
  const expressionWithoutDollar = text;
  const render = renderToString(expressionWithoutDollar, {
    throwOnError: false,
    displayMode: true,
    trust: true,
  });
  return `<span class="katex-container ${centered ? 'center' : ''}">${render}</span>`;
}
export { markdownItKatexPlugin };
