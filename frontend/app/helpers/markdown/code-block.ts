import type { MarkdownIt } from 'markdown-it';

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

/**
 * The code to copy for a given button.
 *
 * `data-code` is the fast path, but it is baked into `content_compiled` when the
 * document is saved, so a document stored before the attribute existed (or saved by a
 * path that dropped it) has an empty one. That is the "re-adding the block makes it
 * work again" symptom: the fresh block carries the attribute, the stored one does not.
 * Falling back to the rendered `<code>` text means the button works off whatever is
 * actually on screen.
 */
const codeFor = (btn: HTMLElement): string => {
  const fromAttr = btn.dataset.code;
  if (fromAttr) return fromAttr;
  return btn.closest('.code-block-wrapper')?.querySelector('pre code')?.textContent ?? '';
};

/** Copy `text`, returning whether it actually landed on the clipboard. */
const writeToClipboard = async (text: string): Promise<boolean> => {
  // navigator.clipboard is undefined outside a secure context — a self-hosted
  // instance reached over plain http:// on a LAN address, for instance. Reading
  // `.writeText` off it threw synchronously and aborted the handler before it could
  // give any feedback at all.
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Rejects when the document is not focused, or when permission is refused.
      // Fall through to the legacy path rather than failing outright.
    }
  }

  try {
    const staging = document.createElement('textarea');
    staging.value = text;
    staging.setAttribute('readonly', '');
    // Off-screen but still selectable; `display: none` would break execCommand.
    staging.style.cssText = 'position:fixed;top:-1000px;opacity:0;';
    document.body.appendChild(staging);
    staging.select();
    const ok = document.execCommand('copy');
    staging.remove();
    return ok;
  } catch {
    return false;
  }
};

// Registered at module scope, so it must be guarded for SSR: the markdown pipeline
// is imported on server-rendered pages (e.g. the public document reader) where
// `document` does not exist.
if (import.meta.client) {
  // Capture phase: a click handler on an ancestor of the code block that calls
  // stopPropagation would otherwise stop this from ever running, and the markdown is
  // rendered inside components that do bind their own click handlers.
  document.addEventListener(
    'click',
    e => {
      const btn = (e.target as HTMLElement)?.closest('.code-copy-btn') as HTMLButtonElement | null;
      if (!btn) return;

      // The whole body is guarded: an exception here used to leave the button with no
      // feedback, which reads to the user as "the copy button is broken".
      void (async () => {
        let ok: boolean;
        try {
          ok = await writeToClipboard(codeFor(btn));
        } catch {
          ok = false;
        }
        // Always say something. Silence is what made this look like a dead button.
        const state = ok ? 'copied' : 'copy-failed';
        btn.classList.add(state);
        setTimeout(() => btn.classList.remove(state), 800);
      })();
    },
    true,
  );
}
