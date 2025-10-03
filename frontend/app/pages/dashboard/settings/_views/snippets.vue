<template>
  <div>
    <div class="header">
      <h2 class="ctitle">Snippets</h2>
      <p class="csubtitle">Manage your markdown snippets for quick insertion. Use shortcuts like !blue to quickly insert pre-defined content.</p>
    </div>

    <!-- Search and Actions -->
    <div class="toolbar">
      <div class="search-section">
        <div class="search-wrapper">
          <Icon fill="var(--font-color)" name="search" class="search-icon" />
          <input v-model="searchQuery" type="text" placeholder="Search snippets..." class="search-input" />
        </div>
        <div class="filter-section">
          <AppSelect v-model="sortBy" :items="sortOptions" placeholder="Sort by..." size="200px" :searchable="false" />
        </div>
      </div>

      <div class="actions">
        <AppButton v-if="selectedSnippets.length > 0" type="danger" @click="deleteSelected"> Delete Selected ({{ selectedSnippets.length }}) </AppButton>
        <AppButton type="secondary" class="flex-btn" @click="exportSnippets"><Icon fill="var(--font-color)" name="backup" /> Export </AppButton>
        <AppButton type="secondary" class="flex-btn" @click="importSnippets"><Icon fill="var(--font-color)" name="import" /> Import </AppButton>
        <AppButton type="secondary" @click="restoreDefaults"> ↺ Restore defaults</AppButton>
        <AppButton type="primary" @click="addSnippet"> ＋ Add Snippet </AppButton>
      </div>
    </div>

    <!-- Snippets Grid -->
    <div class="snippets-container">
      <div v-if="filteredSnippets.length === 0" class="no-snippets">
        <Icon fill="var(--font-color)" name="search" class="no-snippets-icon" />
        <p v-if="searchQuery">No snippets found matching "{{ searchQuery }}"</p>
        <p v-else>No snippets available. Create your first snippet!</p>
      </div>

      <TransitionGroup name="snippet" tag="div" class="snippets-grid">
        <div
          v-for="(snippet, index) in filteredSnippets"
          :key="snippet.id || index"
          class="snippet-card"
          :class="{ selected: selectedSnippets.includes(index), editing: editingIndex === index }"
        >
          <!-- Card Header -->
          <div class="snippet-header">
            <div class="snippet-header-left">
              <input type="checkbox" :checked="selectedSnippets.includes(index)" class="snippet-checkbox" @change="toggleSelection(index)" />
              <div v-if="editingIndex !== index" class="snippet-shortcut-display">
                <code class="shortcut-code">{{ snippet.id || '!untitled' }}</code>
              </div>
            </div>

            <div class="snippet-actions">
              <button v-if="editingIndex !== index" class="action-btn edit-btn" title="Edit snippet" @click="startEdit(index)">
                <Icon fill="var(--font-color)" name="edit" />
              </button>
              <button v-if="editingIndex === index" class="action-btn save-btn" title="Save snippet" @click="saveEdit()">
                <Icon fill="var(--font-color)" name="check" />
              </button>
              <button v-if="editingIndex === index" class="action-btn cancel-btn" title="Cancel edit" @click="cancelEdit()">
                <Icon fill="var(--font-color)" name="close" />
              </button>
              <button class="action-btn delete-btn" title="Delete snippet" @click="removeSnippet(index)">
                <Icon fill="var(--font-color)" name="delete" />
              </button>
            </div>
          </div>

          <!-- Edit Mode -->
          <div v-if="editingIndex === index" class="snippet-edit-form">
            <div class="form-group">
              <label>Shortcut:</label>
              <input v-model="editingSnippet.id" class="snippet-key-input" placeholder="!shortcut" :class="{ error: error(editingSnippet.id) }" />
              <div v-if="error(editingSnippet.id)" class="error-message">{{ error(editingSnippet.id) }}</div>
            </div>

            <div class="form-group">
              <label>Content:</label>
              <textarea v-model="editingSnippet.label" class="snippet-content-input" placeholder="Snippet content..." rows="4" />
            </div>
          </div>

          <!-- View Mode -->
          <div v-else class="snippet-content">
            <div class="snippet-preview">
              <div class="preview-label">Preview:</div>
              <div class="preview-content" v-html="getPreviewHtml(snippet.label)" />
            </div>

            <div class="snippet-raw">
              <div class="raw-label">Raw content:</div>
              <pre class="raw-content">{{ snippet.label }}</pre>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Import file input (hidden) -->
    <input ref="fileInput" type="file" accept=".json" style="display: none" @change="handleFileImport" />
  </div>
