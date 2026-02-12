<template>
  <div class="advanced-search-tab">
    <div class="search-filters">
      <div class="filters-header">
        <h3 class="filters-title">Advanced Filters</h3>
        <span class="filters-actions">
          <button class="clear-filters-btn" @click="clearFilters">Clear</button>
          <button class="toggle-filters-btn" :class="{ collapsed: !showFilters }" @click="toggleFilters">
            <Icon :name="showFilters ? 'collapse' : 'expand'" />
          </button>
        </span>
      </div>

      <div v-show="showFilters" class="filters-content">
        <div class="filter-group full-width">
          <label class="filter-label">Date Range</label>
          <div class="date-row">
            <div class="date-filters">
              <div class="date-input">
                <label>From</label>
                <input v-model="dateFrom" type="date" class="date-picker" />
              </div>
              <div class="date-input">
                <label>To</label>
                <input v-model="dateTo" type="date" class="date-picker" />
              </div>
            </div>
            <div class="radio-group">
              <label class="radio-option">
                <input v-model="dateType" type="radio" value="created" />
                <span>Created</span>
              </label>
              <label class="radio-option">
                <input v-model="dateType" type="radio" value="modified" />
                <span>Modified</span>
              </label>
            </div>
          </div>
        </div>

        <div class="filter-group">
          <label class="filter-label">Category</label>
          <AppSelect v-model="selectedCategory" :items="categoriesTree" :nullable="true" placeholder="All categories" />
        </div>

        <div class="filter-group">
          <label class="filter-label">Tags</label>
          <AppTagInput v-model="selectedTags" @update:model-value="tagInput = $event" />
        </div>

        <div class="filter-group full-width">
          <label class="filter-label inline">
            <AppCheck v-model="searchInContent" />
            Search in document content
          </label>
          <p class="filter-hint">Searches inside document body (requires complete words)</p>
        </div>

        <div class="filter-actions"></div>
      </div>
    </div>

    <div class="search-results">
      <SearchResultsList :items="flattenedItems" :selected-index="selectedIndex" :query="query" @update-selected-index="$emit('updateSelectedIndex', $event)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchResultsList from './SearchResultsList.vue';
import { resolveIcon } from '~/helpers/node';
import type { Node, NodeSearchResult } from '~/stores';

const props = defineProps<{ query: string; selectedIndex: number }>();

defineEmits<{ updateSelectedIndex: [index: number] }>();

const nodesStore = useNodesStore();
const nodesTree = useNodesTree();
const categoriesTree = nodesTree.categoriesTree;

// UI State
const showFilters = ref(true);

// Search State
const searchInContent = ref(true);
const searchResults = ref<(NodeSearchResult | Node)[]>([]);
const dateFrom = ref('');
const dateTo = ref('');
const dateType = ref<'created' | 'modified'>('modified');
const tagInput = ref('');
const selectedTags = ref<string>('');
const selectedCategory = ref('');

/**
 * Global search function
 * - If searchInContent is ON and query >= 2 chars → API fulltext search
 * - Otherwise → local store search
 */

async function searchAPI() {
  try {
    const apiResults = await nodesStore.searchFulltext(props.query, true, 30);
    searchResults.value = applyFilters(apiResults);
  } catch (error) {
    console.error('[CommandCenter] Fulltext search error:', error);
    searchResults.value = [];
  }
}

const searchAPIdebounced = useDebounceFn(() => searchAPI(), 300);

async function localSearch() {
  searchResults.value = nodesStore.search({
    query: props.query,
    category: selectedCategory.value,
    dateType: dateType.value,
    fromDate: dateFrom.value ? new Date(dateFrom.value) : undefined,
    toDate: dateTo.value ? new Date(dateTo.value) : undefined,
    tags: selectedTags.value
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0),
    role: 3,
  });
}

/**
 * Apply additional filters to API results (category, tags, dates)
 */
function applyFilters(results: (NodeSearchResult | Node)[]): (NodeSearchResult | Node)[] {
  let filtered = [...results];

  // Apply category filter
  if (selectedCategory.value) {
    filtered = filtered.filter(d => d.parent_id === selectedCategory.value);
  }

  // Apply tag filters
  if (selectedTags.value.length) {
    filtered = filtered.filter(d => {
      if (!d.tags) return false;
      const nodeTags = d.tags.split(',').map(t => t.trim());
      return selectedTags.value
        .split(',')
        .map(t => t.trim())
        .some(tag => nodeTags.includes(tag));
    });
  }

  // Apply date filters
  const fromDate = dateFrom.value ? new Date(dateFrom.value) : null;
  const toDate = dateTo.value ? new Date(dateTo.value) : null;
  if (fromDate || toDate) {
    filtered = filtered.filter(d => {
      const timestamp = dateType.value === 'created' ? d.created_timestamp : d.updated_timestamp;
      const nodeDate = new Date(timestamp);
      if (fromDate && nodeDate < fromDate) return false;
      if (toDate && nodeDate > toDate) return false;
    });
  }

  return filtered;
}

