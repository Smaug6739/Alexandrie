import { EditorView, keymap, highlightSpecialChars, drawSelection, lineNumbers, type KeyBinding } from '@codemirror/view';
import { EditorState, Compartment, type Extension } from '@codemirror/state';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import { autocompletion, closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { rainbowBrackets } from './bracketsRainbow';

export interface CreateEditorStateParams {
  initialDoc: string;
  spellCheck: Ref<boolean>;
  themeExtension: Extension;
  keymaps: readonly KeyBinding[];
  snippetSource: object;
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
      rainbowBrackets(),
      closeBrackets(),
      keymap.of([...params.keymaps, ...defaultKeymap, ...historyKeymap, indentWithTab, ...searchKeymap, ...closeBracketsKeymap]),
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
        spellcheck: params.spellCheck.value ? 'true' : 'false',
        autocorrect: 'on',
        autocapitalize: 'on',
      }),
    ],
  });
}
