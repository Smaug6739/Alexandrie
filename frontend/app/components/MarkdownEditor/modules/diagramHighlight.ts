import { ViewPlugin, Decoration, type DecorationSet, type EditorView } from '@codemirror/view';
import { RangeSetBuilder, type Text } from '@codemirror/state';

export interface DiagramTokenPattern {
  re: RegExp;
  class: string;
}

interface Match {
  from: number;
  to: number;
  class: string;
}

/**
 * Locate the body lines of every diagram block, so highlighting stays inside them and
 * never colors prose that happens to contain a keyword. Mirrors the marker handling of
 * the markdown-it raw block rule: any marker length closes, and an unterminated block
 * runs to the end of the document.
 */
function findDiagramBodyLineRanges(doc: Text, openRe: RegExp): { startLine: number; endLine: number }[] {
  const ranges: { startLine: number; endLine: number }[] = [];
  let openLine: number | null = null;
  let currentMarkerChar: string | null = null;
  let currentMarkerLen: number = 0;

  for (let i = 1; i <= doc.lines; i++) {
    const text = doc.line(i).text;
    if (openLine === null) {
      const match = text.match(openRe);
      if (match) {
        openLine = i + 1;
        currentMarkerChar = match[1]!.charAt(0);
        currentMarkerLen = match[1]!.length;
      }
    } else {
      const trimmed = text.trim();
      if (trimmed.length >= currentMarkerLen && trimmed.split('').every(c => c === currentMarkerChar)) {
        if (i - 1 >= openLine) ranges.push({ startLine: openLine, endLine: i - 1 });
        openLine = null;
        currentMarkerChar = null;
        currentMarkerLen = 0;
      }
    }
  }
  if (openLine !== null && openLine <= doc.lines) ranges.push({ startLine: openLine, endLine: doc.lines });

  return ranges;
}

function collectMatches(out: Match[], lineFrom: number, text: string, re: RegExp, className: string) {
  re.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text))) {
    out.push({ from: lineFrom + match.index, to: lineFrom + match.index + match[0].length, class: className });
  }
}

/**
 * Build a view plugin that colors the given token patterns inside diagram blocks
 * opened by `openRe`. Shared by the Mermaid and PlantUML highlighters, which differ
 * only in their opening marker and token patterns.
 */
export function diagramHighlightPlugin(openRe: RegExp, patterns: DiagramTokenPattern[]) {
  return ViewPlugin.fromClass(
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
        // Matches from every pattern must be merged and sorted before insertion —
        // RangeSetBuilder requires ranges added in strictly increasing position order,
        // and an arrow can appear before a keyword (or vice versa) on the same line.
        const matches: Match[] = [];

        for (const { startLine, endLine } of findDiagramBodyLineRanges(view.state.doc, openRe)) {
          for (let n = startLine; n <= endLine; n++) {
            const line = view.state.doc.line(n);
            for (const pattern of patterns) {
              collectMatches(matches, line.from, line.text, pattern.re, pattern.class);
            }
          }
        }

        matches.sort((a, b) => a.from - b.from || a.to - b.to);

        let lastTo = -1;
        for (const m of matches) {
          // Overlapping matches (a keyword inside an arrow's span, say) would make the
          // builder throw, so the first match at a position wins.
          if (m.from < lastTo) continue;
          builder.add(m.from, m.to, Decoration.mark({ class: m.class }));
          lastTo = m.to;
        }

        return builder.finish();
      }
    },
    {
      decorations: v => v.decorations,
    },
  );
}
