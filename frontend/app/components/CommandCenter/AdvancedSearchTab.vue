<template>
  <div class="advanced-search-tab">
    <div class="search-filters">
      <div class="filters-header">
        <h3 class="filters-title">Advanced Filters</h3>
        <button class="toggle-filters-btn" :class="{ collapsed: !showFilters }" @click="toggleFilters">
          <Icon :name="showFilters ? 'collapse' : 'expand'" />
        </button>
      </div>

      <div v-show="showFilters" class="filters-content">
        <div class="filter-group">
          <label class="filter-label">Date Range</label>
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
        </div>

        <div class="filter-group">
          <label class="filter-label">Date Type</label>
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

        <div class="filter-group">
          <label class="filter-label">Tags</label>
          <div class="tags-filter">
            <div class="tags-input-wrapper">
              <div class="tags-input">
                <input
                  v-model="tagInput"
                  type="text"
                  placeholder="Add tag filter..."
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
            <div class="selected-tags">
              <span v-for="tag in selectedTags" :key="tag" class="tag-chip">
                {{ tag }}
                <button class="remove-tag" @click.stop="removeTag(tag)">
                  <Icon name="close" fill="var(--font-color)" class="no-close" />
                </button>
              </span>
            </div>
          </div>
        </div>

        <div class="filter-group">
          <label class="filter-label">Category</label>
          <AppSelect v-model="selectedCategory" :items="categoriesTree" placeholder="Select a category" />
        </div>

        <div class="filter-actions">
          <button class="clear-filters-btn" @click="clearFilters">Clear Filters</button>
          <button class="apply-filters-btn">Apply Filters</button>
        </div>
      </div>
    </div>

    <div class="search-results">
      <SearchResultsList
        :items="flattenedItems"
        :selected-index="selectedIndex"
        empty-text="No documents match your filters"
        empty-icon="search"
        @update-selected-index="$emit('updateSelectedIndex', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchResultsList from './SearchResultsList.vue';
import type { Document } from '~/stores';
const props = defineProps<{
  query: string;
  selectedIndex: number;
}>();

defineEmits<{
  updateSelectedIndex: [index: number];
}>();

const dateFrom = ref('');
const dateTo = ref('');
const dateType = ref<'created' | 'modified'>('modified');
const tagInput = ref('');
const selectedTags = ref<string[]>([]);
const selectedCategory = ref('');
const showFilters = ref(true);
const showSuggestions = ref(false);
const selectedSuggestionIndex = ref(0);

const documentStore = useDocumentsStore();
const categoriesTree = new TreeStructure(useSidebarTree().categories.value).generateTree().filter(i => i.data.type === 'category' && i.data.role == 2);

const filteredTagSuggestions = computed(() => {
  if (!tagInput.value) return [];
  const input = tagInput.value.toLowerCase();
  return documentStore.allTags.filter(tag => tag.toLowerCase().includes(input) && !selectedTags.value.includes(tag)).slice(0, 5);
});

const filteredDocuments = computed(() => {
  return documentStore.search({
    query: props.query,
    category: selectedCategory.value,
    dateType: dateType.value,
    fromDate: dateFrom.value ? new Date(dateFrom.value) : undefined,
    toDate: dateTo.value ? new Date(dateTo.value) : undefined,
    tags: selectedTags.value,
  });
});

const flattenedItems = computed(() => {
  return filteredDocuments.value.map((doc, idx) => ({
    id: doc.id,
    icon: getDocumentIcon(doc),
    title: doc.name,
    description: doc.tags ? `#${String(doc.tags)}` : 'Document',
    path: `/dashboard/docs/${doc.id}`,
    section: '',
    globalIndex: idx,
  }));
});

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
  dateFrom.value = '';
  dateTo.value = '';
  selectedTags.value = [];
  selectedCategory.value = '';
}

function getDocumentIcon(doc: Document) {
  if (doc.pinned === 1) return 'pin';
  if (doc.pinned === 2) return 'pin';
  return 'files';
}

defineExpose({ flattenedItems });
</script>

