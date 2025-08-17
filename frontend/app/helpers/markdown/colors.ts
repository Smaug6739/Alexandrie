import type MarkdownIt from 'markdown-it';
import type { StateInline } from 'markdown-it/dist/index.cjs.js';
import type Token from 'markdown-it/lib/token.mjs';

export type ColorPluginOptions = {
  /** Also enable the bracket style: [text]{color=value} */
  enableBracketSyntax?: boolean;
  /** Allow hex colors like #f00 or #ff0000. Default true. */
  allowHex?: boolean;
  /**
   * If true, case-insensitive match for named colors (default true).
   */
  caseInsensitiveNames?: boolean;
};

const DEFAULTS: Required<Omit<ColorPluginOptions, 'allowedNamedColors'>> & {
  allowedNamedColors: string[] | null;
} = {
  enableBracketSyntax: false,
  allowHex: true,
  allowedNamedColors: null,
  caseInsensitiveNames: true,
};

const HEX_SHORT = /^#([0-9a-fA-F]{3})$/;
const HEX_LONG = /^#([0-9a-fA-F]{6})$/;

function isValidColor(value: string, opts: Required<ColorPluginOptions>): boolean {
  if (opts.allowHex && (HEX_SHORT.test(value) || HEX_LONG.test(value))) return true;
  return false;
}

function createSpanTokens(state: StateInline, color: string, content: string): Token[] {
  const open = state.push('span_open', 'span', 1);
  open.attrSet('style', `color:${color}`);

  const text = state.push('text', '', 0);
  text.content = content;

  const close = state.push('span_close', 'span', -1);
  return [open, text, close];
}

/** Try to parse {color:VALUE}(TEXT) starting at state.pos. */
function parseFunctionSyntax(state: StateInline, opts: Required<ColorPluginOptions>): boolean {
  const src = state.src;
  const start = state.pos;
  if (src.charCodeAt(start) !== 0x7b /* { */) return false;

  // Expecting "{color:" next
  const label = '{color:';
  if (src.substring(start, label.length) !== label) return false;

  // Find closing '}' for the color value
  const endBrace = src.indexOf('}', start + label.length);
  if (endBrace === -1) return false;
  let colorValue = src.slice(start + label.length, endBrace).trim();
  if (!colorValue) return false;

  if (!isValidColor(colorValue, opts)) colorValue = `var(--${colorValue})`; // Fallback to CSS variable if not valid

  // Next must be '(' then content then matching ')'
  if (src.charCodeAt(endBrace + 1) !== 0x28 /* ( */) return false;
  let depth = 1;
  let i = endBrace + 2;
  while (i < src.length && depth > 0) {
    const ch = src.charCodeAt(i);
    if (ch === 0x28) depth++; // (
    else if (ch === 0x29) depth--; // )
    i++;
  }
  if (depth !== 0) return false; // no matching ')'
  const endParen = i - 1; // position of matching ')'

  const inner = src.slice(endBrace + 2, endParen);

  state.pos = start; // reset so tokens are inserted at correct spot
  createSpanTokens(state, colorValue, inner);
  state.pos = endParen + 1; // advance cursor
  return true;
}

/** Try to parse [TEXT]{color=VALUE} starting at state.pos (on '['). */
function parseBracketSyntax(state: StateInline, opts: Required<ColorPluginOptions>): boolean {
  const src = state.src;
  const start = state.pos;
  if (src.charCodeAt(start) !== 0x5b /* [ */) return false;

  // Find matching ']' (no nesting for simplicity)
  const endBracket = src.indexOf(']', start + 1);
  if (endBracket === -1) return false;

  // Must be followed immediately by {color=...}
  const after = endBracket + 1;
  if (src.charCodeAt(after) !== 0x7b /* { */) return false;

  const specStart = after + 1;
  const specEnd = src.indexOf('}', specStart);
  if (specEnd === -1) return false;

  const spec = src.slice(specStart, specEnd).trim();
  const prefix = 'color=';
  if (!spec.startsWith(prefix)) return false;

  const colorValue = spec.slice(prefix.length).trim();
  if (!isValidColor(colorValue, opts)) return false;

  const inner = src.slice(start + 1, endBracket);

  state.pos = start;
  createSpanTokens(state, colorValue, inner);
  state.pos = specEnd + 1; // advance past closing '}'
  return true;
}

export default function colorPlugin(md: MarkdownIt, options?: ColorPluginOptions) {
  const opts: Required<ColorPluginOptions> = { ...DEFAULTS, ...options } as any;

  function colorRule(state: StateInline, silent: boolean): boolean {
    const ch = state.src.charCodeAt(state.pos);

    // Try function syntax first: {color:...}(...)
    if (ch === 0x7b /* { */) {
      const ok = parseFunctionSyntax(state, opts);
      if (ok) return true;
    }

    // Optionally try bracket syntax: [text]{color=...}
    if (opts.enableBracketSyntax && ch === 0x5b /* [ */) {
      const ok = parseBracketSyntax(state, opts);
      if (ok) return true;
    }

    return false;
  }

  md.inline.ruler.before('emphasis', 'color', colorRule);
}
