<template>
  <div>
    <div v-if="items.length === 0" class="no-results">
      <Icon name="search" class="no-results-icon" />
      <p>{{ t('components.commandCenter.noResults', { query }) }}</p>
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
          @click="close"
          @mouseenter="$emit('updateSelectedIndex', item.globalIndex)"
        >
          <Icon :name="item.icon" class="result-icon" />
          <div class="result-content">
            <span class="result-title">{{ item.title }}</span>
            <!-- eslint-disable-next-line vue/no-v-html OK because app format -->
            <span class="result-description" v-html="item.description"></span>
          </div>
          <div class="result-shortcut">
            <kbd v-if="item.shortcut">{{ item.shortcut }}</kbd>
            <Icon name="new_tab" class="navigate-icon" />
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ItemCommand } from './types';

const props = defineProps<{ items: ItemCommand[]; selectedIndex: number; query: string }>();
defineEmits<{ updateSelectedIndex: [index: number] }>();

const { t } = useI18nT();
const { close } = useCommandCenter();

const groupedItems = computed(() => {
  return props.items.reduce(
    (acc, item) => {
      (acc[item.section || ''] ||= []).push(item);
      return acc;
    },
    {} as Record<string, typeof props.items>,
  );
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
  align-items: center;
  gap: 10px;
  margin: 0 5px;
  padding: 8px 20px;
  border-radius: var(--radius-md);
  color: inherit;
  text-decoration: none;
  cursor: pointer;

  &:hover,
  &.selected {
    background: var(--border);
  }
}

.result-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  color: var(--primary);
}

.result-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.result-shortcut {
  display: flex;
  align-items: center;
  gap: 6px;
}

.result-title {
  font-size: 14px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.result-description {
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.navigate-icon {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
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
  text-transform: uppercase;
  background: var(--surface-base);
}

.no-results {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  padding: 40px 20px;
  text-align: center;

  .no-results-icon {
    opacity: 0.5;
  }

  p {
    margin: 0;
    font-size: 14px;
  }
}
</style>
