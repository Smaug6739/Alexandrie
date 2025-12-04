<!-- eslint-disable vue/no-v-html -->
<template>
  <div style="height: 100%">
    <div class="editor-container">
      <Toolbar v-model="document" :minimal="minimal" @execute-action="exec" />
      <div style="display: flex; min-height: 0; padding: 6px 0; flex: 1; flex-direction: column; gap: 8px">
        <input v-if="!minimal" v-model="document.name" placeholder="Title" class="title" @input="autoSaveConditional" />
        <input v-if="!minimal" v-model="document.description" placeholder="Description" class="description" @input="autoSaveConditional" />
        <AppTagInput v-model="document.tags" style="margin-bottom: 10px" @update:model-value="autoSaveConditional" />
        <div ref="container" class="markdown">
          <div ref="editorContainer" class="codemirror-editor" style="border-right: 1px solid var(--border-color)" />
          <div
            v-if="showPreview"
            ref="markdownPreview"
            :class="['markdown-preview', `${preferences.get('theme').value}-theme`]"
            style="position: relative"
            v-html="document.content_compiled"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EditorView, keymap, highlightSpecialChars, drawSelection, lineNumbers, type KeyBinding } from '@codemirror/view';
import { EditorState, Compartment } from '@codemirror/state';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import { autocompletion, completionKeymap, snippet, type CompletionContext } from '@codemirror/autocomplete';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { loadTheme } from './themes';
import { katexSnippets } from './katex-snippets';
import Toolbar from './Toolbar.vue';
import ImageSelectorModal from './ImageSelectorModal.vue';
import GridOrganizationModal from './GridOrganizationModal.vue';
import ColorPickerModal from './ColorPickerModal.vue';

import compile from '~/helpers/markdown';
import type { Node } from '~/stores';
import { useModal, Modal } from '~/composables/ModalBus';

const resourcesStore = useRessourcesStore();
const preferences = usePreferences();

const props = defineProps<{ doc?: Partial<Node>; minimal?: boolean }>();
const emit = defineEmits(['save', 'exit', 'autoSave']);
const { CDN } = useApi();

const editorContainer = ref<HTMLDivElement>();
const markdownPreview = ref<HTMLDivElement>();
const editorView = ref<EditorView | null>(null);
const showPreview = ref(false);

const document = ref<Partial<Node>>({
  ...props.doc,
  content_compiled: compile(props.doc?.content || ''),
});

// ... [FONCTIONS EXEC, MODALS, ETC. INCHANGÉES] ...
// Je ne répète pas le bloc exec/insertText/Modals pour gagner de la place,
// gardez exactement ce que vous aviez.

function exec(action: string, payload?: string) {
  if (action === 'preview') return (showPreview.value = !showPreview.value);
  if (action === 'openColorPicker') return openColorModal();
  if (action === 'save') return save();
  if (action === 'goto') if (document.value.id) return useRouter().push(`/dashboard/docs/${document.value.id}`);
  if (action === 'image') return openImageSelector();
  if (action === 'gridOrganization') return openGridOrganization();
  if (action === 'insertText') return insertText(payload || '');

  if (!editorView.value) return;

  const view = editorView.value;
  const state = view.state;

  const { from, to } = state.selection.main;
  const selectedText = state.sliceDoc(from, to);

  let changes;
  let select_from = from + 2;
  let select_to = to + 2;

  switch (action) {
    case 'bold':
      changes = { from, to, insert: `**${selectedText}**` };
      break;
    case 'italic':
      changes = { from, to, insert: `*${selectedText}*` };
      select_from = from + 1;
      select_to = select_from + selectedText.length;
      break;
    case 'underline':
      changes = { from, to, insert: `__${selectedText}__` };
      break;
    case 'strike':
      changes = { from, to, insert: `~~${selectedText}~~` };
      break;
    case 'link':
      changes = { from, to, insert: `[](${selectedText})` };
      select_from = from + 3;
      select_to = select_from;
      break;
    case 'code':
      changes = { from, to, insert: `\`${selectedText}\`` };
      break;
    case 'quote':
      changes = { from, to, insert: `> ${selectedText}\n` };
      break;
    case 'list':
      changes = { from, to, insert: `- ${selectedText}\n` };
      break;
    case 'orderedList':
      changes = { from, to, insert: `1. ${selectedText}\n` };
      break;
    case 'color': {
      const color = String(payload || '').trim();
      if (!color) return;
      const insert = `{color:${color}}(${selectedText})`;
      changes = { from, to, insert };
      select_from = insert.indexOf('(') + 1 + from;
      select_to = select_from + selectedText.length;
      break;
    }
  }

  view.dispatch({
    changes,
    selection: { anchor: select_from, head: select_to },
  });

  view.focus();
}