</template>

<script setup lang="ts">
import { DEFAULT_PREFERENCES } from '~/composables/Preferences';
import compile from '~/helpers/markdown';

const snippets = usePreferences().get('snippets');

// Sort options for AppSelect
const sortOptions = [
  { id: 'shortcut', label: 'Sort by Shortcut' },
  { id: 'content', label: 'Sort by Content' },
  { id: 'usage', label: 'Sort by Usage' },
];

// Reactive state
const searchQuery = ref('');
const sortBy = ref('shortcut');
const selectedSnippets = ref<number[]>([]);
const editingIndex = ref<number | null>(null);
const editingSnippet = ref<{ id: string; label: string }>({ id: '', label: '' });
const originalSnippet = ref<{ id: string; label: string }>({ id: '', label: '' });
const fileInput = ref<HTMLInputElement | null>(null);

// Computed properties
const filteredSnippets = computed(() => {
  const filtered = snippets.value.filter(snippet => {
    const searchLower = searchQuery.value.toLowerCase();
    return snippet.id.toLowerCase().includes(searchLower) || snippet.label.toLowerCase().includes(searchLower);
  });

  // Sort snippets
  return filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'shortcut':
        return a.id.localeCompare(b.id);
      case 'content':
        return a.label.localeCompare(b.label);
      case 'usage':
        // For now, sort by id as usage tracking isn't implemented
        return a.id.localeCompare(b.id);
      default:
        return 0;
    }
  });
});

// Functions
function addSnippet() {
  const newSnippet = { id: '', label: '' };
  snippets.value = [newSnippet, ...snippets.value];

  // Start editing the new snippet immediately
  nextTick(() => {
    startEdit(0);
  });
}

function removeSnippet(index: number) {
  const actualIndex = findActualIndex(index);
  if (actualIndex !== -1) {
    snippets.value.splice(actualIndex, 1);

    // Clear selection if deleted snippet was selected
    selectedSnippets.value = selectedSnippets.value.filter(i => i !== index);

    // Cancel editing if we're editing this snippet
    if (editingIndex.value === index) {
      cancelEdit();
    }
  }
}

function findActualIndex(filteredIndex: number): number {
  const targetSnippet = filteredSnippets.value[filteredIndex];
  return snippets.value.findIndex(snippet => snippet.id === targetSnippet?.id && snippet.label === targetSnippet.label);
}

function toggleSelection(index: number) {
  const selectedIndex = selectedSnippets.value.indexOf(index);
  if (selectedIndex > -1) {
    selectedSnippets.value.splice(selectedIndex, 1);
  } else {
    selectedSnippets.value.push(index);
  }
}

function deleteSelected() {
  const actualIndices = selectedSnippets.value
    .map(findActualIndex)
    .filter(index => index !== -1)
    .sort((a, b) => b - a); // Sort in descending order to avoid index shifting

  actualIndices.forEach(index => {
    snippets.value.splice(index, 1);
  });

  selectedSnippets.value = [];
  cancelEdit();
}

function startEdit(index: number) {
  const actualIndex = findActualIndex(index);
  if (actualIndex !== -1) {
    editingIndex.value = index;
    editingSnippet.value = snippets.value[actualIndex]!;
    originalSnippet.value = snippets.value[actualIndex]!;
  }
}

function saveEdit() {
  if (editingIndex.value !== null && !error(editingSnippet.value.id)) {
    const actualIndex = findActualIndex(editingIndex.value);
    if (actualIndex !== -1) {
      snippets.value[actualIndex] = { ...editingSnippet.value };
    }
    cancelEdit();
  }
}

function cancelEdit() {
  editingIndex.value = null;
  editingSnippet.value = { id: '', label: '' };
  originalSnippet.value = { id: '', label: '' };
}

function error(shortcut: string): string | false {
  if (!shortcut.trim()) return 'Shortcut is required';
  const otherSnippets = snippets.value.filter((_, index) => index !== (editingIndex.value !== null ? findActualIndex(editingIndex.value) : -1));
  if (otherSnippets.some(snippet => snippet.id === shortcut)) {
    return 'This shortcut already exists';
  }

  return false;
}

function getPreviewHtml(content: string): string {
  return compile(content);
}

