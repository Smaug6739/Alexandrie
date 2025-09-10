<template>
  <div>
    <h2 class="ctitle">Snippets</h2>
    <!-- Actions row -->
    <div class="actions">
      <AppButton type="primary" @click="addSnippet"> ＋ Add snippet </AppButton>
      <AppButton type="secondary" @click="restoreDefaults"> ↺ Restore defaults </AppButton>
    </div>
    <!-- Snippets list -->
    <div class="snippets-list">
      <div v-for="(snippet, index) in snippets" :key="index" class="snippet-row">
        <input v-model="snippet.id" class="snippet-key" placeholder="!shortcut" />
        <textarea v-model="snippet.label" class="snippet-value" placeholder="Snippet content..." />
        <button class="delete-btn" title="Delete snippet" @click="removeSnippet(index)">✕</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const snippets = usePreferences().get('snippets');

function addSnippet() {
  snippets.value = [{ id: '', label: '' }, ...snippets.value];
}

function removeSnippet(index: number) {
  snippets.value.splice(index, 1);
}

function restoreDefaults() {
  snippets.value = DEFAULT_PREFERENCES.snippets;
}
</script>

<style scoped lang="scss">
.actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

/* ---------- Snippets ---------- */
.snippets-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.snippet-row {
  display: grid;
  align-items: flex-start;
  gap: 0.5rem;
  grid-template-columns: 150px 1fr 32px;
}

.snippet-key,
.snippet-value {
  height: 50px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-family: $monospace-font;
  font-size: 0.85rem;
  color: var(--font-color);
  background: var(--bg-color);
  transition: border-color $transition-duration;
  outline: none;
}

.snippet-key {
  padding: 0.35rem 0.5rem;
  font-weight: 600;
}

.snippet-value {
  min-height: 44px;
  padding: 0.4rem 0.6rem;
  resize: vertical;
}

.snippet-key:focus,
.snippet-value:focus {
  border-color: var(--blue);
  box-shadow: 0 0 0 1px var(--blue-border);
}

/* ---------- Delete button ---------- */
.delete-btn {
  padding: 0.2rem;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  color: var(--red);
  background: transparent;
  cursor: pointer;

  &:hover {
    background: var(--red-bg-light);
  }
}
</style>
