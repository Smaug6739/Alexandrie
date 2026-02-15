import { snippet, type CompletionContext } from '@codemirror/autocomplete';
import { katexSnippets } from '../katex-snippets';

function isInsideMath(context: CompletionContext): boolean {
  const doc = context.state.doc.toString();
  const pos = context.pos;
  const len = doc.length;
  const tokens: { pos: number; type: '$' | '$$' }[] = [];

  for (let i = 0; i < len; i++) {
    if (doc[i] !== '$') continue;
    let j = i - 1;
    let backslashes = 0;
    while (j >= 0 && doc[j] === '\\') {
      backslashes++;
      j--;
    }
    if (backslashes % 2 === 1) continue;

    if (i + 1 < len && doc[i + 1] === '$') {
      tokens.push({ pos: i, type: '$$' });
      i++;
    } else {
      tokens.push({ pos: i, type: '$' });
    }
  }

  const blockDollarPositions = tokens.filter(t => t.type === '$$').map(t => t.pos);
  const blockCountBefore = blockDollarPositions.filter(p => p < pos).length;
  if (blockCountBefore % 2 === 1) return true;

  const blockIntervals: Array<[number, number]> = [];
  for (let i = 0; i + 1 < blockDollarPositions.length; i += 2) {
    const start = blockDollarPositions[i] ?? 0;
    const end = (blockDollarPositions[i + 1] ?? 0) + 2;
    blockIntervals.push([start, end]);
  }

  const inBlock = (p: number) => blockIntervals.some(([s, e]) => p >= s && p < e);

  const singleDollarPositions = tokens.filter(t => t.type === '$' && !inBlock(t.pos)).map(t => t.pos);
  const singleCountBefore = singleDollarPositions.filter(p => p < pos).length;
  return singleCountBefore % 2 === 1;
}

export function createSnippetSource(preferences: ReturnType<typeof import('~/composables/usePreferences').usePreferences>) {
  return function snippetSource(context: CompletionContext) {
    if (!preferences.get('editorSnippetsEnabled').value) return null;
    const allSnippets = preferences.get('snippets').value;

    const inMath = isInsideMath(context);

    // Include backslash in the match when in math mode for KaTeX commands
    const word = inMath ? context.matchBefore(/\\?[\w!:*]+/) : context.matchBefore(/[\w!:]+/);
    if (!word && !context.explicit) return null;

    return {
      from: word ? word.from : context.pos,
      options: [
        ...allSnippets.map(s => ({
          label: s.id,
          detail: 'Snippet',
          type: 'snippet',
          apply: snippet(s.label),
        })),
        ...(inMath
          ? katexSnippets.map(s => ({
              label: s.id,
              detail: 'KaTeX',
              type: 'snippet',
              apply: snippet(s.label),
            }))
          : []),
      ],
    };
  };
}
