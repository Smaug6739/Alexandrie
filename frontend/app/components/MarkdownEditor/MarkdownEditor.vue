<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="editor-wrapper">
    <Teleport v-if="!public" to="#navbar-title"> {{ t('components.editor.title') }}</Teleport>

    <div class="editor-container">
      <!-- Toolbar Section -->

      <Toolbar v-model="document" :public="public" @execute-action="handleToolbarAction" />

      <!-- Compact Document Metadata -->
      <div class="document-meta">
        <div class="line">
          <input
            ref="titleInput"
            v-model="document.name"
            :autofocus="autofocusTitle"
            :placeholder="t('components.editor.placeholder.title')"
            class="meta-title"
            required
            @input="autoSaveConditional"
          />
          <input
            v-model="document.description"
            :placeholder="t('components.editor.placeholder.description')"
            class="meta-description"
            @input="autoSaveConditional"
          />
        </div>
        <AppTagInput v-model="document.tags" display="row" minimal @update:model-value="autoSaveConditional" />
      </div>

      <!-- Editor Content Section -->
      <div ref="container" class="editor-content">
        <div class="editor-panel" :class="{ 'with-preview': showPreview }">
          <div ref="editorContainer" class="codemirror-editor" :class="{ 'scroll-beyond-last-line': scrollBeyondLastLine }" />
        </div>

        <div v-if="showPreview" class="preview-panel">
          <div class="panel-header">
            <span class="panel-label">{{ t('common.actions.preview') }}</span>
          </div>
          <NodeDocumentContentCompiled ref="markdownPreviewComponent" :node="document" />
          <DrawioSidebar :diagrams="referencedDrawioResources" />
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
import { createInternalLinks } from './modules/internalLinks';
import { createCommands } from './modules/editorCommands';
import { createScrollSync } from './modules/scrollSync';
import compile from '~/helpers/markdown';
import Toolbar from './Toolbar.vue';
import DrawioSidebar from './DrawioSidebar.vue';
import NodeDocumentContentCompiled from '~/components/Node/Document/ContentCompiled.vue';

import type { Node } from '~/stores';

const { t } = useI18nT();
const resourcesStore = useResourcesStore();
const nodesStore = useNodesStore();
const preferences = usePreferencesStore();

const props = defineProps<{ public?: boolean; autofocusTitle?: boolean }>();
const emit = defineEmits<{
  (e: 'save' | 'autoSave', doc: Partial<Node>): void;
  (e: 'exit'): void;
}>();

const editorContainer = ref<HTMLDivElement>();
const titleInput = ref<HTMLInputElement>();
const markdownPreviewComponent = ref<InstanceType<typeof NodeDocumentContentCompiled>>();
const markdownPreview = computed(() => markdownPreviewComponent.value?.rootElement as HTMLElement | undefined);
const editorView = ref<EditorView | null>(null);
const showPreview = ref(false);

const autoSaveEnabled = preferences.get('documentAutoSave');
const scrollBeyondLastLine = preferences.get('editorScrollBeyondLastLine');

const scrollSync = createScrollSync({
  getView: () => editorView.value as EditorView | null,
  getPreview: () => markdownPreview.value,
});

const resolveNode = (id: string) => nodesStore.getById(id)?.name;

const document = defineModel<Partial<Node>>({ required: true });

const commands = createCommands({
  getView: () => editorView.value as EditorView | null,
  getDoc: () => document.value as Node,
  setDoc: d => (document.value = d),
  showPreview,
  save: () => save(),
});

const uploadsHandlers = createUploadsHandlers({
  resourcesStore,
  nodeId: document.value.id,
  insertText: (t: string) => commands.exec('insertText', t),
});

const referencedDrawioResources = computed(() => {
  const diagrams: Node[] = [];
  nodesStore.resources.forEach((resource: Node) => {
    if (resource.metadata?.drawio && resource.parent_id == document.value.id) diagrams.push(resource);
  });

  return diagrams;
});

const state = createEditorState({
  initialDoc: document.value.content || '',
  spellCheck: preferences.get('editorSpellCheck'),
  themeExtension: loadTheme(),
  keymaps: createKeymaps(commands),
  snippetSource: createSnippetSource(preferences.get('editorSnippetsEnabled'), preferences.get('snippets')),
  internalLinks: createInternalLinks({
    getName: id => nodesStore.getById(id)?.name,
    getDocuments: () => nodesStore.documents,
  }),
  onDocChanged: () => {
    updateDocumentContent();
    autoSaveConditional();
  },
  uploadsHandlers,
});

