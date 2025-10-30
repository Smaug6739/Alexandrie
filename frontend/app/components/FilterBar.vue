<template>
  <div class="filters-bar">
    <Icon name="filter" class="filter-icon" />
    <input type="text" :placeholder="'Search...'" :value="filter" @input="$emit('update:filter', $event.target.value)" class="search" />
    <div class="select-wrapper">
      <select :value="sortKey" @change="$emit('update:sortKey', $event.target.value)" class="sort-select">
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="size_asc">Size ascending</option>
        <option value="size_desc">Size descending</option>
      </select>
    </div>
    <slot/>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  filter: string,
  sortKey: 'newest'|'oldest'|'size_asc'|'size_desc'
}>();
defineEmits(['update:filter','update:sortKey'])
import Icon from './Icon.vue';
</script>

<style scoped lang="scss">
.filters-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  max-width: 700px;
  margin-bottom: 14px;
  background: transparent;
  padding: 0;
}
.filter-icon {
  color: var(--primary);
  font-size: 1.35em;
  margin-right: 3px;
  flex-shrink: 0;
  opacity: 0.88;
}
.search {
  flex: 1;
  padding: 10px 14px;
  border: 1.8px solid var(--border-color);
  border-radius: 8px;
  font-size: 15px;
  background: var(--bg-color-secondary);
  color: var(--font-color-dark);
  outline: none;
  transition: border-color 0.2s ease;
}
.search:focus {
  border-color: var(--primary);
}
.select-wrapper {
  position: relative;
}
.sort-select {
  border: 1.8px solid var(--border-color);
  border-radius: 8px;
  padding: 8px 34px 8px 10px;
  background: var(--bg-color-secondary);
  font-size: 15px;
  color: var(--font-color-dark);
  cursor: pointer;
  font-weight: 500;
  transition: border-color 0.2s ease, background 0.2s ease, color 0.2s ease;
  appearance: none;
  min-width: 140px;
  max-width: 180px;
}
.sort-select:hover {
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 6px 18px rgba(0,0,0,0.15);
}
.sort-select:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.18);
  box-shadow: 0 0 0 2px var(--primary), 0 6px 20px rgba(0,0,0,0.2);
  color: var(--primary);
}
.select-wrapper::after {
  content: '▾';
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--primary);
  font-size: 1.6rem;
  pointer-events: none;
}
</style>
