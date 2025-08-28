<template>
  <div>
    <div v-if="items.length === 0" class="no-results">
      <Icon :name="emptyIcon" class="no-results-icon" fill="var(--font-color)" />
      <p>No results found for "{{ query }}"</p>
    </div>
    <div v-else class="search-results-list">
      <div v-for="(group, section) in groupedItems" :key="section" class="section">
        <div v-if="section" class="section-title">{{ section }}</div>
        <NuxtLink
          v-for="item in group"
          :key="item.id"
          class="search-result-item"
          :to="item.path"
          :class="{ selected: selectedIndex === item.globalIndex }"
          @mouseenter="$emit('updateSelectedIndex', item.globalIndex)"
        >
          <Icon :name="item.icon" class="result-icon" fill="var(--font-color)" />
          <div class="result-content">
            <span class="result-title">{{ item.title }}</span>
            <span class="result-description">{{ item.description }}</span>
          </div>
          <div class="result-shortcut">
            <kbd v-if="item.shortcut">{{ item.shortcut }}</kbd>
            <Icon name="new_tab" class="navigate-icon" fill="var(--font-color)" />
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Item } from './types';
const props = defineProps<{
  items: Item[];
  selectedIndex: number;
  query: string;
  emptyIcon: string;
}>();

defineEmits<{
  updateSelectedIndex: [index: number];
}>();

const groupedItems = computed(() => {
  return props.items.reduce((acc, item) => {
    (acc[item.section || ''] ||= []).push(item);
    return acc;
  }, {} as Record<string, typeof props.items>);
});
</script>

<style scoped lang="scss">
.search-results-list {
  max-height: 100%;
  padding: 8px 0;
  overflow-y: auto;
}

.search-result-item {
  display: flex;
  margin: 0 5px;
  padding: 8px 20px;
  border-radius: 8px;
  color: inherit;
  align-items: center;
  cursor: pointer;
  gap: 10px;
  text-decoration: none;

  &:hover,
  &.selected {
    background: var(--border-color);
  }
}

.result-icon {
  width: 20px;
  height: 20px;
  color: var(--primary);
  flex-shrink: 0;
}

.result-content {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 4px;
}
.result-shortcut {
  display: flex;
  gap: 6px;
}

.result-title {
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-description {
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.navigate-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.section {
  padding: 8px 0 4px;
}

.section-title {
  position: sticky;
  top: 0;
  z-index: 1;
  padding: 6px 20px;
  font-size: 12px;
  background: var(--bg-color);
  text-transform: uppercase;
}

.no-results {
  display: flex;
  padding: 40px 20px;
  text-align: center;
  align-items: center;
  gap: 5px;
  justify-content: center;

  .no-results-icon {
    opacity: 0.5;
  }

  p {
    margin: 0;
    font-size: 14px;
  }
}
</style>
