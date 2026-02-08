<template>
  <div class="snippets-page">
    <!-- Header -->
    <header class="page-header">
      <div class="header-content">
        <h2 class="page-title">Snippets</h2>
        <p class="page-subtitle">
          Manage markdown shortcuts. Type <code>!shortcut</code> in the editor to expand.
          <span class="count">{{ allSnippets.length }} snippets</span>
        </p>
      </div>
    </header>

    <!-- Toolbar -->
    <div class="toolbar">
      <div class="dropdown-container">
        <AppButton type="secondary" @click="showImportMenu = !showImportMenu"><Icon name="import" /> Import</AppButton>
        <Transition name="fade">
          <div v-if="showImportMenu" class="dropdown-menu">
            <button @click="triggerImport('json')"><Icon name="backup" /> JSON file</button>
            <button @click="triggerImport('dict')"><Icon name="import" /> Text dictionary</button>
          </div>
        </Transition>
        <div v-if="showImportMenu" class="dropdown-backdrop" @click="showImportMenu = false" />
      </div>
      <AppButton type="secondary" @click="exportJSON"><Icon name="backup" /> Export</AppButton>
      <AppButton type="secondary" @click="openRestoreModal"><Icon name="refresh" />Restore</AppButton>
      <AppButton type="primary" @click="openModal('create')"><Icon name="plus" />New</AppButton>
    </div>

    <!-- Data Table -->
    <DataTable v-if="allSnippets.length > 0" :headers="headers" :rows="rows">
      <template #bulk-actions="{ selected }">
        <div class="bulk-actions">
          <span class="selected-count">{{ selected.length }}</span>
          <span class="separator"></span>
          <span class="action-btn" @click="bulkDelete(selected)"><Icon name="delete" fill="var(--text-secondary)" /></span>
        </div>
      </template>
      <template #action="{ cell }">
        <span class="action-btn" @click="openModal('edit', cell?.data as Snippet)"><Icon name="edit" /></span>
        <span class="action-btn" @click="duplicateSnippet(cell?.data as Snippet)"><Icon name="copy" /></span>
        <span class="action-btn" @click="handleDelete((cell?.data as Snippet).id)"><Icon name="delete" /></span>
      </template>
    </DataTable>

    <!-- Empty State -->
    <NoContent v-else title="No snippets yet">
      <AppButton type="primary" @click="openModal('create')"><Icon name="plus" /> Create Snippet</AppButton>
    </NoContent>

    <!-- Hidden file inputs -->
    <input ref="jsonInput" type="file" accept=".json" style="display: none" @change="handleJSONImport" />
    <input ref="dictInput" type="file" accept=".txt,.dic,.csv" style="display: none" @change="handleDictImport" />
  </div>
</template>

<script setup lang="ts">
import type { Snippet } from '~/composables/useSnippets';
import type { Field } from '~/components/DataTable.vue';
import SnippetModal from './_modals/SnippetModal.vue';
import { Modal } from '~/composables/useModal';
import RestoreModal from './_modals/Restore.vue';

const { allSnippets, add, remove, update, exportJSON, importJSON, importDictionary, isDuplicate } = useSnippets();

const notifications = useNotifications();
const modalManager = useModal();

// Table config
const headers = [
  { label: 'Shortcut', key: 'shortcut' },
  { label: 'Content', key: 'content' },
  { label: 'Actions', key: 'action', align: 'right' as const },
];

const truncate = (str: string, len: number) => {
  const oneLine = str.replace(/\n/g, ' ↵ ');
  return oneLine.length > len ? oneLine.slice(0, len) + '…' : oneLine;
};

const rows = computed<Field[]>(() =>
  allSnippets.value.map(snippet => ({
    shortcut: { content: `<code class="snippet-code">${snippet.id}</code>`, type: 'html' },
    content: { content: truncate(snippet.label, 80), type: 'text' },
    action: { type: 'slot', data: snippet },
  })),
);

