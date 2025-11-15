import type MarkdownIt from 'markdown-it';

/**
 * Markdown-it plugin to add a "copy to clipboard" button to code blocks.
 * @param md - The MarkdownIt instance
 */
export const copyCodePlugin = (md: MarkdownIt) => {
  // Sauvegarde du renderer par défaut des blocs <pre><code>
  const defaultFence = md.renderer.rules.fence;

  md.renderer.rules.fence = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    const rawCode = token?.content || '';

    // HTML original rendu par markdown-it
    const original = defaultFence ? defaultFence(tokens, idx, options, env, self) : self.renderToken(tokens, idx, options);

    // On enveloppe dans un container pour pouvoir placer le bouton
    return `
<div class="code-block-wrapper">
  <button class="code-copy-btn" data-code="${md.utils.escapeHtml(rawCode)}" aria-label="Copy code">
    ${COPY_ICON}
  </button>
  ${original}
</div>
    `;
  };
};

// Icon svg "copy"
const COPY_ICON = `<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px"><path d="M160-80q-33 0-56.5-23.5T80-160v-480q0-33 23.5-56.5T160-720h80v-80q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240h-80v80q0 33-23.5 56.5T640-80H160Zm160-240h480v-480H320v480Z"/></svg>`;

document.addEventListener('click', e => {
  const btn = (e.target as HTMLElement)?.closest('.code-copy-btn') as HTMLButtonElement | null;
  if (!btn) return;

  const code = btn.dataset.code ?? '';
  navigator.clipboard.writeText(code);

  btn.classList.add('copied');
  setTimeout(() => btn.classList.remove('copied'), 800);
});