function insertText(text: string) {
  if (!editorView.value || !text) return;

  const view = editorView.value;
  const state = view.state;
  const { from, to } = state.selection.main;

  view.dispatch({
    changes: { from, to, insert: text },
    selection: { anchor: from + text.length, head: from + text.length },
  });

  view.focus();
}

function openColorModal() {
  const modalManager = useModal();
  modalManager.add(new Modal(shallowRef(ColorPickerModal), { props: { onColorSelect: handleColorSelect } }));
}

function handleColorSelect(color: string) {
  exec('color', color);
}

function openImageSelector() {
  const modalManager = useModal();
  modalManager.add(new Modal(shallowRef(ImageSelectorModal), { props: { onImageSelect: handleImageSelect }, size: 'large' }));
}

function openGridOrganization() {
  const modalManager = useModal();
  modalManager.add(new Modal(shallowRef(GridOrganizationModal), { props: { onGridSelect: handleGridSelect } }));
}

function handleImageSelect(imageUrl: string, altText: string) {
  if (!editorView.value) return;

  const view = editorView.value;
  const state = view.state;
  const { from, to } = state.selection.main;
  const selectedText = state.sliceDoc(from, to);

  const alt = selectedText || altText;
  const insert = `![${alt}](${imageUrl})`;

  view.dispatch({
    changes: { from, to, insert },
    selection: { anchor: from + insert.length, head: from + insert.length },
  });

  view.focus();
}

function handleGridSelect(gridMarkdown: string) {
  if (!editorView.value) return;

  const view = editorView.value;
  const state = view.state;
  const { from, to } = state.selection.main;

  view.dispatch({
    changes: { from, to, insert: gridMarkdown },
    selection: { anchor: from + gridMarkdown.length, head: from + gridMarkdown.length },
  });

  view.focus();
}

const fileUploadHandler = EditorView.domEventHandlers({
  paste: event => {
    const items = event.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (!file) return;
        const body = new FormData();
        body.append('file', file);
        resourcesStore.post(body).then((result: Node) => {
          const url = `${CDN}/${(result as Node).user_id}/${(result as Node).content_compiled}`;
          exec('insertText', `![${file.name}](${url})\n`);
        });
      }
    }
  },
  drop: event => {
    const items = event.dataTransfer?.items;
    if (!items) return;
    for (const item of items) {
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (!file) return;
        const body = new FormData();
        body.append('file', file);
        resourcesStore.post(body).then((result: Node) => {
          const url = `${CDN}/${(result as Node).user_id}/${(result as Node).content_compiled}`;
          exec('insertText', `![${file.name}](${url})\n`);
        });
      }
    }
  },
});

const markdownKeysmap: readonly KeyBinding[] = [
  {
    key: 'Mod-b',
    run: () => {
      exec('bold');
      return true;
    },
  },
  {
    key: 'Mod-i',
    run: () => {
      exec('italic');
      return true;
    },
  },
  {
    key: 'Mod-u',
    run: () => {
      exec('underline');
      return true;
    },
  },
  {
    key: 'Mod-e',
    run: () => {
      exec('image');
      return true;
    },
  },
  {
    key: 'Mod-l',
    run: () => {
      exec('link');
      return true;
    },
  },
];

const themeCompartment = new Compartment();

const updateListener = EditorView.updateListener.of(v => {
  if (v.docChanged) {
    updateDocumentContent();
    autoSaveConditional();
  }
});

