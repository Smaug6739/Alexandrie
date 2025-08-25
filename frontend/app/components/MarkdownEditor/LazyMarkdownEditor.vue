<template>
  <div style="height: 100%; padding: 4px">
    <div class="editor-container">
      <Toolbar v-model="document" :minimal="minimal" @execute-action="exec" />
      <div style="display: flex; min-height: 0; padding: 6px; flex: 1; flex-direction: column; gap: 8px">
        <input v-if="!minimal" v-model="document.name" placeholder="Title" class="title" />
        <input v-if="!minimal" v-model="document.description" placeholder="Description" class="description" />
        <AppTagInput v-model="document.tags" style="margin-bottom: 10px" />
        <div ref="container" class="markdown">
          <div ref="editorContainer" class="codemirror-editor" style="border-right: 1px solid var(--border-color)" />
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-if="showPreview" ref="markdownPreview" :class="['markdown-preview', `${usePreferences().get('theme')}-theme`]" style="position: relative" v-html="document.content_html" />
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
import { autocompletion } from '@codemirror/autocomplete';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { materialLight } from '@fsegurai/codemirror-theme-material-light';
import { materialDark } from '@fsegurai/codemirror-theme-material-dark';
import Toolbar from './Toolbar.vue';
import ImageSelectorModal from './ImageSelectorModal.vue';
import GridOrganizationModal from './GridOrganizationModal.vue';
import ColorPickerModal from './ColorPickerModal.vue';

import compile from '~/helpers/markdown';
import type { Document } from '~/stores';
import { useModal, Modal } from '~/composables/ModalBus';

const props = defineProps<{ doc?: Partial<Document>; minimal?: boolean }>();

const emit = defineEmits(['save', 'exit']);

const editorContainer = ref<HTMLDivElement>();
const markdownPreview = ref<HTMLDivElement>();
const editorView = ref<EditorView | null>(null);
const showPreview = ref(false);

const document = ref<Partial<Document>>({
  ...props.doc,
  content_html: compile(props.doc?.content_markdown || ''),
});

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

  switch (action) {
    case 'bold':
      changes = { from, to, insert: `**${selectedText}**` };
      break;
    case 'italic':
      changes = { from, to, insert: `*${selectedText}*` };
      break;
    case 'underline':
      changes = { from, to, insert: `__${selectedText}__` };
      break;
    case 'strike':
      changes = { from, to, insert: `~~${selectedText}~~` };
      break;
    case 'link':
      changes = { from, to, insert: `[](${selectedText})` };
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
      const value = selectedText || 'text';
      const insert = `{color:${color}}(${value})`;
      changes = { from, to, insert };
      break;
    }
  }
  view.dispatch({
    changes,
    selection: { anchor: from + 2, head: to + 2 },
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
  // Fermer tous les modals existants avant d'en ouvrir un nouveau
  while (modalManager.modals.value.length > 0) {
    modalManager.close(modalManager.modals.value[0]);
  }
  modalManager.add(new Modal(shallowRef(ColorPickerModal), { onColorSelect: handleColorSelect }, () => {}, true));
}

function handleColorSelect(color: string) {
  exec('color', color);
}

function openImageSelector() {
  const modalManager = useModal();
  console.log('Modals avant ouverture:', modalManager.modals.value.length);
  // Fermer tous les modals existants avant d'en ouvrir un nouveau
  while (modalManager.modals.value.length > 0) {
    modalManager.close(modalManager.modals.value[0]);
  }
  modalManager.add(new Modal(shallowRef(ImageSelectorModal), { onImageSelect: handleImageSelect }, () => {}, true));
  console.log('Modals après ouverture:', modalManager.modals.value.length);
}

function openGridOrganization() {
  const modalManager = useModal();
  // Fermer tous les modals existants avant d'en ouvrir un nouveau
  while (modalManager.modals.value.length > 0) {
    modalManager.close(modalManager.modals.value[0]);
  }
  modalManager.add(new Modal(shallowRef(GridOrganizationModal), { onGridSelect: handleGridSelect }, () => {}, true));
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
const snippets: Record<string, string> = {
  '!blue': ':::blue\n$0\n:::',
  '!green': ':::green\n$0\n:::',
  '!yellow': ':::yellow\n$0\n:::',
  '!grey': ':::grey\n$0\n:::',
  '!details': ':::details\n$0\n:::',
  '!center': ':::center\n$0\n:::',
  '!m': '$$0$',
  '!property': ':::property $0\n\n:::',
  '!warning': ':::warning $0\n\n:::',
};
const snippetListener = EditorView.updateListener.of(update => {
  if (!update.docChanged || !editorView.value) return;

  const { state, transactions } = update;
  const lastTransaction = transactions[0];

  const changes = lastTransaction!.changes;

  // Ne gère que les insertions simples
  let hasInsertion = false;
  changes.iterChanges((fromA, toA, fromB, toB, inserted) => {
    if (inserted.length > 0) {
      hasInsertion = true;
    }
  });
  if (!hasInsertion) return;

  // Vérifie si on vient d’insérer un mot-clé
  const cursorPos = state.selection.main.head;
  const line = state.doc.lineAt(cursorPos);
  const textBefore = line.text.slice(0, cursorPos - line.from);

  const match = Object.keys(snippets).find(key => textBefore.endsWith(key));
  if (!match) return;

  const start = cursorPos - match.length;
  const snippet = snippets[match];

  // remplace $0 par un curseur
  const [before, after] = snippet!.split('$0');
  const newText = (before || '') + after;

  const view = editorView.value;
  view.dispatch({
    changes: { from: start, to: cursorPos, insert: newText },
    selection: {
      anchor: start + (before?.length || 0),
    },
  });
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
    key: 'Mod-k',
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

watch(useColorMode(), mode => {
  if (!editorView.value) return;
  editorView.value.dispatch({
    effects: themeCompartment.reconfigure(mode.value === 'dark' ? materialDark : materialLight),
  });
});
const updateListener = EditorView.updateListener.of(v => {
  if (v.docChanged) {
    const content = v.state.doc.toString();
    document.value.content_markdown = content;
    document.value.content_html = compile(content);
  }
});
const state = EditorState.create({
  doc: document.value.content_markdown || '',
  extensions: [
    lineNumbers(),
    highlightSpecialChars(),
    history(),
    drawSelection(),
    autocompletion(),
    // @ts-expect-error types error
    keymap.of([...defaultKeymap, ...historyKeymap, ...searchKeymap, indentWithTab, ...markdownKeysmap]),
    markdown({ base: markdownLanguage }),
    updateListener,
    snippetListener,
    themeCompartment.of(useColorMode().value === 'dark' ? materialDark : materialLight),
    highlightSelectionMatches({}),
    EditorView.lineWrapping,
    EditorState.allowMultipleSelections.of(true),
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

onBeforeUnmount(() => {
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

function save() {
  const content = editorView.value?.state.doc.toString() || '';
  document.value.content_markdown = content;
  document.value.content_html = compile(content);
  emit('save', document.value);
}
</script>

<style scoped lang="scss">
.markdown {
  display: flex;
  min-height: 0; /* permet aux enfants flexibles de ne pas déborder */
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
/* stylelint-disable */
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


.image-selector-overlay {
  position: fixed;
  z-index: 99999;
  display: flex;
  background: rgb(0 0 0 / 45%);
  align-items: center;
  inset: 0;
  justify-content: center;
  padding: 20px;
}
</style>
