<template>
  <div class="quick-search-tab">
    <div class="search-results">
      <div v-if="searchQuery && flattenedItems.length === 0" class="no-results">
        <Icon fill="var(--font-color)" name="search" class="no-results-icon" />
        <p>No results found for "{{ searchQuery }}"</p>
      </div>

      <div v-else class="search-results-list">
        <div v-for="(items, section) in groupedResults" :key="section" class="section">
          <div class="section-title">{{ section }}</div>
          <NuxtLink v-for="item in items" :key="item.id" class="search-result-item" :to="item.path" :class="{ selected: selectedIndex === item.globalIndex }" @click="$emit('selectItem')" @mouseenter="$emit('updateSelectedIndex', item.globalIndex)">
            <Icon :name="item.icon" class="result-icon" fill="var(--font-color)" />
            <div class="result-content">
              <span class="result-title">{{ item.title }}</span>
              <span class="result-description">{{ item.description }}</span>
            </div>
            <Icon name="new_tab" class="navigate-icon" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { quickActions, availablePages, type SearchResult, type BaseCommand } from '@/helpers/navigation';
import Icon from '~/components/Icon.vue';
import type { Document } from '~/stores';

const props = defineProps<{
  searchQuery: string;
  selectedIndex: number;
  documents: Document[];
}>();

defineEmits<{ selectItem: []; updateSelectedIndex: [index: number] }>();

function tokenize(text: string) {
  return text.trim().toLowerCase().split(/\s+/).filter(Boolean);
}

function matchesTokens(haystack: string, tokens: string[]) {
  const value = haystack.toLowerCase();
  return tokens.every(t => value.includes(t));
}

function filterByTokens<T>(items: T[], getText: (item: T) => string): T[] {
  const tokens = tokenize(props.searchQuery);
  if (tokens.length === 0) return items;
  return items.filter(item => matchesTokens(getText(item), tokens));
}

const filteredActions = computed(() => filterByTokens(quickActions, a => `${a.title} ${a.description}`));

const filteredDocuments = computed<SearchResult[]>(() =>
  filterByTokens(props.documents, d => {
    const name = d.name || '';
    const tags = Array.isArray(d.tags) ? d.tags.join(' ') : String(d.tags || '');
    return `${name} ${tags}`;
  })
    .slice(0, 5)
    .map(d => ({
      id: d.id,
      title: d.name,
      description: d.tags ? `#${String(d.tags)}` : 'Document',
      icon: 'files',
      path: `/dashboard/docs/${d.id}`,
      category: 'Documents',
    })),
);

const filteredPages = computed(() => filterByTokens(availablePages, p => `${p.title} ${p.description} ${p.category}`));

interface FlattenedItem extends BaseCommand {
  section: string;
  globalIndex: number;
}

const flattenedItems = computed(() => {
  const items: FlattenedItem[] = [];
  let globalIndex = 0;

  const pushWithIndex = (arr: Omit<FlattenedItem, 'section' | 'globalIndex'>[], section: string) => {
    arr.forEach(item => {
      items.push({ ...item, section, globalIndex });
      globalIndex++;
    });
  };

  pushWithIndex(
    filteredActions.value.map(a => ({
      id: `action-${a.id}`,
      icon: a.icon,
      title: a.title,
      description: a.description,
      path: a.path,
    })),
    'Pages & actions',
  );

  pushWithIndex(
    filteredPages.value.map(p => ({
      id: `page-${p.id}`,
      icon: p.icon,
      title: p.title,
      description: p.description,
      path: p.path,
    })),
    'Pages & actions',
  );

  pushWithIndex(
    filteredDocuments.value.map(d => ({
      id: `doc-${d.id}`,
      icon: d.icon,
      title: d.title,
      description: d.description,
      path: d.path,
    })),
    'Documents',
  );

  return items;
});

const groupedResults = computed(() => {
  return flattenedItems.value.reduce((acc, item) => {
    (acc[item.section] ||= []).push(item);
    return acc;
  }, {} as Record<string, typeof flattenedItems.value>);
});

defineExpose({ flattenedItems });
</script>

<style scoped lang="scss">
.quick-search-tab {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.search-results {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  position: relative;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}

.search-results-list {
  padding: 8px 0;
  overflow-y: auto;
  max-height: 100%;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 20px;
  margin: 0 5px;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  color: inherit;

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
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.result-title {
  font-weight: 600;
  color: var(--text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-description {
  font-size: 13px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.navigate-icon {
  width: 16px;
  height: 16px;
  color: var(--text-muted);
  flex-shrink: 0;
}

.section {
  padding: 8px 0 4px;
}

.section-title {
  position: sticky;
  top: 0;
  background: var(--bg-color);
  z-index: 1;
  font-size: 12px;
  text-transform: uppercase;
  color: var(--text-muted);
  padding: 6px 20px;
}

.no-results {
  padding: 40px 20px;
  text-align: center;
  color: var(--text-muted);

  .no-results-icon {
    width: 48px;
    height: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
  }

  p {
    margin: 0;
    font-size: 14px;
  }
}
</style>
