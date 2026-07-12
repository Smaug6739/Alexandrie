import { Decoration, EditorView, ViewPlugin, WidgetType, type DecorationSet, type ViewUpdate } from '@codemirror/view';
import type { Range } from '@codemirror/state';
import type { CompletionContext, CompletionResult } from '@codemirror/autocomplete';
import type { Node } from '~/stores';

// Internal links: #726782907684193440 is displayed as "#<document name>" in the editor
const INTERNAL_LINK_REGEX = /#(\d{15,20})(?!\d)/g;

export interface InternalLinkProvider {
  getName: (id: string) => string | undefined;
  getDocuments: () => Node[];
}

class InternalLinkWidget extends WidgetType {
  constructor(
    readonly id: string,
    readonly name: string,
  ) {
    super();
  }

  override eq(other: InternalLinkWidget) {
    return other.id === this.id && other.name === this.name;
  }

  toDOM() {
    const span = document.createElement('span');
    span.className = 'cm-internal-link';
    span.textContent = `#${this.name}`;
    span.title = `#${this.id}`;
    return span;
  }
}

function buildDecorations(view: EditorView, provider: InternalLinkProvider): DecorationSet {
  const decorations: Range<Decoration>[] = [];
  const { selection } = view.state;

  for (const { from, to } of view.visibleRanges) {
    const text = view.state.doc.sliceString(from, to);
    for (const match of text.matchAll(INTERNAL_LINK_REGEX)) {
      const start = from + match.index;
      const end = start + match[0].length;

      // Keep the raw id editable when the cursor/selection touches it
      if (selection.ranges.some(range => range.from <= end && range.to >= start)) continue;

      const id = match[1]!;
      const name = provider.getName(id);
      if (!name) continue; // Unknown document: leave the raw id visible

      decorations.push(Decoration.replace({ widget: new InternalLinkWidget(id, name) }).range(start, end));
    }
  }

  return Decoration.set(decorations);
}

export function createInternalLinks(provider: InternalLinkProvider) {
  const plugin = ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;

      constructor(view: EditorView) {
        this.decorations = buildDecorations(view, provider);
      }

      update(update: ViewUpdate) {
        if (update.docChanged || update.selectionSet || update.viewportChanged) {
          this.decorations = buildDecorations(update.view, provider);
        }
      }
    },
    {
      decorations: v => v.decorations,
    },
  );

  const theme = EditorView.baseTheme({
    '.cm-internal-link': {
      color: 'var(--primary)',
      background: 'var(--accent-bg)',
      borderRadius: '4px',
      padding: '0 4px',
    },
  });

  // Autocomplete source: type "#" to search and insert a document link
  const completionSource = (context: CompletionContext): CompletionResult | null => {
    const word = context.matchBefore(/#[^\s#]*/);
    if (!word) return null;

    const documents = provider.getDocuments();
    if (!documents.length) return null;

    return {
      from: word.from,
      options: documents.map(doc => ({
        label: `#${doc.name}`,
        type: 'reference',
        detail: 'Document',
        apply: `#${doc.id}`,
      })),
      validFor: /^#[^\s#]*$/,
    };
  };

  return { extension: [plugin, theme], completionSource };
}
