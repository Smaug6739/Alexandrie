import { EditorView } from '@codemirror/view';
import { PLANTUML_OPEN_RE } from '~/helpers/markdown/plantuml';
import { diagramHighlightPlugin } from './diagramHighlight';

// @start.../@end... directives, plus the structural keywords common to the diagram
// types people write most. Intentionally not exhaustive — cosmetic coloring only.
const PLANTUML_DIRECTIVE_RE = /@(?:start|end)[a-z]+\b/gi;
const PLANTUML_KEYWORD_RE =
  /\b(?:abstract|activate|actor|alt|as|boundary|class|component|control|database|deactivate|else|elseif|end|endif|entity|enum|folder|group|if|interface|loop|namespace|node|note|package|par|participant|queue|rectangle|ref|return|state|storage|then|title|together|usecase|while)\b/g;
// Arrows before keywords: `-->` overlaps nothing, but ordering keeps intent clear.
const PLANTUML_ARROW_RE = /<\|--|--\|>|<\.\.|\.\.>|-->|<--|\.\.|->|<-|--/g;

export function plantumlBlockHighlight() {
  return [
    diagramHighlightPlugin(PLANTUML_OPEN_RE, [
      { re: PLANTUML_DIRECTIVE_RE, class: 'cm-plantuml-directive' },
      { re: PLANTUML_ARROW_RE, class: 'cm-plantuml-arrow' },
      { re: PLANTUML_KEYWORD_RE, class: 'cm-plantuml-keyword' },
    ]),
    EditorView.baseTheme({
      '.cm-plantuml-directive': {
        color: 'var(--purple)',
        fontWeight: '600',
      },
      '.cm-plantuml-keyword': {
        color: 'var(--teal)',
        fontWeight: '600',
      },
      '.cm-plantuml-arrow': {
        color: 'var(--blue)',
      },
    }),
  ];
}