<style scoped lang="scss">
.advanced-search-tab {
  display: flex;
  height: 100%;
  flex-direction: column;
  overflow: hidden;
}

.search-filters {
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}

.filters-header {
  display: flex;
  padding: 16px 20px;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  justify-content: space-between;
}

.filters-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
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
  padding: 20px;
}

.filter-group {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.filter-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.date-filters {
  display: flex;
  gap: 12px;
}

.date-input {
  flex: 1;

  label {
    display: block;
    font-size: 11px;
    margin-bottom: 4px;
  }
}

.date-picker {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 14px;
  background: var(--bg-color);
  outline: none;

  &:focus {
    border-color: var(--primary);
  }
}

.radio-group {
  display: flex;
  gap: 16px;
}

.radio-option {
  display: flex;
  font-size: 14px;
  align-items: center;
  cursor: pointer;
  gap: 6px;

  input[type='radio'] {
    accent-color: var(--primary);
  }
}

.tags-filter {
  .tags-input-wrapper {
    position: relative;
    margin-bottom: 12px;
  }

  .tags-input {
    display: flex;
    gap: 8px;
  }

  .tag-input {
    padding: 8px 12px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-size: 14px;
    background: var(--bg-color);
    flex: 1;
    outline: none;

    &:focus {
      border-color: var(--primary);
    }
  }

  .add-tag-btn {
    display: flex;
    padding: 8px 12px;
    border: none;
    border-radius: 6px;
    color: white;
    background: var(--primary);
    transition: background-color 0.2s ease;
    align-items: center;
    cursor: pointer;
    justify-content: center;

    &:hover {
      background: var(--primary-dark, #0056b3);
    }
  }
}

.tag-suggestions {
  top: 100%;
  right: 48px;
  left: 0;
  z-index: 10;
  max-height: 200px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-color);
  box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
  overflow-y: auto;
}

.tag-suggestion {
  padding: 8px 12px;
  font-size: 14px;
  transition: background 0.2s ease;
  cursor: pointer;

  &:hover,
  &.selected {
    background: var(--border-color);
  }

  &:first-child {
    border-radius: 6px 6px 0 0;
  }

  &:last-child {
    border-radius: 0 0 6px 6px;
  }
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag-chip {
  display: inline-flex;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  background: var(--border-color);
  align-items: center;
  gap: 4px;

  .remove-tag {
    display: flex;
    width: 16px;
    height: 16px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: none;
    align-items: center;
    cursor: pointer;
    justify-content: center;

    &:hover {
      color: white;
    }
  }
}

.category-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 14px;
  background: var(--bg-color);
  outline: none;

  &:focus {
    border-color: var(--primary);
  }
}

.filter-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.clear-filters-btn,
.apply-filters-btn {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  flex: 1;
}

.clear-filters-btn {
  background: var(--border-color);

  &:hover {
    background: var(--selection-color);
  }
}

.apply-filters-btn {
  color: white;
  background: var(--primary);

  &:hover {
    background: var(--primary-dark, #0056b3);
  }
}

.search-results {
  position: relative;
  min-height: 0;
  flex: 1;
  -webkit-overflow-scrolling: touch;
  overflow-y: auto;
  overscroll-behavior: contain;
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

.search-results-list {
  max-height: 100%;
  padding: 8px 0;
  overflow-y: auto;
}

.document-item {
  display: flex;
  margin: 0 5px;
  padding: 12px 20px;
  border-radius: 8px;
  align-items: center;
  cursor: pointer;
  gap: 12px;

  &:hover {
    background: var(--border-color);
  }
}

.document-icon {
  width: 20px;
  height: 20px;
  color: var(--primary);
  flex-shrink: 0;
}

.document-info {
  min-width: 0;
  flex: 1;
}

.document-title {
  font-weight: 600;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.document-meta {
  display: flex;
  font-size: 12px;
  gap: 12px;
  margin-bottom: 6px;
}

.document-category {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  background: var(--border-color);
}

.document-date {
  font-family: monospace;
}

.document-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.tag {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  color: white;
  background: var(--primary);
}

.navigate-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}
</style>
