<template>
  <div class="view-selection">
    <button class="view-button" :class="{ active: view === 'table' }" @click="view = 'table'">
      <Icon fill="var(--font-color)" name="list" />
    </button>
    <span style="border-right: 1px solid var(--border-color)"></span>
    <button class="view-button" :class="{ active: view === 'list' }" @click="view = 'list'">
      <Icon fill="var(--font-color)" name="table" />
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
  gap: 10px;
  margin: 2px 4px;
  padding: 0 4px;
  border-radius: 18px;
  border: 1px solid var(--border-color);
  min-width: 81px;
}
.view-button {
  border: none;
  border-radius: 6px;
  padding: 8px;
  width: 35px;
  cursor: pointer;
  transition: background-color 0.3s;
  &.active:deep(svg) {
    transition: fill 0.1s;
    fill: var(--primary);
  }

  svg {
    width: 20px;
    height: 20px;
  }
}
</style>
