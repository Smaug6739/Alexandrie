import { ViewPlugin, Decoration, type DecorationSet, EditorView } from '@codemirror/view';
import { RangeSetBuilder, type Text } from '@codemirror/state';
import { MERMAID_OPEN_RE, MERMAID_CLOSE_RE } from '~/helpers/markdown/mermaid';

// Main diagram-type declarations plus the handful of structural keywords that show up
// across most diagram types. Intentionally not exhaustive (e.g. gantt/pie-specific
// keywords, ER crow's-foot notation) — cosmetic coloring only, kept simple on purpose.
const MERMAID_KEYWORD_RE =
  /\b(?:graph|flowchart|sequenceDiagram|classDiagram|stateDiagram(?:-v2)?|erDiagram|journey|gantt|pie|mindmap|timeline|gitGraph|subgraph|end|participant|class|state|note|loop|alt|else)\b/g;
const MERMAID_ARROW_RE = /-->|--x|--o|-\.->|==>|---|<-->/g;

function findMermaidBodyLineRanges(doc: Text): { startLine: number; endLine: number }[] {
  const ranges: { startLine: number; endLine: number }[] = [];
  let openLine: number | null = null;

  for (let i = 1; i <= doc.lines; i++) {
    const text = doc.line(i).text;
    if (openLine === null) {
      if (MERMAID_OPEN_RE.test(text)) openLine = i + 1;
    } else if (MERMAID_CLOSE_RE.test(text)) {
      if (i - 1 >= openLine) ranges.push({ startLine: openLine, endLine: i - 1 });
      openLine = null;
    }
  }
  if (openLine !== null && openLine <= doc.lines) ranges.push({ startLine: openLine, endLine: doc.lines });

  return ranges;
}

const mermaidHighlightPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = this.build(view);
    }

    update(update: { docChanged: boolean; viewportChanged: boolean; view: EditorView }) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = this.build(update.view);
      }
    }

    build(view: EditorView) {
      const builder = new RangeSetBuilder<Decoration>();
      // Keyword and arrow matches must be merged and sorted before insertion —
      // RangeSetBuilder requires ranges added in strictly increasing position order,
      // and an arrow can appear before a keyword (or vice versa) on the same line.
      const matches: { from: number; to: number; class: string }[] = [];

      for (const { startLine, endLine } of findMermaidBodyLineRanges(view.state.doc)) {
        for (let n = startLine; n <= endLine; n++) {
          const line = view.state.doc.line(n);
          collectMatches(matches, line.from, line.text, MERMAID_KEYWORD_RE, 'cm-mermaid-keyword');
          collectMatches(matches, line.from, line.text, MERMAID_ARROW_RE, 'cm-mermaid-arrow');
        }
      }

      matches.sort((a, b) => a.from - b.from || a.to - b.to);
      for (const m of matches) {
        builder.add(m.from, m.to, Decoration.mark({ class: m.class }));
      }

      return builder.finish();
    }
  },
  {
    decorations: v => v.decorations,
  },
);

function collectMatches(out: { from: number; to: number; class: string }[], lineFrom: number, text: string, re: RegExp, className: string) {
  re.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text))) {
    out.push({ from: lineFrom + match.index, to: lineFrom + match.index + match[0].length, class: className });
  }
}

export function mermaidBlockHighlight() {
  return [
    mermaidHighlightPlugin,
    EditorView.baseTheme({
      '.cm-mermaid-keyword': {
        color: 'var(--teal)',
        fontWeight: '600',
      },
      '.cm-mermaid-arrow': {
        color: 'var(--blue)',
      },
    }),
  ];
}
