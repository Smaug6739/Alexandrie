import type { MarkdownIt, StateInline } from 'markdown-it';

type CounterStyle = '1' | 'L' | 'R' | 'l' | 'r';

interface CounterEnv {
  counterLabels?: Record<string, number>;
}

const COUNTER_REGEX = /^\{\{\s*([A-Za-z][A-Za-z0-9_-]*)(?:\(([1LRlr])\))?\s*\}\}/;

function formatAlpha(value: number, uppercase: boolean): string {
  let result = '';
  let current = value;

  while (current > 0) {
    current--;
    result = String.fromCharCode((current % 26) + (uppercase ? 65 : 97)) + result;
    current = Math.floor(current / 26);
  }

  return result;
}

function formatRoman(value: number): string {
  const numerals: [number, string][] = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];
  let current = value;
  let result = '';

  for (const [amount, numeral] of numerals) {
    while (current >= amount) {
      result += numeral;
      current -= amount;
    }
  }

  return result;
}

function formatCounter(value: number, style: CounterStyle): string {
  if (style === 'L') return formatAlpha(value, true);
  if (style === 'l') return formatAlpha(value, false);
  if (style === 'R') return formatRoman(value);
  if (style === 'r') return formatRoman(value).toLowerCase();
  return String(value);
}

export function counterPlugin(md: MarkdownIt) {
  md.inline.ruler.before('emphasis', 'counter', (state: StateInline, silent: boolean) => {
    const start = state.pos;
    if (state.src.charCodeAt(start) !== 0x7b /* { */ || state.src.charCodeAt(start + 1) !== 0x7b) return false;

    const match = state.src.slice(start, state.posMax).match(COUNTER_REGEX);
    if (!match) return false;

    if (!silent) {
      const label = match[1]!;
      const style = (match[2] ?? '1') as CounterStyle;
      const env = state.env as CounterEnv;
      env.counterLabels ??= {};
      env.counterLabels[label] = (env.counterLabels[label] ?? 0) + 1;

      const token = state.push('counter', '', 0);
      token.content = formatCounter(env.counterLabels[label], style);
    }

    state.pos = start + match[0].length;
    return true;
  });

  md.renderer.rules.counter = (tokens, idx) => md.utils.escapeHtml(tokens[idx]?.content ?? '');
}
