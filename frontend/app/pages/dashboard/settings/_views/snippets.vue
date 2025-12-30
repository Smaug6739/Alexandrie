<template>
  <div>
    <div class="header">
      <h2 class="app-title">Snippets</h2>
      <p class="app-subtitle">Manage your markdown snippets for quick insertion. Use shortcuts like !blue to quickly insert pre-defined content.</p>
    </div>
    <!-- Search and Actions -->
    <div class="toolbar">
      <div class="search-section">
        <div class="search-wrapper">
          <Icon name="search" class="search-icon" /> <input v-model="searchQuery" type="text" placeholder="Search snippets..." class="search-input" />
        </div>
        <div class="filter-section"><AppSelect v-model="sortBy" :items="sortOptions" placeholder="Sort by..." size="200px" :searchable="false" /></div>
      </div>
      <div class="actions">
        <AppButton v-if="selectedSnippets.length > 0" type="danger" @click="deleteSelected"> Delete Selected ({{ selectedSnippets.length }}) </AppButton>
        <AppButton type="secondary" class="flex-btn" @click="exportSnippets"><Icon name="backup" /> Export </AppButton>
        <AppButton type="secondary" class="flex-btn" @click="importSnippets"><Icon name="import" /> Import </AppButton>
        <AppButton type="secondary" @click="restoreDefaults"> ↺ Restore defaults</AppButton>
        <AppButton type="primary" @click="addSnippet"> ＋ Add Snippet </AppButton>
      </div>
    </div>
    <div class="snippets-container">
      <div v-if="filteredSnippets.length === 0 && !creatingSnippet" class="no-snippets">
        <Icon name="search" class="no-snippets-icon" />
        <p v-if="searchQuery">No snippets found matching "{{ searchQuery }}"</p>
        <p v-else>No snippets available. Create your first snippet!</p>
      </div>

      <TransitionGroup name="snippet" tag="div" class="snippets-grid">
        <!-- Existing snippets -->
        <div v-if="creatingSnippet" class="snippet-card editing">
          <div class="snippet-header">
            <div class="snippet-header-left"></div>
            <div class="snippet-actions">
              <button class="action-btn save-btn" title="Save snippet" @click="saveNewSnippet()">
                <Icon name="check" />
              </button>
              <button class="action-btn cancel-btn" title="Cancel creation" @click="cancelNewSnippet()">
                <Icon name="close" />
              </button>
            </div>
          </div>
          <div class="snippet-edit-form">
            <div class="form-group">
              <input v-model="newSnippet.id" class="snippet-key-input" placeholder="!shortcut" :class="{ error: error(newSnippet.id) }" />
              <div v-if="error(newSnippet.id)" class="error-message">{{ error(newSnippet.id) }}</div>
            </div>
            <div class="form-group">
              <label>Content:</label>
              <textarea
                v-model="newSnippet.label"
                class="snippet-content-input"
                placeholder="Snippet content...&#10;Use ${0}, ${1}, ... to tab through placeholders"
                rows="4"
              />
            </div>
          </div>
        </div>
        <div
          v-for="(snippet, index) in filteredSnippets"
          :key="snippet.id || index"
          class="snippet-card"
          :class="{ selected: selectedSnippets.includes(index), editing: editingIndex === index }"
        >
          <div class="snippet-header">
            <div class="snippet-header-left">
              <input type="checkbox" :checked="selectedSnippets.includes(index)" class="snippet-checkbox" @change="toggleSelection(index)" />
              <div v-if="editingIndex !== index" class="snippet-shortcut-display">
                <code class="shortcut-code">{{ snippet.id }}</code>
              </div>
            </div>
            <div class="snippet-actions">
              <button v-if="editingIndex !== index" class="action-btn edit-btn" title="Edit snippet" @click="startEdit(index)">
                <Icon name="edit" />
              </button>
              <button v-if="editingIndex === index" class="action-btn save-btn" title="Save snippet" @click="saveEdit()">
                <Icon name="check" />
              </button>
              <button v-if="editingIndex === index" class="action-btn cancel-btn" title="Cancel edit" @click="cancelEdit()">
                <Icon name="close" />
              </button>
              <button class="action-btn delete-btn" title="Delete snippet" @click="removeSnippet(index)">
                <Icon name="delete" />
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
            <pre class="raw-content">{{ snippet.label }}</pre>
          </div>
        </div>

        <!-- Temporary snippet creation -->
      </TransitionGroup>
    </div>
    <input ref="fileInput" type="file" accept=".json" style="display: none" @change="handleFileImport" />
  </div>
</template>

<script setup lang="ts">
const preferences = usePreferences();

const snippets = preferences.get('snippets');

// Reactive state
const searchQuery = ref('');
const sortBy = ref('shortcut');
const selectedSnippets = ref<number[]>([]);
const editingIndex = ref<number | null>(null);
const editingSnippet = ref<{ id: string; label: string }>({ id: '', label: '' });
const originalSnippet = ref<{ id: string; label: string }>({ id: '', label: '' });

