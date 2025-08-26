<template>
  <div class="quick-search-tab">
    <SearchResultsList
      :items="flattenedItems"
      :selected-index="selectedIndex"
      empty-text='No results found for "{{ searchQuery }}"'
      empty-icon="search"
      @update-selected-index="$emit('updateSelectedIndex', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { quickActions, availablePages, type SearchResult, type BaseCommand } from '@/helpers/navigation';
import SearchResultsList from './SearchResultsList.vue';

const props = defineProps<{
  searchQuery: string;
  selectedIndex: number;
}>();
const documentStore = useDocumentsStore();

defineEmits<{ updateSelectedIndex: [index: number] }>();

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
  documentStore
    .search({ query: props.searchQuery })
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

defineExpose({ flattenedItems });
</script>

<style scoped lang="scss">
.quick-search-tab {
  display: flex;
  height: 100%;
  flex-direction: column;
  overflow: hidden;
}

.search-results {
  position: relative;
  min-height: 0;
  flex: 1;
  -webkit-overflow-scrolling: touch;
  overflow-y: auto;
  overscroll-behavior: contain;
}

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
