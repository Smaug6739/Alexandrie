import type { MarkdownIt, MarkdownItOptions, Renderer, Token } from 'markdown-it';

export default function markdownItUnderline(md: MarkdownIt) {
  function renderEm(tokens: Token[], idx: number, opts: Required<MarkdownItOptions>, _: unknown, slf: Renderer) {
    const token = tokens[idx];
    if (token?.markup === '__') {
      token.tag = 'u';
    }
    return slf.renderToken(tokens, idx, opts);
  }

  md.renderer.rules.strong_open = renderEm;
  md.renderer.rules.strong_close = renderEm;
}
