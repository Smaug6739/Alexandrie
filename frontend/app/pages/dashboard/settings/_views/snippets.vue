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
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 1rem;
  gap: 0.5rem;
}

/* ---------- Snippets ---------- */
.snippets-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.snippet-row {
  display: grid;
  grid-template-columns: 150px 1fr 32px;
  gap: 0.5rem;
  align-items: flex-start;
}

.snippet-key,
.snippet-value {
  border: 1px solid var(--border-color);
  background: var(--bg-color);
  color: var(--font-color);
  border-radius: 6px;
  font-family: $monospace-font;
  font-size: 0.85rem;
  outline: none;
  transition: border-color $transition-duration;
  height: 50px;
}

.snippet-key {
  padding: 0.35rem 0.5rem;
  font-weight: 600;
}

.snippet-value {
  padding: 0.4rem 0.6rem;
  min-height: 44px;
  resize: vertical;
}

.snippet-key:focus,
.snippet-value:focus {
  border-color: var(--blue);
  box-shadow: 0 0 0 1px var(--blue-border);
}

/* ---------- Delete button ---------- */
.delete-btn {
  border: none;
  background: transparent;
  color: var(--red);
  font-size: 0.9rem;
  border-radius: 4px;
  cursor: pointer;
  padding: 0.2rem;

  &:hover {
    background: var(--red-bg-light);
  }
}
</style>
