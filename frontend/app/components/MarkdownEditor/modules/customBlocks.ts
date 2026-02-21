import { ViewPlugin, Decoration, type DecorationSet, EditorView } from '@codemirror/view';
import { RangeSetBuilder } from '@codemirror/state';

const containerDelimiterPlugin = ViewPlugin.fromClass(
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
      const { doc } = view.state;

      for (let i = 1; i <= doc.lines; i++) {
        const line = doc.line(i);

        if (/^:::(\w+)?(?:\s+.*)?$/.test(line.text)) {
          builder.add(
            line.from,
            line.from,
            Decoration.line({
              class: 'cm-container-delimiter',
            }),
          );
        }
      }

      return builder.finish();
    }
  },
  {
    decorations: v => v.decorations,
  },
);

export function containerHighlight() {
  return [
    containerDelimiterPlugin,
    EditorView.baseTheme({
      '.cm-container-delimiter': {
        color: 'var(--red)',
        fontWeight: '600',
      },
    }),
  ];
}
