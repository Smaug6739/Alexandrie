import type MarkdownIt from 'markdown-it';
import type { StateInline } from 'markdown-it/dist/index.cjs.js';

// Internal links: #726782907684193440 => link to the document, displayed as "#<document name>"
export const INTERNAL_LINK_REGEX = /#(\d{15,20})(?!\d)/g;

export interface InternalLinkEnv {
  resolveNode?: (id: string) => string | undefined;
}

export function internalLinkPlugin(md: MarkdownIt) {
  md.inline.ruler.after('emphasis', 'internal_link', (state: StateInline, silent: boolean) => {
    const start = state.pos;
    if (state.src.charCodeAt(start) !== 0x23 /* # */) return false;

    // Word boundary before the # (avoid matching inside entities or other syntaxes)
    const prev = start > 0 ? state.src[start - 1] : '';
    if (prev && /[\w#&]/.test(prev)) return false;

    let end = start + 1;
    while (end < state.posMax && state.src.charCodeAt(end) >= 0x30 && state.src.charCodeAt(end) <= 0x39) {
      end++;
    }

    const digits = end - start - 1;
    if (digits < 15 || digits > 20) return false;

    if (!silent) {
      const token = state.push('internal_link', '', 0);
      token.meta = { id: state.src.slice(start + 1, end) };
    }

    state.pos = end;
    return true;
  });

  md.renderer.rules.internal_link = (tokens, idx, options, env) => {
    const id: string = tokens[idx]?.meta?.id || '';
    const name = (env as InternalLinkEnv)?.resolveNode?.(id);
    const label = md.utils.escapeHtml(name ? `#${name}` : `#${id}`);
    return `<a href="/dashboard/docs/${id}" class="internal-link" data-internal-link="${id}">${label}</a>`;
  };
}
