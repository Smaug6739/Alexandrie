import type MarkdownIt from 'markdown-it';
import type { StateInline } from 'markdown-it/dist/index.cjs.js';

/**
 * Tooltips — reuses the application's `.hint-tooltip` CSS (#618).
 *
 * Two syntaxes:
 *   [[hint text]]              → a small "i" marker; hovering it shows the hint
 *   [visible]{tooltip=hint}    → visible text (inline formatting supported)
 *                                with the hint shown on hover
 *
 * The hint itself is always plain text (escaped); the visible anchor of the
 * bracket form is tokenized so bold/italic/code keep working inside it.
 */

/** Try to parse [[hint text]] starting at state.pos (on the first '['). */
function parseMarkerSyntax(state: StateInline, silent: boolean): boolean {
  const src = state.src;
  const start = state.pos;

  if (src.charCodeAt(start) !== 0x5b /* [ */ || src.charCodeAt(start + 1) !== 0x5b) return false;

  const end = src.indexOf(']]', start + 2);
  if (end === -1) return false;

  const hint = src.slice(start + 2, end).trim();
  // An empty hint or one spanning lines is not a tooltip.
  if (!hint || hint.includes('\n')) return false;

  if (!silent) {
    const token = state.push('tooltip_marker', '', 0);
    token.meta = { hint };
  }

  state.pos = end + 2;
  return true;
}

/** Try to parse [visible]{tooltip=hint} starting at state.pos (on '['). */
function parseAnchorSyntax(state: StateInline, silent: boolean): boolean {
  const src = state.src;
  const start = state.pos;

  if (src.charCodeAt(start) !== 0x5b /* [ */) return false;

  // Find matching ']' (no nesting, same simplification as the color plugin)
  const endBracket = src.indexOf(']', start + 1);
  if (endBracket === -1 || endBracket === start + 1) return false;

  // Must be followed immediately by {tooltip=...}
  const after = endBracket + 1;
  if (src.charCodeAt(after) !== 0x7b /* { */) return false;

  const specEnd = src.indexOf('}', after + 1);
  if (specEnd === -1) return false;

  const spec = src.slice(after + 1, specEnd).trim();
  const prefix = 'tooltip=';
  if (!spec.startsWith(prefix)) return false;

  const hint = spec.slice(prefix.length).trim();
  if (!hint) return false;

  if (!silent) {
    const open = state.push('tooltip_open', 'span', 1);
    open.attrSet('class', 'md-tooltip md-tooltip-text');
    open.attrSet('tabindex', '0');

    // Tokenize the visible anchor so inline formatting keeps working.
    const oldPos = state.pos;
    const oldMax = state.posMax;
    state.pos = start + 1;
    state.posMax = endBracket;
    state.md.inline.tokenize(state);
    state.pos = oldPos;
    state.posMax = oldMax;

    const hintToken = state.push('tooltip_hint', '', 0);
    hintToken.meta = { hint };

    state.push('tooltip_close', 'span', -1);
  }

  state.pos = specEnd + 1;
  return true;
}

export function tooltipPlugin(md: MarkdownIt) {
  md.inline.ruler.before('emphasis', 'tooltip', (state: StateInline, silent: boolean) => {
    if (state.src.charCodeAt(state.pos) !== 0x5b /* [ */) return false;
    // [[hint]] first — it also starts with '[' and would otherwise be
    // half-consumed by the anchor parser.
    if (parseMarkerSyntax(state, silent)) return true;
    return parseAnchorSyntax(state, silent);
  });

  md.renderer.rules.tooltip_marker = (tokens, idx) => {
    const hint: string = tokens[idx]?.meta?.hint || '';
    return (
      `<span class="md-tooltip md-tooltip-marker" tabindex="0">` +
      `<span class="md-tooltip-icon">i</span>` +
      `<span class="hint-tooltip">${md.utils.escapeHtml(hint)}</span>` +
      `</span>`
    );
  };

  md.renderer.rules.tooltip_hint = (tokens, idx) => {
    const hint: string = tokens[idx]?.meta?.hint || '';
    return `<span class="hint-tooltip">${md.utils.escapeHtml(hint)}</span>`;
  };
}
