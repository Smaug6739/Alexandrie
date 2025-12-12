<!-- eslint-disable vue/no-v-html -->
<template>
  <div style="height: 100%">
    <div class="editor-container">
      <Toolbar v-model="document" :minimal="minimal" @execute-action="commands.exec" />
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
import { EditorView } from '@codemirror/view';
import { loadTheme } from './themes';
import { createEditorState } from './modules/editorState';
import { createKeymaps } from './modules/editorKeymaps';
import { createUploadsHandlers } from './modules/editorUploads';
import { createSnippetSource } from './modules/editorUtils';
import { createCommands } from './modules/editorCommands';
import Toolbar from './Toolbar.vue';

import compile from '~/helpers/markdown';
import type { Node } from '~/stores';

/* Modals */
import ImageSelectorModal from './ImageSelectorModal.vue';
import GridOrganizationModal from './GridOrganizationModal.vue';
import ColorPickerModal from './ColorPickerModal.vue';

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

const commands = createCommands({
  getView: () => editorView.value,
  getDoc: () => document.value,
  setDoc: d => (document.value = d),
  showPreview,
  save: () => save(),
  modals: {
    ImageSelectorModal,
    GridOrganizationModal,
    ColorPickerModal,
  },
});

const uploadsHandlers = createUploadsHandlers({ resourcesStore, CDN, insertText: (t: string) => commands.exec('insertText', t) });

const state = createEditorState({
  initialDoc: document.value.content || '',
  preferences,
  themeExtension: loadTheme(),
  keymaps: createKeymaps(commands),
  snippetSource: createSnippetSource(preferences),
  onDocChanged: () => {
    updateDocumentContent();
    autoSaveConditional();
  },
  uploadsHandlers,
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
