import { EditorView, keymap, highlightSpecialChars, drawSelection, lineNumbers, type KeyBinding } from '@codemirror/view';
import { EditorState, Compartment } from '@codemirror/state';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import { autocompletion } from '@codemirror/autocomplete';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';

export interface CreateEditorStateParams {
  initialDoc: string;
  preferences: any;
  themeExtension: any;
  keymaps: readonly KeyBinding[];
  snippetSource: any;
  onDocChanged: () => void;
  uploadsHandlers: ReturnType<typeof EditorView.domEventHandlers>;
}

const themeCompartment = new Compartment();

export function createEditorState(params: CreateEditorStateParams) {
  const updateListener = EditorView.updateListener.of(v => {
    if (v.docChanged) params.onDocChanged();
  });

  return EditorState.create({
    doc: params.initialDoc,
    extensions: [
      lineNumbers(),
      highlightSpecialChars(),
      history(),
      drawSelection(),
      autocompletion(),
      keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab, ...searchKeymap, ...params.keymaps]),
      markdown({ base: markdownLanguage }),
      markdownLanguage.data.of({
        autocomplete: params.snippetSource,
      }),
      updateListener,
      params.uploadsHandlers,
      themeCompartment.of(params.themeExtension),
      highlightSelectionMatches({}),
      EditorView.lineWrapping,
      EditorState.allowMultipleSelections.of(true),
      EditorView.contentAttributes.of({
        spellcheck: params.preferences.get('editorSpellCheck').value ? 'true' : 'false',
        autocorrect: 'on',
        autocapitalize: 'on',
      }),
    ],
  });
}
