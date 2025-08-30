<template>
  <div class="snippets-page">
    <h2 class="title">Snippets</h2>
    <p class="subtitle">Manage the snippets available in the editor.</p>

    <!-- Actions -->
    <div class="actions">
      <button @click="addSnippet" class="btn primary">+ Add snippet</button>
      <button @click="restoreDefaults" class="btn danger">Restore defaults</button>
    </div>

    <!-- Snippets list -->
    <table class="snippets-table">
      <thead>
        <tr>
          <th>Key</th>
          <th>Content</th>
          <th class="actions-col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(snippet, index) in snippets" :key="snippet.key">
          <td>
            <input v-model="snippet.key" class="input key-input" placeholder="!shortcut" />
          </td>
          <td>
            <textarea v-model="snippet.value" class="input content-input" placeholder="Snippet content..." />
          </td>
          <td class="actions-col">
            <button @click="removeSnippet(index)" class="btn small danger">Delete</button>
          </td>
        </tr>
        <tr v-if="snippets.length === 0">
          <td colspan="3" class="empty">No snippets yet</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

type Snippet = { key: string; value: string };

const defaultSnippets: Snippet[] = [
  { key: '!blue', value: ':::blue\n$0\n:::' },
  { key: '!green', value: ':::green\n$0\n:::' },
  { key: '!yellow', value: ':::yellow\n$0\n:::' },
  { key: '!grey', value: ':::grey\n$0\n:::' },
  { key: '!details', value: ':::details\n$0\n:::' },
  { key: '!center', value: ':::center\n$0\n:::' },
  { key: '!m', value: '$$0$' },
  { key: '!property', value: ':::property $0\n\n:::' },
  { key: '!warning', value: ':::warning $0\n\n:::' },
];

const snippets = ref<Snippet[]>([...defaultSnippets]);

function addSnippet() {
  snippets.value.push({ key: '!new', value: 'New snippet content' });
}

function removeSnippet(index: number) {
  snippets.value.splice(index, 1);
}

function restoreDefaults() {
  if (confirm('Are you sure you want to restore default snippets?')) {
    snippets.value = [...defaultSnippets];
  }
}
</script>

<style scoped lang="scss">
.snippets-page {
  padding: 1.5rem;
  max-width: 800px;
  margin: auto;
}

.actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.snippets-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;

  th,
  td {
    padding: 0.75rem;
    border-bottom: 1px solid #eee;
    text-align: left;
  }

  th {
    background: #f8f8f8;
    font-weight: 600;
  }

  .empty {
    text-align: center;
    color: #888;
  }
}

.input {
  width: 100%;
  padding: 0.4rem 0.6rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.9rem;
}

.key-input {
  font-weight: bold;
  font-family: monospace;
}

.content-input {
  font-family: monospace;
  min-height: 60px;
  resize: vertical;
}

.actions-col {
  text-align: right;
  width: 120px;
}

.btn {
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  border: none;
  transition: background 0.2s;

  &.primary {
    background: #2563eb;
    color: white;
  }

  &.danger {
    background: #ef4444;
    color: white;
  }

  &.small {
    padding: 0.3rem 0.6rem;
    font-size: 0.75rem;
  }

  &:hover {
    opacity: 0.9;
  }
}
</style>
