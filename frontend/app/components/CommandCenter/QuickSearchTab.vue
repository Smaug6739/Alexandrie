<template>
  <div class="quick-search-tab">
    <SearchResultsList
      :items="flattenedItems"
      :selected-index="selectedIndex"
      :query="searchQuery"
      empty-icon="search"
      @update-selected-index="$emit('updateSelectedIndex', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { quickActions, availablePages, type SearchResult, type BaseCommand } from '~/helpers/navigation';
import SearchResultsList from './SearchResultsList.vue';

const props = defineProps<{
  searchQuery: string;
  selectedIndex: number;
}>();
const documentStore = useNodesStore();

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
    .search({ query: props.searchQuery, role: 3 })
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
      shortcut: a.shortcut,
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
}
</style>
