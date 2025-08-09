<template>
  <div style="height: 100%; padding: 4px">
    <div class="editor-container">
      <Toolbar :document="document" @execute-action="exec" :minimal="minimal" />
      <div style="padding: 6px; flex: 1; display: flex; flex-direction: column; min-height: 0; gap: 8px">
        <input placeholder="Title" class="title" v-model="document.name" v-if="!minimal" />
        <input placeholder="Description" class="description" v-model="document.description" v-if="!minimal" />
        <div class="markdown" ref="container">
          <div ref="editorContainer" class="codemirror-editor" style="border-right: 1px solid var(--border-color)" />
          <div v-if="showPreview" :class="['markdown-preview', `${usePreferences().get('theme')}-theme`]" ref="markdownPreview" style="position: relative" v-html="document.content_html"></div>
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

import compile from '~/helpers/markdown';
import type { Document } from '~/stores';

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

function exec(action: string) {
  if (action === 'preview') {
    showPreview.value = !showPreview.value;
    return;
  }
  if (action === 'save') {
    save();
    return;
  }
  if (action === 'goto') {
    if (document.value.id) useRouter().push(`/dashboard/docs/${document.value.id}`);
    return;
  }

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
    case 'image':
      changes = { from, to, insert: `![](${selectedText})` };
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
  }
  view.dispatch({
    changes,
    selection: { anchor: from + 2, head: to + 2 }, // ajuste sélection pour `**`
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
  '!m': '\$$0\$',
  '!property': ':::property $0\n\n:::',
  '!warning': ':::warning $0\n\n:::',
};
const snippetListener = EditorView.updateListener.of(update => {
  if (!update.docChanged || !editorView.value) return;

  const { state, transactions } = update;
  const lastTransaction = transactions[0];

  const changes = lastTransaction!.changes;

  // Ne gère que les insertions simples
  let insertedText = '';
  let hasInsertion = false;
  changes.iterChanges((fromA, toA, fromB, toB, inserted) => {
    if (inserted.length > 0) {
      insertedText = inserted.sliceString(0);
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
    // @ts-ignore
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
  flex: 1;
  display: flex;
  gap: 8px;
  min-height: 0; /* permet aux enfants flexibles de ne pas déborder */
}
.editor-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.codemirror-editor {
  flex: 1;
  overflow: auto;
}
.editor-container:deep(.cm-editor) {
  height: 100%;
}

.markdown-preview {
  flex: 1;
  overflow: auto;
  padding: 1rem;
  background: var(--bg-color);
  height: 100%;
}
input {
  outline: none;
  border: none;
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
}

.description {
  font-size: 1.1rem;
  font-weight: 600;
}
</style>
