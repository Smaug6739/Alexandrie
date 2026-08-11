import type { MarkdownIt } from 'markdown-it';

/**
 * This plugin adds a copy button to code blocks in the rendered markdown.
 */

const ICON_COPY = `<svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
const ICON_CHECK = `<svg class="check-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

export const copyCodePlugin = (md: MarkdownIt) => {
  const defaultFence = md.renderer.rules.fence;

  md.renderer.rules.fence = function (tokens, idx, options, env, self) {
    const original = defaultFence ? defaultFence(tokens, idx, options, env, self) : self.renderToken(tokens, idx, options);

    return `
<div class="code-block-wrapper">
  <button type="button" class="code-copy-btn" aria-label="Copy code" title="Copy code">
    <span class="btn-icon">${ICON_COPY}</span>
    <span class="btn-icon-success">${ICON_CHECK}</span>
  </button>
  ${original}
</div>`;
  };
};
