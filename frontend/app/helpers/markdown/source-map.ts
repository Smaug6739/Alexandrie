import type MarkdownIt from 'markdown-it';
import type Token from 'markdown-it/lib/token.mjs';

/**
 * markdown-it plugin that injects `data-source-line` attributes on block-level
 * opening tags.  markdown-it already tracks source-map info (`token.map`) for
 * every block token – this plugin simply surfaces it into the rendered HTML so
 * the editor's scroll-sync logic can correlate source lines with preview DOM
 * elements.
 */
export function sourceMapPlugin(md: MarkdownIt) {
  const originalRenderToken = md.renderer.renderToken.bind(md.renderer);

  md.renderer.renderToken = function (tokens: Token[], idx: number, options) {
    const token = tokens[idx] as Token;
    // Only tag opening block elements that carry source-map info
    if (token.map && token.nesting === 1) {
      token.attrSet('data-source-line', String(token.map[0]));
    }
    return originalRenderToken(tokens, idx, options);
  };
}
