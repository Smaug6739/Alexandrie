<template>
  <div class="view-selection">
    <button :class="{ active: view === 'table' }" @click="view = 'table'">
      <Icon name="list" />
    </button>
    <span style="border-right: 1px solid var(--border-color)" />
    <button :class="{ active: view === 'list' }" @click="view = 'list'">
      <Icon name="table" />
    </button>
  </div>
</template>

<script setup lang="ts">
const view = defineModel<'table' | 'list'>();
const storedView = localStorage.getItem('viewSelection');
if (storedView) view.value = storedView as 'table' | 'list';
watch(view, newView => localStorage.setItem('viewSelection', newView as 'table' | 'list'));
</script>

<style scoped lang="scss">
.view-selection {
  min-width: 80px;
  margin: 2px 4px;
  padding: 0 4px;
  border: 1px solid var(--border-color);
  border-radius: 18px;
  gap: 10px;
}

button {
  width: 35px;
  height: 35px;
  padding: 4px 8px;
  transition: background-color 0.3s;
  cursor: pointer;

  &.active > svg {
    color: var(--primary) !important;
  }

  svg {
    width: 20px;
    height: 20px;
  }
}
</style>