onMounted(() => {
  if (props.autofocusTitle) titleInput.value?.focus();
  if (!editorContainer.value) return;
  editorView.value = new EditorView({
    state,
    parent: editorContainer.value,
  });
  editorView.value.scrollDOM.addEventListener('scroll', scrollSync.syncEditorToPreview);
  window.addEventListener('keydown', handleGlobalKeys);
});

onBeforeUnmount(() => {
  if (autoSaveEnabled.value) {
    updateDocumentContent();
    emit('autoSave', document.value);
  }
  if (editorView.value) editorView.value.destroy();
  editorView.value?.scrollDOM.removeEventListener('scroll', scrollSync.syncEditorToPreview);
  scrollSync.dispose();
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

function handleToolbarAction(action: string, payload?: string) {
  commands.exec(action, payload);
}
// Re-sync scroll after the preview DOM updates (e.g. after typing new content)
watch(
  () => document.value.content_compiled,
  () => {
    nextTick(() => scrollSync.syncEditorToPreview());
  },
);

function autoSaveConditional() {
  if (autoSaveEnabled.value) {
    autoSave();
  }
}

const updateDocumentContent = debounce(() => {
  const content = editorView.value?.state.doc.toString() || '';
  document.value.content = content;
  document.value.content_compiled = compile(content, resolveNode);
}, 100);

const save = debounce(() => {
  if (!document.value.name?.trim()) {
    titleInput.value?.focus();
    titleInput.value?.reportValidity();
    return;
  }
  updateDocumentContent();
  emit('save', document.value);
}, 1000);

const autoSave = debounceDelayed(() => {
  // New documents persist locally before they have a title; existing documents
  // must never overwrite their saved title with an empty value.
  if (document.value.id && !document.value.name?.trim()) return;
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
  flex-direction: column;
  gap: 4px;
  width: 100%;
  height: 100%;
}

// Compact Document Metadata - Single line
.document-meta {
  .line {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

  gap: 8px;
  padding: 6px 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface-base);
}

.meta-title {
  flex: 0 1 auto;
  min-width: 120px;
  max-width: 280px;
  padding: 4px 8px;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  background: transparent;
  outline: none;
  transition: background $transition-fast ease;

  &:hover,
  &:focus {
    background: var(--surface-transparent);
  }

  &::placeholder {
    font-weight: 500;
    color: var(--text-secondary);
  }
}

.meta-description {
  flex: 1 1 150px;
  min-width: 100px;
  padding: 4px 8px;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  color: var(--text-body);
  background: transparent;
  outline: none;
  transition: background $transition-fast ease;

  &:hover,
  &:focus {
    background: var(--surface-transparent);
  }

  &::placeholder {
    color: var(--text-secondary);
    opacity: 0.7;
  }
}

// Editor Content Section
.editor-content {
  display: flex;
  flex: 1;
  gap: 8px;
  min-height: 0;
}

.editor-panel,
.preview-panel {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface-base);
  overflow: hidden;
}

.editor-panel.with-preview {
  max-width: 50%;
}

.panel-header {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  border-bottom: 1px solid var(--border);
  background: var(--surface-transparent);
}

.panel-label {
  font-size: 10px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
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

// Scroll past the end of the document (#653), so the line being typed need not sit at
// the bottom of the screen. Padding on .cm-content rather than a CodeMirror extension:
// the space has to be INSIDE the scrollable content for the scroller to reach it, and
// this way toggling the preference is a class change with no editor reconfiguration.
//
// vh rather than a line count: the useful amount is "most of a screen", which is what
// makes the last line reachable near the top, and it stays right when the font size or
// the window changes.
.codemirror-editor.scroll-beyond-last-line:deep(.cm-content) {
  padding-bottom: 60vh;
}

.markdown-preview {
  flex: 1;
  padding: 12px 16px;
  background: var(--surface-base);
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
    flex-direction: column;
    align-items: stretch;
    gap: 4px;
    padding: 8px 10px;
  }

  .meta-title,
  .meta-description {
    width: 100%;
    max-width: 100%;
  }
}
</style>