function snippetSource(context: CompletionContext) {
  const snippets = preferences.get('snippets').value;

  const word = context.matchBefore(/[\w!:]+/);

  if (!word && !context.explicit) return null;
  return {
    from: word ? word.from : context.pos,
    // MODIFICATION CLÉ: Remplacer snippetCompletion() par un objet Completion littéral
    // avec 'apply: snippet(s.label)'

    options: [...snippets, ...katexSnippets].map(s => ({
      label: s.label, // Le déclencheur qui apparaît dans la liste (ex: !yellow)
      detail: 'Snippet',
      type: 'snippet',
      // On utilise 'snippet' pour créer explicitement la fonction d'application
      // qui va analyser et gérer le curseur pour $0, $1, etc.
      apply: snippet(s.label),
    })),
  };
}

const state = EditorState.create({
  doc: document.value.content || '',
  extensions: [
    lineNumbers(),
    highlightSpecialChars(),
    history(),
    drawSelection(),
    autocompletion(),
    keymap.of([...completionKeymap, ...defaultKeymap, ...historyKeymap, indentWithTab, ...searchKeymap, ...markdownKeysmap]),
    markdown({ base: markdownLanguage }),
    markdownLanguage.data.of({
      autocomplete: snippetSource,
    }),
    updateListener,
    fileUploadHandler,
    themeCompartment.of(loadTheme()),
    highlightSelectionMatches({}),
    EditorView.lineWrapping,
    EditorState.allowMultipleSelections.of(true),
    EditorView.contentAttributes.of({
      spellcheck: preferences.get('editorSpellCheck').value ? 'true' : 'false',
      autocorrect: 'on',
      autocapitalize: 'on',
    }),
  ],
});

onMounted(() => {
  if (!editorContainer.value) return;
  editorView.value = new EditorView({
    state,
    parent: editorContainer.value,
  });
  editorView.value.scrollDOM.addEventListener('scroll', syncScroll);
  window.addEventListener('keydown', handleGlobalKeys);
});

// ... [REST OF COMPONENT INCHANGED] ...
onBeforeUnmount(() => {
  if (preferences.get('documentAutoSave').value) {
    updateDocumentContent();
    emit('autoSave', document.value);
  }
  if (editorView.value) editorView.value.destroy();
  editorView.value?.scrollDOM.removeEventListener('scroll', syncScroll);
  window.removeEventListener('keydown', handleGlobalKeys);
});

function handleGlobalKeys(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    save();
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
    e.preventDefault();
    showPreview.value = !showPreview.value;
  }
  if (e.key === 'Escape') {
    emit('exit');
  }
}

function syncScroll() {
  if (!editorView.value?.scrollDOM || !markdownPreview.value) return;
  const scrollPercentage = editorView.value.scrollDOM.scrollTop / (editorView.value.scrollDOM.scrollHeight - editorView.value.scrollDOM.clientHeight);
  markdownPreview.value.scrollTop = scrollPercentage * (markdownPreview.value.scrollHeight - markdownPreview.value.clientHeight);
}

function autoSaveConditional() {
  if (preferences.get('documentAutoSave').value) {
    autoSave();
  }
}

const updateDocumentContent = debounce(() => {
  const content = editorView.value?.state.doc.toString() || '';
  document.value.content = content;
  document.value.content_compiled = compile(content);
}, 100);

const save = debounce(() => {
  updateDocumentContent();
  emit('save', document.value);
}, 1000);

const autoSave = debounceDelayed(() => {
  updateDocumentContent();
  emit('autoSave', document.value);
}, 2000);
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap');
.markdown {
  display: flex;
  min-height: 0;
  flex: 1;
  gap: 8px;
}
.editor-container {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
}
.codemirror-editor {
  flex: 1;
  overflow: auto;
}
.editor-container:deep(.cm-editor) {
  height: 100%;
}
.editor-container:deep(.cm-selectionBackground) {
  background-color: var(--selection-color) !important;
}
.markdown-preview {
  height: 100%;
  padding: 1rem;
  background: var(--bg-color);
  flex: 1;
  overflow: auto;
}
input {
  border: none;
  outline: none;
}
.title {
  padding: 6px 10px;
  font-size: 1.5rem;
  font-weight: 600;
}
.description {
  padding: 4px 10px;
  font-size: 1.1rem;
  font-weight: 500;
}
</style>
