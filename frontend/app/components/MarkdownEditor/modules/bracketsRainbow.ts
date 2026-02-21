import type { Range } from '@codemirror/state';
import { EditorView, Decoration, ViewPlugin } from '@codemirror/view';

function generateColors() {
  return ['blue', 'red', 'orange', 'yellow', 'green', 'teal', 'purple'];
}

const rainbowBracketsPlugin = ViewPlugin.fromClass(
  class {
    decorations;

    constructor(view: EditorView) {
      this.decorations = this.getBracketDecorations(view);
    }

    update(update: { docChanged: boolean; selectionSet: boolean; viewportChanged: boolean; view: EditorView }) {
      if (update.docChanged || update.selectionSet || update.viewportChanged) {
        this.decorations = this.getBracketDecorations(update.view);
      }
    }

    getBracketDecorations(view: EditorView) {
      const { doc } = view.state;
      const decorations = [] as Range<Decoration>[];
      const stack = [] as { type: string; from: number }[];
      const colors = generateColors();

      for (let pos = 0; pos < doc.length; pos += 1) {
        const char = doc.sliceString(pos, pos + 1);
        if (char === '(' || char === '[' || char === '{') {
          stack.push({ type: char, from: pos });
        } else if (char === ')' || char === ']' || char === '}') {
          const open = stack.pop();
          if (open && open.type === this.getMatchingBracket(char)) {
            const color = colors[stack.length % colors.length];
            decorations.push(
              Decoration.mark({ class: `rainbow-bracket-${color}` }).range(open.from, open.from + 1),
              Decoration.mark({ class: `rainbow-bracket-${color}` }).range(pos, pos + 1),
            );
          }
        }
      }

      decorations.sort((a, b) => a.from - b.from);

      return Decoration.set(decorations);
    }

    getMatchingBracket(closingBracket: string) {
      switch (closingBracket) {
        case ')':
          return '(';
        case ']':
          return '[';
        case '}':
          return '{';
        default:
          return null;
      }
    }
  },
  {
    decorations: v => v.decorations,
  },
);

export function rainbowBrackets() {
  return [
    rainbowBracketsPlugin,
    EditorView.baseTheme({
      '.rainbow-bracket-red': { color: 'var(--red)' },
      '.rainbow-bracket-red > span': { color: 'var(--red)' },
      '.rainbow-bracket-orange': { color: 'var(--orange)' },
      '.rainbow-bracket-orange > span': { color: 'var(--orange)' },
      '.rainbow-bracket-yellow': { color: 'var(--yellow)' },
      '.rainbow-bracket-yellow > span': { color: 'var(--yellow)' },
      '.rainbow-bracket-green': { color: 'var(--green)' },
      '.rainbow-bracket-green > span': { color: 'var(--green)' },
      '.rainbow-bracket-blue': { color: 'var(--blue)' },
      '.rainbow-bracket-blue > span': { color: 'var(--blue)' },
      '.rainbow-bracket-teal': { color: 'var(--teal)' },
      '.rainbow-bracket-teal > span': { color: 'var(--teal)' },
      '.rainbow-bracket-purple': { color: 'var(--purple)' },
      '.rainbow-bracket-purple > span': { color: 'var(--purple)' },
    }),
  ];
}