const creatingSnippet = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const newSnippet = ref<{ id: string; label: string }>({ id: '', label: '' });
const sortOptions = [
  { id: 'shortcut', label: 'Sort by Shortcut' },
  { id: 'content', label: 'Sort by Content' },
  { id: 'usage', label: 'Sort by Usage' },
];

const filteredSnippets = computed(() => {
  return snippets.value
    .filter(
      snippet => snippet.id.toLowerCase().includes(searchQuery.value.toLowerCase()) || snippet.label.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
    .sort((a, b) => a.id.localeCompare(b.id));
});

// Functions
function addSnippet() {
  creatingSnippet.value = true;
  newSnippet.value = { id: '', label: '' };
}

function saveNewSnippet() {
  if (error(newSnippet.value.id)) return;
  snippets.value.unshift({ ...newSnippet.value });
  preferences.set('snippets', snippets.value);
  creatingSnippet.value = false;
  newSnippet.value = { id: '', label: '' };
}

function cancelNewSnippet() {
  creatingSnippet.value = false;
  newSnippet.value = { id: '', label: '' };
}

function removeSnippet(index: number) {
  const actualIndex = findActualIndex(index);
  if (actualIndex !== -1) {
    snippets.value.splice(actualIndex, 1);

    // Clear selection if deleted snippet was selected
    selectedSnippets.value = selectedSnippets.value.filter(i => i !== index);
    preferences.set('snippets', snippets.value);
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
    preferences.set('snippets', snippets.value);
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
      preferences.set('snippets', snippets.value);
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
  // Return This shortcut already exists if duplicate
  const isDuplicate = snippets.value.some((snippet, index) => {
    const actualIndex = findActualIndex(index);
    return snippet.id === shortcut && actualIndex !== findActualIndex(editingIndex.value ?? -1);
  });
  if (isDuplicate) {
    return 'This shortcut already exists.';
  }
  return false;
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
    } catch {
      useNotifications().add({ title: 'Failed to import snippets. Please check the file format.', type: 'error' });
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
  align-items: center;
  flex: 1;
  gap: 1rem;

  @media (width <= 768px) {
    align-items: stretch;
    flex-direction: column;
  }
}

.search-wrapper {
  position: relative;
  max-width: 400px;
  flex: 1;

  @media (width <= 768px) {
    max-width: none;
  }
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 0.75rem;
  font-size: 1rem;
  transform: translateY(-50%);
}

.search-input {
  width: 100%;
  color: var(--font-color);
  background: var(--bg-color);
  padding-left: 2.5rem;
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
  padding: 0.5rem 0;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

// Snippets container
.snippets-container {
  min-height: 200px;
  border-radius: 12px;
  background-color: var(--bg-ui);
}

.no-snippets {
  display: flex;
  padding: 4rem 2rem;
  align-items: center;
  justify-content: center;

  .no-snippets-icon {
    font-size: 3rem;
    opacity: 0.5;
  }

  p {
    margin: 0;
  }
}

// Grid layout
.snippets-grid {
  display: grid;
  gap: 0.5rem;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));

  @media (width <= 768px) {
    gap: 1rem;
    grid-template-columns: 1fr;
  }
}

// Snippet card
.snippet-card {
  position: relative;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--bg-ui);
  }

  &.selected {
    border-color: var(--primary);
    background: var(--primary-bg-light);
  }

  &.editing {
    border-color: var(--green);
  }
}

// Card header
.snippet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.snippet-header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.snippet-checkbox {
  width: 17px;
  height: 17px;
  cursor: pointer;
}

.snippet-shortcut-display {
  .shortcut-code {
    font-family: $monospace-font;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--font-color-dark);
    background: var(--code-bg);
  }
}

.snippet-actions {
  display: flex;
  gap: 0.25rem;
}

.action-btn {
  display: flex;
  min-width: 32px;
  height: 32px;
  padding: 0.4rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  background: transparent;
  transition: background-color 0.2s ease;
  align-items: center;
  cursor: pointer;
  justify-content: center;

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
      text-align: left;
      transition: border-color 0.2s ease;
      resize: vertical;

      &:focus {
        border-color: var(--primary);
        box-shadow: 0 0 0 2px var(--primary-border);
        outline: none;
      }

      &.error {
        border-color: var(--red);
        box-shadow: 0 0 0 2px var(--red-border);
      }
    }

    .error-message {
      font-size: 0.85rem;
      color: var(--red);
      margin-top: 0.5rem;
    }
  }
}

// View mode content
.snippet-content {
  .raw-label {
    font-size: 0.85rem;
    font-weight: 600;
  }

  .raw-content {
    margin: 0;
    font-family: $monospace-font;
    line-height: 1.4;
    background: var(--code-bg);
    white-space: nowrap;
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
