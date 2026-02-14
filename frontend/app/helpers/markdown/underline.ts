import type { Options } from 'markdown-it';
import type MarkdownIt from 'markdown-it';
import type Renderer from 'markdown-it/lib/renderer.mjs';
import type Token from 'markdown-it/lib/token.mjs';

export default function markdownItUnderline(md: MarkdownIt) {
  function renderEm(tokens: Token[], idx: number, opts: Options, _: unknown, slf: Renderer) {
    const token = tokens[idx];
    if (token?.markup === '__') {
      token.tag = 'u';
    }
    return slf.renderToken(tokens, idx, opts);
  }

  md.renderer.rules.strong_open = renderEm;
  md.renderer.rules.strong_close = renderEm;
}
