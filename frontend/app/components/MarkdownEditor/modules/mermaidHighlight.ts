import { EditorView } from '@codemirror/view';
import { MERMAID_OPEN_RE } from '~/helpers/markdown/mermaid';
import { diagramHighlightPlugin } from './diagramHighlight';

// Main diagram-type declarations plus the handful of structural keywords that show up
// across most diagram types. Intentionally not exhaustive (e.g. gantt/pie-specific
// keywords, ER crow's-foot notation) — cosmetic coloring only, kept simple on purpose.
const MERMAID_KEYWORD_RE =
  /\b(?:graph|flowchart|sequenceDiagram|classDiagram|stateDiagram(?:-v2)?|erDiagram|journey|gantt|pie|mindmap|timeline|gitGraph|subgraph|end|participant|class|state|note|loop|alt|else)\b/g;
const MERMAID_ARROW_RE = /-->|--x|--o|-\.->|==>|---|<-->/g;

export function mermaidBlockHighlight() {
  return [
    diagramHighlightPlugin(MERMAID_OPEN_RE, [
      { re: MERMAID_KEYWORD_RE, class: 'cm-mermaid-keyword' },
      { re: MERMAID_ARROW_RE, class: 'cm-mermaid-arrow' },
    ]),
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
