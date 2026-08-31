import type { MarkdownIt } from 'markdown-it';
import { registerRawBlockRule } from './raw-block';

export const PLANTUML_OPEN_RE = /^(:{3,}|`{3,})plantuml\s*$/;

/**
 * Emits a placeholder holding the diagram source, not a finished image. The target
 * URL depends on the reader's server preference, while compile() is a pure function
 * without store access -- and keeping the source in the persisted HTML means changing
 * the server (or switching to local rendering) re-renders existing documents without
 * recompiling them. See helpers/plantuml-render.ts for the client-side step.
 */
export function plantumlPlugin(md: MarkdownIt) {
  registerRawBlockRule(md, 'plantuml_block', PLANTUML_OPEN_RE, content => `<pre class="plantuml">${md.utils.escapeHtml(content)}</pre>\n`);
}