// Watch all search-related changes and trigger search
watch(
  [() => props.query, searchInContent, dateFrom, dateTo, dateType, selectedCategory, selectedTags],
  () => {
    if (props.query.length >= 2 && searchInContent.value) {
      searchAPIdebounced();
    } else {
      localSearch();
    }
  },
  { immediate: true, deep: true },
);

const flattenedItems = computed(() => {
  return searchResults.value.map((doc, idx) => ({
    id: doc.id,
    icon: resolveIcon(doc),
    title: doc.name,
    description: buildDescription(doc),
    path: `/dashboard/docs/${doc.id}`,
    section: '',
    globalIndex: idx,
  }));
});

function buildDescription(doc: NodeSearchResult | Node): string {
  // If we have a content snippet from fulltext search, show it
  if ('content_snippet' in doc && doc.content_snippet) {
    // Clean up HTML tags and show snippet
    if (doc.content_snippet) {
      // No injection risk as content_snippet is generated by the backend and it's self provited content
      return `...${highlightMatches(doc.content_snippet)}...`;
    }
  }
  // Fallback to tags
  if (doc.tags) {
    return `#${String(
      doc.tags
        .split(',')
        .map(t => t.trim())
        .join(' #'),
    )}`;
  }
  return 'Document';
}

/**
 * Highlight matching words in text by wrapping them in <b> tags
 */
function highlightMatches(text: string): string {
  if (!props.query || props.query.length < 2) return escapeHtml(text);

  const words = props.query
    .trim()
    .split(/\s+/)
    .filter(w => w.length >= 2);
  if (words.length === 0) return escapeHtml(text);

  // Escape special regex chars and create pattern
  const pattern = words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const regex = new RegExp(`(${pattern})`, 'gi');

  return escapeHtml(text).replace(regex, '<b>$1</b>');
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function toggleFilters() {
  showFilters.value = !showFilters.value;
}

function clearFilters() {
  selectedTags.value = '';
  tagInput.value = '';
  selectedCategory.value = '';
  dateFrom.value = '';
  dateTo.value = '';
  dateType.value = 'modified';
  searchInContent.value = true;
}

defineExpose({ flattenedItems });
</script>

<style scoped lang="scss">
.advanced-search-tab {
  display: flex;
  height: 100%;
  flex-direction: column;
}

.search-filters {
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.filters-header {
  display: flex;
  padding: 10px 16px;
  align-items: center;
  border-bottom: 1px solid var(--border);
  justify-content: space-between;
}

.filters-title {
  margin: 0;
  font-size: 11px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.filters-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toggle-filters-btn {
  display: flex;
  padding: 4px;
  border: none;
  border-radius: 4px;
  background: transparent;
  transition: transform 0.2s ease;
  align-items: center;
  cursor: pointer;
  justify-content: center;

  &:hover {
    background: var(--border);
  }

  &.collapsed {
    transform: rotate(180deg);
  }
}

.filters-content {
  display: grid;
  padding: 12px 16px;
  gap: 12px 16px;
  grid-template-columns: 1fr 1fr;
}

.filter-group {
  &.full-width {
    grid-column: 1 / -1;
  }
}

.filter-label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.3px;
  margin-bottom: 4px;
  text-transform: uppercase;
}

.inline {
  display: flex;
  align-items: center;
}

.date-filters {
  display: flex;
  gap: 8px;
}

.date-input {
  flex: 1;

  label {
    display: block;
    font-size: 10px;
    opacity: 0.6;
    margin-bottom: 2px;
  }
}

.date-picker {
  width: 100%;
  background: var(--surface-base);
  outline: none;

  &:focus {
    border-color: var(--primary);
  }
}

.radio-group {
  display: flex;
  gap: 12px;
}

.radio-option {
  display: flex;
  font-size: 13px;
  align-items: center;
  cursor: pointer;
  gap: 4px;

  input[type='radio'] {
    accent-color: var(--primary);
  }
}

.filter-actions {
  display: flex;
  gap: 8px;
  grid-column: 1 / -1;
}

.clear-filters-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
}

.clear-filters-btn {
  background: var(--border);

  &:hover {
    background: var(--selection-color);
  }
}

.search-results {
  position: relative;
  min-height: 0;
  flex: 1;
  overscroll-behavior: contain;
}

.filter-hint {
  margin: 2px 0 0;
  font-size: 10px;
  color: var(--text-secondary);
}
</style>
