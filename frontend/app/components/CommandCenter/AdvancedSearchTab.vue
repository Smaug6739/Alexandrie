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
          <div class="tags-filter">
            <div class="tags-input-wrapper">
              <div class="tags-input">
                <input
                  v-model="tagInput"
                  type="text"
                  placeholder="Add tag..."
                  class="tag-input"
                  @keydown.enter="handleEnter"
                  @keydown.arrow-up="tagHandleArrowUp"
                  @keydown.arrow-down="tagHandleArrowDown"
                  @keydown.escape="hideSuggestions"
                  @input="handleTagInput"
                  @focus="showSuggestions = true"
                  @blur="hideSuggestions"
                />
                <button class="add-tag-btn" @click="addTag">
                  <Icon name="plus" fill="#fff" />
                </button>
              </div>
              <div v-if="showSuggestions && filteredTagSuggestions.length > 0" class="tag-suggestions">
                <div
                  v-for="(tag, index) in filteredTagSuggestions"
                  :key="tag"
                  class="tag-suggestion"
                  :class="{ selected: selectedSuggestionIndex === index }"
                  @mousedown="selectTag(tag)"
                  @mouseenter="selectedSuggestionIndex = index"
                >
                  {{ tag }}
                </div>
              </div>
            </div>
            <div v-if="selectedTags?.length" class="selected-tags">
              <span v-for="tag in selectedTags" :key="tag" class="tag-chip">
                {{ tag }}
                <button class="remove-tag" @click.stop="removeTag(tag)">×</button>
              </span>
            </div>
          </div>
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
import type { Node, NodeSearchResult } from '~/stores';

const props = defineProps<{ query: string; selectedIndex: number }>();

defineEmits<{ updateSelectedIndex: [index: number] }>();

const nodesStore = useNodesStore();
const categoriesTree = new TreeStructure(useSidebarTree().nodes.value.filter(n => n.data.role <= 2)).generateTree();

// UI State
const showFilters = ref(true);
const showSuggestions = ref(false);
const selectedSuggestionIndex = ref(0);

// Search State
const searchInContent = ref(true);
const searchResults = ref<(NodeSearchResult | Node)[]>([]);
const dateFrom = ref('');
const dateTo = ref('');
const dateType = ref<'created' | 'modified'>('modified');
const tagInput = ref('');
const selectedTags = ref<string[]>([]);
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
    tags: selectedTags.value,
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
      return selectedTags.value.some(tag => nodeTags.includes(tag));
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

const filteredTagSuggestions = computed(() => {
  if (!tagInput.value) return [];
  const input = tagInput.value.toLowerCase();
  return nodesStore.allTags.filter(tag => tag.toLowerCase().includes(input) && !tagInput.value.includes(tag)).slice(0, 5);
});

const flattenedItems = computed(() => {
  return searchResults.value.map((doc, idx) => ({
    id: doc.id,
    icon: getDocumentIcon(doc),
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

function addTag() {
  const tag = tagInput.value.trim();
  if (tag && !selectedTags.value.includes(tag)) {
    selectedTags.value.push(tag);
    tagInput.value = '';
    showSuggestions.value = false;
  }
}

function selectTag(tag?: string) {
  if (!tag) return;
  selectedTags.value.push(tag);
  tagInput.value = '';
  showSuggestions.value = false;
}

function handleTagInput() {
  selectedSuggestionIndex.value = 0;
  showSuggestions.value = filteredTagSuggestions.value.length > 0;
}

function hideSuggestions() {
  setTimeout(() => {
    showSuggestions.value = false;
  }, 200);
}

function handleEnter(event: KeyboardEvent) {
  event.preventDefault();
  if (showSuggestions.value && filteredTagSuggestions.value.length > 0) {
    selectTag(filteredTagSuggestions.value[selectedSuggestionIndex.value]);
  } else {
    addTag();
  }
}

function tagHandleArrowUp(event: KeyboardEvent) {
  event.preventDefault();
  if (showSuggestions.value && filteredTagSuggestions.value.length > 0) {
    selectedSuggestionIndex.value = selectedSuggestionIndex.value > 0 ? selectedSuggestionIndex.value - 1 : filteredTagSuggestions.value.length - 1;
  }
}

function tagHandleArrowDown(event: KeyboardEvent) {
  event.preventDefault();
  if (showSuggestions.value && filteredTagSuggestions.value.length > 0) {
    selectedSuggestionIndex.value = selectedSuggestionIndex.value < filteredTagSuggestions.value.length - 1 ? selectedSuggestionIndex.value + 1 : 0;
  }
}

function toggleFilters() {
  showFilters.value = !showFilters.value;
}

function removeTag(tag: string) {
  selectedTags.value = selectedTags.value.filter(t => t !== tag);
}

function clearFilters() {
  selectedTags.value = [];
  tagInput.value = '';
  selectedCategory.value = '';
  dateFrom.value = '';
  dateTo.value = '';
  dateType.value = 'modified';
  searchInContent.value = true;
}

function getDocumentIcon(doc: NodeSearchResult | Node): string {
  if ('order' in doc && doc.order == -1) return 'pin';
  return 'files';
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
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}

.filters-header {
  display: flex;
  padding: 10px 16px;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
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
    background: var(--border-color);
  }

  &.collapsed {
    transform: rotate(180deg);
  }
}

.filters-content {
  display: grid;
  padding: 12px 16px;
  grid-template-columns: 1fr 1fr;
  gap: 12px 16px;
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
    margin-bottom: 2px;
    opacity: 0.6;
  }
}

.date-picker {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 13px;
  background: var(--bg-color);
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

.tags-filter {
  .tags-input-wrapper {
    position: relative;
  }

  .tags-input {
    display: flex;
    gap: 6px;
  }

  .tag-input {
    border: 1px solid var(--border-color);
    font-size: 13px;
    background: var(--bg-color);
    flex: 1;
    outline: none;

    &:focus {
      border-color: var(--primary);
    }
  }

  .add-tag-btn {
    display: flex;
    padding: 6px 10px;
    border: none;
    border-radius: 4px;
    color: white;
    background: var(--primary);
    align-items: center;
    cursor: pointer;
    justify-content: center;

    &:hover {
      background: var(--primary-dark);
    }
  }
}

.tag-suggestions {
  position: absolute;
  top: 100%;
  right: 40px;
  left: 0;
  z-index: 10;
  max-height: 150px;
  margin-top: 2px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-color);
  box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
  overflow-y: auto;
}

.tag-suggestion {
  padding: 6px 10px;
  font-size: 12px;
  cursor: pointer;

  &:hover,
  &.selected {
    background: var(--border-color);
  }
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  margin-top: 6px;
  gap: 4px;
}

.tag-chip {
  display: inline-flex;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
  background: var(--border-color);
  align-items: center;
  gap: 4px;

  .remove-tag {
    display: flex;
    width: 14px;
    height: 14px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: none;
    align-items: center;
    cursor: pointer;
    justify-content: center;

    &:hover {
      color: var(--opposite-color);
    }
  }
}

.filter-actions {
  display: flex;
  grid-column: 1 / -1;
  gap: 8px;
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
  background: var(--border-color);

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
  margin: 2px 0 0 0;
  font-size: 10px;
  color: var(--text-secondary);
}

.tag {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  color: white;
  background: var(--primary);
}
</style>
