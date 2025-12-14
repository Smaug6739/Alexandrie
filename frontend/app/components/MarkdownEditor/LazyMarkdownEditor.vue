<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="editor-wrapper">
    <div class="editor-container">
      <!-- Toolbar Section -->
      <Toolbar v-model="document" :minimal="minimal" @execute-action="commands.exec" />

      <!-- Compact Document Metadata -->
      <div v-if="!minimal" class="document-meta">
        <input v-model="document.name" placeholder="Document title" class="meta-title" @input="autoSaveConditional" />
        <span class="meta-separator">•</span>
        <input v-model="document.description" placeholder="Description" class="meta-description" @input="autoSaveConditional" />
        <span class="meta-separator">•</span>
        <AppTagInput v-model="document.tags" class="meta-tags" @update:model-value="autoSaveConditional" />
      </div>
      <AppTagInput v-else v-model="document.tags" style="margin: 4px 0" @update:model-value="autoSaveConditional" />

      <!-- Editor Content Section -->
      <div ref="container" class="editor-content">
        <div class="editor-panel" :class="{ 'with-preview': showPreview }">
          <div ref="editorContainer" class="codemirror-editor" />
        </div>

        <div v-if="showPreview" class="preview-panel">
          <div class="panel-header">
            <span class="panel-label">Preview</span>
          </div>
          <div ref="markdownPreview" :class="['markdown-preview', `${preferences.get('theme').value}-theme`]" v-html="document.content_compiled" />
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
  getView: () => editorView.value as EditorView | null,
  getDoc: () => document.value as Node,
  setDoc: d => (document.value = d),
  showPreview,
  save: () => save(),
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

.editor-wrapper {
  height: 100%;
  padding: 0;
}

.editor-container {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  gap: 8px;
}

// Compact Document Metadata - Single line
.document-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  flex-wrap: wrap;
}

.meta-title {
  flex: 0 1 auto;
  min-width: 120px;
  max-width: 280px;
  padding: 4px 8px;
  border: none;
  border-radius: 6px;
  background: transparent;
  font-size: 1rem;
  font-weight: 600;
  color: var(--font-color-dark);
  outline: none;
  transition: background 0.15s ease;

  &:hover,
  &:focus {
    background: var(--bg-ui);
  }

  &::placeholder {
    color: var(--font-color-light);
    font-weight: 500;
  }
}

.meta-description {
  flex: 1 1 150px;
  min-width: 100px;
  padding: 4px 8px;
  border: none;
  border-radius: 6px;
  background: transparent;
  font-size: 0.85rem;
  color: var(--font-color);
  outline: none;
  transition: background 0.15s ease;

  &:hover,
  &:focus {
    background: var(--bg-ui);
  }

  &::placeholder {
    color: var(--font-color-light);
    opacity: 0.7;
  }
}

.meta-separator {
  color: var(--border-color);
  font-size: 0.7rem;
  user-select: none;
}

.meta-tags {
  flex: 0 1 auto;
  min-width: 150px;
}

// Editor Content Section
.editor-content {
  display: flex;
  flex: 1;
  min-height: 0;
  gap: 8px;
}

.editor-panel,
.preview-panel {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  overflow: hidden;
}

.editor-panel.with-preview {
  max-width: 50%;
}

.panel-header {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  background: var(--bg-ui);
  border-bottom: 1px solid var(--border-color);
}

.panel-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--font-color-light);
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

.editor-container:deep(.cm-scroller) {
  padding: 8px 12px;
}

.editor-container:deep(.cm-content) {
  font-family: 'JetBrains Mono', monospace;
}

.markdown-preview {
  flex: 1;
  padding: 12px 16px;
  background: var(--bg-color);
  overflow: auto;
}

// Responsive
@media (max-width: 900px) {
  .editor-content {
    flex-direction: column;
  }

  .editor-panel.with-preview {
    max-width: 100%;
    max-height: 50%;
  }

  .preview-panel {
    max-height: 50%;
  }
}

@media (max-width: 600px) {
  .document-meta {
    flex-direction: column;
    align-items: stretch;
    gap: 4px;
    padding: 8px 10px;
  }

  .meta-separator {
    display: none;
  }

  .meta-title,
  .meta-description {
    max-width: 100%;
    width: 100%;
  }

  .meta-tags {
    width: 100%;
  }
}
</style>