function exportSnippets() {
  const dataStr = JSON.stringify(snippets.value, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'alexandrie-snippets.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

function importSnippets() {
  fileInput.value?.click();
}

function handleFileImport(event: Event) {
  const file = (event.target as HTMLInputElement)?.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    try {
      const importedSnippets = JSON.parse(e.target?.result as string);
      if (Array.isArray(importedSnippets)) {
        // Merge with existing snippets, avoiding duplicates
        const existingIds = new Set(snippets.value.map(s => s.id));
        const newSnippets = importedSnippets.filter(snippet => snippet.id && snippet.label && !existingIds.has(snippet.id));

        snippets.value = [...snippets.value, ...newSnippets];
      }
    } catch (error) {
      console.error('Failed to import snippets:', error);
      alert('Failed to import snippets. Please check the file format.');
    }
  };

  reader.readAsText(file);

  // Reset input
  if (fileInput.value) {
    fileInput.value.value = '';
  }
}

function restoreDefaults() {
  snippets.value = [...DEFAULT_PREFERENCES.snippets];
  selectedSnippets.value = [];
  cancelEdit();
}

// Watch for search query changes to clear selection
watch(searchQuery, () => {
  selectedSnippets.value = [];
});
</script>

<style scoped lang="scss">
// Header styles
.header {
  margin-bottom: 2rem;
}

// Toolbar styles
.toolbar {
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-section {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex: 1;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
}

.search-wrapper {
  position: relative;
  flex: 1;
  max-width: 400px;

  @media (max-width: 768px) {
    max-width: none;
  }
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
}

.search-input {
  width: 100%;
  padding-left: 2.5rem;
  background: var(--bg-color);
  color: var(--font-color);
}

.filter-section {
  display: flex;
  gap: 0.5rem;
}

.flex-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  flex-wrap: wrap;
}

// Snippets container
.snippets-container {
  min-height: 200px;
}

.no-snippets {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;

  .no-snippets-icon {
    font-size: 3rem;
    opacity: 0.5;
  }

  p {
    font-size: 1.1rem;
    margin: 0;
  }
}

// Grid layout
.snippets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 0.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

// Snippet card
.snippet-card {
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.2s ease;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    border-color: var(--primary-border);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  &.selected {
    border-color: var(--primary);
    background: var(--primary-bg-light);
  }

  &.editing {
    border-color: var(--green);
    box-shadow: 0 4px 16px var(--green-border);
  }
}

// Card header
.snippet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
}

.snippet-header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.snippet-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.snippet-shortcut-display {
  .shortcut-code {
    background: var(--code-bg);
    color: var(--font-color-dark);
    font-family: $monospace-font;
    font-size: 0.9rem;
    font-weight: 600;
  }
}

.snippet-actions {
  display: flex;
  gap: 0.25rem;
}

.action-btn {
  padding: 0.4rem;
  border: none;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;

  &:hover {
    background: var(--bg-ui);
  }
}

// Edit form
.snippet-edit-form {
  .form-group {
    margin-bottom: 1rem;

    .snippet-key-input,
    .snippet-content-input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--border-color);
      border-radius: 6px;
      font-family: $monospace-font;
      font-size: 0.9rem;
      transition: border-color 0.2s ease;
      resize: vertical;
      text-align: left;

      &:focus {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 2px var(--primary-border);
      }

      &.error {
        border-color: var(--red);
        box-shadow: 0 0 0 2px var(--red-border);
      }
    }

    .error-message {
      margin-top: 0.5rem;
      color: var(--red);
      font-size: 0.85rem;
    }
  }
}

// View mode content
.snippet-content {
  .preview-label,
  .raw-label {
    font-size: 0.85rem;
    font-weight: 600;
  }

  .preview-content {
    background: var(--bg-color-secondary);
    border-radius: 6px;
    padding: 0.35rem 0;
    font-size: 0.9rem;
  }

  .raw-content {
    background: var(--code-bg);
    border-radius: 6px;
    padding: 0.35rem 0;
    font-family: $monospace-font;
    font-size: 0.85rem;
    line-height: 1.4;
    white-space: pre-wrap;
    word-break: break-word;
    margin: 0;
  }
}

// Transitions
.snippet-enter-active,
.snippet-leave-active {
  transition: all 0.3s ease;
}

.snippet-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.snippet-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.snippet-move {
  transition: transform 0.3s ease;
}
</style>