// Modal
const handleSave = (snippet: Snippet, originalId?: string): boolean => {
  if (isDuplicate(snippet.id, originalId)) return false;
  if (originalId) {
    return update(originalId, snippet);
  }
  return add(snippet);
};

const openModal = (mode: 'create' | 'edit', snippet?: Snippet) => {
  modalManager.add(
    new Modal(shallowRef(SnippetModal), {
      size: 'small',
      props: {
        snippet: mode === 'edit' ? snippet : undefined,
        onSave: handleSave,
      },
    }),
  );
};

// Actions
const handleDelete = (id: string) => {
  remove(id);
  notifications.add({ title: 'Snippet deleted', type: 'success' });
};

const bulkDelete = (selected: Field[]) => {
  selected.forEach(row => {
    const snippet = row.action?.data as Snippet;
    if (snippet?.id) remove(snippet.id);
  });
  notifications.add({ title: `${selected.length} snippets deleted`, type: 'success' });
};

const openRestoreModal = () => {
  modalManager.add(
    new Modal(shallowRef(RestoreModal), {
      size: 'small',
    }),
  );
};

const duplicateSnippet = (snippet: Snippet) => {
  let newId = snippet.id + '_copy';
  let counter = 1;
  while (isDuplicate(newId)) {
    newId = `${snippet.id}_copy${counter++}`;
  }
  add({ id: newId, label: snippet.label });
};

// Import
const showImportMenu = ref(false);
const jsonInput = ref<HTMLInputElement>();
const dictInput = ref<HTMLInputElement>();

const triggerImport = (type: 'json' | 'dict') => {
  showImportMenu.value = false;
  if (type === 'json') {
    jsonInput.value?.click();
  } else {
    dictInput.value?.click();
  }
};

const handleJSONImport = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  try {
    const count = await importJSON(file);
    notifications.add({ title: `Imported ${count} snippets`, type: 'success' });
  } catch {
    notifications.add({ title: 'Failed to import JSON', type: 'error' });
  }
  (e.target as HTMLInputElement).value = '';
};

const handleDictImport = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  try {
    const count = await importDictionary(file);
    notifications.add({ title: `Imported ${count} words`, type: 'success' });
  } catch {
    notifications.add({ title: 'Failed to import dictionary', type: 'error' });
  }
  (e.target as HTMLInputElement).value = '';
};
</script>

<style scoped lang="scss">
.snippets-page {
  width: 100%;
}

// Header
.page-header {
  margin-bottom: 1.5rem;

  .header-content {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .count {
    padding: 0.15rem 0.5rem;
    border-radius: 999px;
    font-size: 0.75rem;
    color: var(--text-secondary);
    background: var(--surface-transparent);
    margin-left: 0.5rem;
  }

  code {
    padding: 0.1rem 0.4rem;
    border-radius: 4px;
    font-size: 0.85em;
    background: var(--code-bg);
  }
}

// Toolbar
.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 1rem;
}

.dropdown-container {
  position: relative;
}

.dropdown-backdrop {
  position: fixed;
  inset: 0;
  z-index: 99;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 100;
  min-width: 160px;
  padding: 0.25rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface-base);
  box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
  margin-top: 0.25rem;

  button {
    display: flex;
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: none;
    border-radius: var(--radius-sm);
    font-size: 0.85rem;
    color: var(--text-body);
    text-align: left;
    background: none;
    align-items: center;
    cursor: pointer;
    gap: 0.5rem;

    &:hover {
      background: var(--surface-transparent);
    }
  }
}

// Bulk actions
.bulk-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.selected-count {
  display: flex;
  width: 32px;
  height: 36px;
  padding: 6px;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 13px;
  font-weight: bold;
  color: var(--text-secondary);
  align-items: center;
  justify-content: center;
}

.separator {
  height: 32px;
  border-left: 1px solid var(--border);
  margin-left: 4px;
}

.action-btn {
  cursor: pointer;
  margin-right: 10px;

  &:hover {
    opacity: 0.7;
  }
}

// Code styling for table
:deep(.snippet-code) {
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-family: $font-mono;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--primary);
  background: var(--code-bg);
}
</style>
