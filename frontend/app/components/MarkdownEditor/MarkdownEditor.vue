<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="editor-wrapper">
    <div class="editor-container">
      <!-- Toolbar Section -->
      <Toolbar v-model="document" :minimal="minimal" @execute-action="commands.exec" />

      <!-- Compact Document Metadata -->
      <div v-if="!minimal" class="document-meta">
        <input v-model="document.name" placeholder="Document title" class="meta-title" @input="autoSaveConditional" />
        <input v-model="document.description" placeholder="Description" class="meta-description" @input="autoSaveConditional" />
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

const resourcesStore = useResourcesStore();
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
  padding: 6px 12px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: var(--bg-color);
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.meta-title {
  min-width: 120px;
  max-width: 280px;
  padding: 4px 8px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  color: var(--font-color-dark);
  background: transparent;
  transition: background 0.15s ease;
  flex: 0 1 auto;
  outline: none;

  &:hover,
  &:focus {
    background: var(--bg-ui);
  }

  &::placeholder {
    font-weight: 500;
    color: var(--font-color-light);
  }
}

.meta-description {
  min-width: 100px;
  padding: 4px 8px;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  color: var(--font-color);
  background: transparent;
  transition: background 0.15s ease;
  flex: 1 1 150px;
  outline: none;

  &:hover,
  &:focus {
    background: var(--bg-ui);
  }

  &::placeholder {
    color: var(--font-color-light);
    opacity: 0.7;
  }
}

.meta-tags {
  min-width: 150px;
  flex: 0 1 auto;
}

// Editor Content Section
.editor-content {
  display: flex;
  min-height: 0;
  flex: 1;
  gap: 8px;
}

.editor-panel,
.preview-panel {
  position: relative;
  display: flex;
  min-width: 0;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: var(--bg-color);
  flex: 1;
  flex-direction: column;
  overflow: hidden;
}

.editor-panel.with-preview {
  max-width: 50%;
}

.panel-header {
  display: flex;
  padding: 6px 12px;
  background: var(--bg-ui);
  align-items: center;
  border-bottom: 1px solid var(--border-color);
}

.panel-label {
  font-size: 10px;
  font-weight: 600;
  color: var(--font-color-light);
  letter-spacing: 0.5px;
  text-transform: uppercase;
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
  padding: 12px 16px;
  background: var(--bg-color);
  flex: 1;
  overflow: auto;
}

// Responsive
@media (width <= 900px) {
  .editor-content {
    flex-direction: column;
  }

  .editor-panel.with-preview {
    max-width: 100%;
    max-height: 50%;
  }

  .meta-description {
    flex: 0;
  }

  .preview-panel {
    max-height: 50%;
  }
}

@media (width <= 600px) {
  .document-meta {
    padding: 8px 10px;
    align-items: stretch;
    flex-direction: column;
    gap: 4px;
  }

  .meta-title,
  .meta-description {
    width: 100%;
    max-width: 100%;
  }

  .meta-tags {
    width: 100%;
  }
}
</style>
