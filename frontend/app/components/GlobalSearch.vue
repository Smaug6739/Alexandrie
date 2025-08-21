<template>
  <Teleport to="body">
    <div v-if="isOpen" class="global-search-overlay" @click="closeSearch">
      <div class="global-search-modal" @click.stop>
        <div class="search-header">
          <div class="search-input-wrapper">
            <Icon name="search" class="search-icon" fill="var(--font-color)" />
            <input ref="searchInput" v-model="searchQuery" type="text" placeholder="Search for a page, action, document, or file..." class="search-input" @keydown="handleSearchKeydown" />
          </div>
          <button class="close-btn" @click="closeSearch">
            <Icon name="close" />
          </button>
        </div>

        <div class="search-tabs">
          <button 
            v-for="tab in searchTabs" 
            :key="tab.id"
            :class="['search-tab', { active: activeTab === tab.id }]"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>

        <div v-if="activeTab === 'advanced'" class="advanced-filters">
          <div class="filters-header" @click="toggleFilters">
            <div class="filters-title">
              <span>Advanced Filters</span>
              <div v-if="getActiveFiltersCount() > 0" class="active-indicator">
                {{ getActiveFiltersCount() }}
              </div>
              <Icon :name="filtersExpanded ? 'collapse' : 'expand'" class="expand-icon" />
            </div>
            <div v-if="getActiveFiltersCount() > 0" class="filters-status">
              Filters active - {{ getActiveFiltersCount() }} applied
            </div>
            <div v-if="getActiveFiltersCount() === 0" class="filters-status inactive">
              No filters applied
            </div>
          </div>
          
          <div v-if="filtersExpanded" class="filters-content">
            <div class="filter-row">
              <div class="filter-group">
                <label>
                  <Icon name="file" class="filter-label-icon" />
                  File Type
                </label>
                <select v-model="filters.fileType" class="filter-select">
                  <option value="">All types</option>
                  <option value="image">Images</option>
                  <option value="pdf">PDFs</option>
                  <option value="document">Documents</option>
                  <option value="archive">Archives</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div class="filter-group">
                <label>
                  <Icon name="calendar" class="filter-label-icon" />
                  Date Range
                </label>
                <select v-model="filters.dateRange" class="filter-select">
                  <option value="">All time</option>
                  <option value="today">Today</option>
                  <option value="week">This week</option>
                  <option value="month">This month</option>
                  <option value="year">This year</option>
                  <option value="custom">Custom range</option>
                </select>
              </div>
            </div>
            <div v-if="filters.dateRange === 'custom'" class="filter-row">
              <div class="filter-group">
                <label>From</label>
                <input v-model="filters.dateFrom" type="date" class="filter-input" />
              </div>
              <div class="filter-group">
                <label>To</label>
                <input v-model="filters.dateTo" type="date" class="filter-input" />
              </div>
            </div>
            <div class="filter-actions">
              <button class="clear-filters-btn" @click="clearFilters">
                <Icon name="close" class="clear-icon" />
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        <div class="search-results">
          <div v-if="searchQuery" class="search-stats">
            <span class="results-count">{{ flattenedItems.length }} result{{ flattenedItems.length !== 1 ? 's' : '' }}</span>
            <span v-if="activeTab === 'advanced' && getActiveFiltersCount() > 0" class="active-filters">
              {{ getActiveFiltersCount() }} filter{{ getActiveFiltersCount() !== 1 ? 's' : '' }} active
            </span>
            <span v-if="activeTab === 'advanced' && getActiveFiltersCount() === 0" class="no-filters">
              No filters applied
            </span>
          </div>
          
          <div v-if="searchQuery && flattenedItems.length === 0" class="no-results">
            <Icon fill="var(--font-color)" name="search" class="no-results-icon" />
            <p>No results found for "{{ searchQuery }}"</p>
          </div>

          <div v-else class="search-results-list">
            <div v-for="(items, section) in groupedResults" :key="section" class="section">
              <div class="section-title">{{ section }}</div>
              <NuxtLink v-for="item in items" :key="item.id" class="search-result-item" :to="item.path" :class="{ selected: selectedIndex === item.globalIndex }" @click="closeSearch" @mouseenter="selectedIndex = item.globalIndex">
                <Icon :name="item.icon" class="result-icon" fill="var(--font-color)" />
                <div class="result-content">
                  <span class="result-title">{{ item.title }}</span>
                  <span class="result-description">{{ item.description }}</span>
                  <span v-if="item.metadata" class="result-metadata">{{ item.metadata }}</span>
                </div>
                <Icon name="new_tab" class="navigate-icon" />
              </NuxtLink>
            </div>
          </div>
        </div>

        <div class="search-footer">
          <div class="shortcuts">
            <kbd>↑↓</kbd> Navigate 
            <kbd>Enter</kbd> Select 
            <kbd>Tab</kbd> Switch tabs
            <kbd>Escape</kbd> Close
          </div>
                  <div v-if="activeTab === 'advanced'" class="advanced-hint">
          <Icon name="search" class="hint-icon" />
          <span>Use filters to narrow down file search results. Files will show based on your filter selections.</span>
          <div v-if="getActiveFiltersCount() > 0" class="debug-info">
            Debug: {{ getActiveFiltersCount() }} filters active
            <br>File type: {{ filters.fileType || 'none' }}
            <br>Date range: {{ filters.dateRange || 'none' }}
          </div>
        </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import CreateCategoryModal from '~/pages/dashboard/categories/_modals/CreateCategoryModal.vue';
import { availablePages, type SearchResult, type BaseCommand } from '@/helpers/navigation';

const router = useRouter();
const isOpen = ref(false);
const documentsStore = useDocumentsStore();
const ressourcesStore = useRessourcesStore();
const searchQuery = ref('');
const selectedIndex = ref(0);
const searchInput = ref<HTMLInputElement>();
const activeTab = ref('all');
const filtersExpanded = ref(true);

const searchTabs = [
  { id: 'all', label: 'All' },
  { id: 'advanced', label: 'Advanced' }
];

const filters = ref({
  fileType: '',
  dateRange: '',
  dateFrom: '',
  dateTo: ''
});

function tokenize(text: string) {
  return text.trim().toLowerCase().split(/\s+/).filter(Boolean);
}

function matchesTokens(haystack: string, tokens: string[]) {
  const value = haystack.toLowerCase();
  return tokens.every(t => value.includes(t));
}

function filterByTokens<T>(items: T[], getText: (item: T) => string): T[] {
  const tokens = tokenize(searchQuery.value);
  if (tokens.length === 0) return items;
  return items.filter(item => matchesTokens(getText(item), tokens));
}

function getFileTypeIcon(filetype: string): string {
  if (filetype.startsWith('image/')) return 'image';
  if (filetype === 'application/pdf') return 'pdf';
  if (filetype.includes('document') || filetype.includes('text') || filetype.includes('plain')) return 'file_text';
  if (filetype.includes('zip') || filetype.includes('rar') || filetype.includes('tar') || filetype.includes('7z') || filetype.includes('gz')) return 'archive';
  return 'file';
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function formatDate(timestamp: string): string {
  const date = new Date(parseInt(timestamp));
  return date.toLocaleDateString();
}

function isInDateRange(timestamp: string): boolean {
  if (!filters.value.dateRange || filters.value.dateRange === '' || filters.value.dateRange === 'all') return true;
  
  const date = new Date(parseInt(timestamp));
  const now = new Date();
  
  switch (filters.value.dateRange) {
    case 'today':
      return date.toDateString() === now.toDateString();
    case 'week':
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return date >= weekAgo;
    case 'month':
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return date >= monthAgo;
    case 'year':
      const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      return date >= yearAgo;
    case 'custom':
      if (filters.value.dateFrom && filters.value.dateTo) {
        const from = new Date(filters.value.dateFrom);
        const to = new Date(filters.value.dateTo);
        return date >= from && date <= to;
      }
      return true;
    default:
      return true;
  }
}



const filteredDocuments = computed<SearchResult[]>(() =>
  filterByTokens(documentsStore.getAll, d => {
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
      metadata: `Updated ${formatDate(d.updated_timestamp)}`
    })),
);

const filteredPages = computed(() => filterByTokens(availablePages, p => `${p.title} ${p.description} ${p.category}`));

const filteredFiles = computed(() => {
  let files = ressourcesStore.getAll;
  
  if (filters.value.fileType && filters.value.fileType !== '') {
    files = files.filter(f => {
      switch (filters.value.fileType) {
        case 'image':
          return f.filetype.startsWith('image/');
        case 'pdf':
          return f.filetype === 'application/pdf';
        case 'document':
          return f.filetype.includes('document') || f.filetype.includes('text') || f.filetype.includes('plain');
        case 'archive':
          return f.filetype.includes('zip') || f.filetype.includes('rar') || f.filetype.includes('tar') || f.filetype.includes('7z') || f.filetype.includes('gz');
        case 'other':
          return !f.filetype.startsWith('image/') && f.filetype !== 'application/pdf' && 
                 !f.filetype.includes('document') && !f.filetype.includes('text') && !f.filetype.includes('plain') &&
                 !f.filetype.includes('zip') && !f.filetype.includes('rar') && !f.filetype.includes('tar') && 
                 !f.filetype.includes('7z') && !f.filetype.includes('gz');
        default:
          return true;
      }
    });
  }
  
  if (filters.value.dateRange && filters.value.dateRange !== '' && filters.value.dateRange !== 'all') {
    files = files.filter(f => isInDateRange(f.created_timestamp));
  }
  
  return files
    .slice(0, 20)
    .map(f => ({
      id: f.id,
      title: f.filename,
      description: f.filetype,
      icon: getFileTypeIcon(f.filetype),
      path: `/dashboard/cdn/${f.id}`,
      category: 'Files',
      metadata: `${formatFileSize(f.filesize)} • ${formatDate(f.created_timestamp)}`
    }));
});

interface FlattenedItem extends BaseCommand {
  section: string;
  globalIndex: number;
  metadata?: string;
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
    filteredPages.value.map(p => ({
      id: `page-${p.id}`,
      icon: p.icon,
      title: p.title,
      description: p.description,
      path: p.path,
    })),
    'Pages',
  );

  pushWithIndex(
    filteredDocuments.value.map(d => ({
      id: `doc-${d.id}`,
      icon: d.icon,
      title: d.title,
      description: d.description,
      path: d.path,
      metadata: d.metadata
    })),
    'Documents',
  );

  if (activeTab.value === 'advanced') {
    const filteredFilesList = filteredFiles.value;
    if (filteredFilesList.length > 0) {
      pushWithIndex(
        filteredFilesList.map(f => ({
          id: `file-${f.id}`,
          icon: f.icon,
          title: f.title,
          description: f.description,
          path: f.path,
          metadata: f.metadata
        })),
        'Files',
      );
    }
  } else if (activeTab.value === 'all') {
    const allFiles = ressourcesStore.getAll
      .slice(0, 5)
      .map(f => ({
        id: `file-${f.id}`,
        icon: getFileTypeIcon(f.filetype),
        title: f.filename,
        description: f.filetype,
        path: `/dashboard/cdn/${f.id}`,
        metadata: `${formatFileSize(f.filesize)} • ${formatDate(f.created_timestamp)}`
      }));
    
    pushWithIndex(allFiles, 'Files');
  }

  return items;
});

const groupedResults = computed(() => {
  return flattenedItems.value.reduce((acc, item) => {
    (acc[item.section] ||= []).push(item);
    return acc;
  }, {} as Record<string, typeof flattenedItems.value>);
});

onMounted(() => {
  const handleGlobalKeydown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u') {
      e.preventDefault();
      router.push('/dashboard/cdn');
    } else if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === 'n') {
      e.preventDefault();
      useModal().add(new Modal(shallowRef(CreateCategoryModal), { role: 1 }));
    } else if (e.key === 'Escape' && isOpen.value) {
      closeSearch();
    } else if (e.key === 'Tab' && isOpen.value) {
      e.preventDefault();
      const currentIndex = searchTabs.findIndex(tab => tab.id === activeTab.value);
      const nextIndex = (currentIndex + 1) % searchTabs.length;
      if (searchTabs[nextIndex]) {
        activeTab.value = searchTabs[nextIndex].id;
      }
    }
  };

  document.addEventListener('keydown', handleGlobalKeydown);
  const openListener = () => openSearch();
  window.addEventListener('global-search-open', openListener as EventListener);

  onUnmounted(() => {
    document.removeEventListener('keydown', handleGlobalKeydown);
    window.removeEventListener('global-search-open', openListener as EventListener);
  });
});

function openSearch() {
  isOpen.value = true;
  selectedIndex.value = 0;
  searchQuery.value = '';
  activeTab.value = 'all';
  filtersExpanded.value = true;
  filters.value = {
    fileType: '',
    dateRange: '',
    dateFrom: '',
    dateTo: ''
  };
  nextTick(() => searchInput.value?.focus());
}

function closeSearch() {
  isOpen.value = false;
  searchQuery.value = '';
  selectedIndex.value = 0;
  activeTab.value = 'all';
}

function toggleFilters() {
  filtersExpanded.value = !filtersExpanded.value;
}

function clearFilters() {
  filters.value = {
    fileType: '',
    dateRange: '',
    dateFrom: '',
    dateTo: ''
  };
}

function getActiveFiltersCount(): number {
  let count = 0;
  if (filters.value.fileType && filters.value.fileType !== '') count++;
  if (filters.value.dateRange && filters.value.dateRange !== '' && filters.value.dateRange !== 'all') count++;
  if (filters.value.dateFrom && filters.value.dateTo) count++;
  return count;
}

function handleSearchKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey && selectedIndex.value < flattenedItems.value.length - 1)) {
    e.preventDefault();
    selectedIndex.value = (selectedIndex.value + 1) % flattenedItems.value.length;
  } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey && selectedIndex.value > 0)) {
    e.preventDefault();
    selectedIndex.value = (selectedIndex.value - 1 + flattenedItems.value.length) % flattenedItems.value.length;
  } else if (e.key === 'Enter' && flattenedItems.value.length > 0) {
    e.preventDefault();
    const selectedItem = flattenedItems.value[selectedIndex.value];
    if (selectedItem) {
      navigateTo(selectedItem.path);
      closeSearch();
    }
  }
}

defineExpose({ openSearch, closeSearch });

watch(searchQuery, () => {
  selectedIndex.value = 0;
});

watch(activeTab, () => {
  selectedIndex.value = 0;
});

watch(filters, () => {
  selectedIndex.value = 0;
}, { deep: true });
</script>

<style scoped lang="scss">
.global-search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  z-index: 9999;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 10vh;
}

.global-search-modal {
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 92%;
  max-width: 720px;
  max-height: 80vh;
  overflow: hidden;
  animation: slideIn 0.2s ease-out;
}

.search-header {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
  gap: 12px;
}

.search-input-wrapper {
  flex: 1;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: var(--text-muted);
}

.search-input {
  width: 100%;
  padding: 12px 12px 12px 44px;
  border: none;
  background: transparent;
  color: var(--text-color);
  font-size: 16px;
  outline: none;
  &::placeholder {
    color: var(--text-muted);
  }
}

.close-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  &:hover {
    background: var(--border-color);
    color: var(--text-color);
  }
}

.search-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-color-secondary);
}

.search-tab {
  flex: 1;
  padding: 12px 16px;
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;
  position: relative;
  
  &:hover {
    color: var(--text-color);
    background: var(--border-color);
  }
  
  &.active {
    color: var(--primary);
    background: var(--bg-color);
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--primary);
      animation: slideIn 0.3s ease-out;
    }
  }
}

.advanced-filters {
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-color-secondary);
}

.filters-header {
  padding: 16px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 0;
  
  &:hover {
    background: var(--border-color);
    
    .filters-title .expand-icon {
      transform: scale(1.1);
      color: var(--primary);
    }
  }
}

.filters-title {
  display: flex;
  align-items: center;
  gap: 8px;
  

  
  span {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-color);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .expand-icon {
    width: 16px;
    height: 16px;
    color: var(--text-muted);
    margin-left: auto;
    transition: transform 0.3s ease;
  }
  
  .active-indicator {
    background: var(--primary);
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 600;
    margin-left: 8px;
    animation: pulse 2s infinite;
  }
}

.filters-status {
  font-size: 11px;
  color: var(--primary);
  font-weight: 500;
  margin-top: 4px;
  padding: 2px 8px;
  background: rgba(var(--primary-rgb), 0.1);
  border-radius: 8px;
  border: 1px solid rgba(var(--primary-rgb), 0.2);
  
  &.inactive {
    color: var(--text-muted);
    background: var(--border-color);
    border-color: var(--border-color);
  }
}

.filters-content {
  padding: 20px;
  border-top: 1px solid var(--border-color);
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    max-height: 300px;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}

.filter-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.filter-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-group label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 6px;
  
  .filter-label-icon {
    width: 14px;
    height: 14px;
    color: var(--text-muted);
  }
}

.filter-select,
.filter-input {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-color);
  color: var(--text-color);
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
  
  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
  }
  
  &:hover {
    border-color: var(--text-muted);
  }
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.clear-filters-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--border-color);
    color: var(--text-color);
    border-color: var(--text-muted);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  .clear-icon {
    width: 12px;
    height: 12px;
  }
}

.search-results {
  max-height: calc(80vh - 200px);
  overflow-y: auto;
}

.search-stats {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: var(--bg-color-secondary);
  border-bottom: 1px solid var(--border-color);
  font-size: 12px;
  
  .results-count {
    color: var(--text-color);
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;
    
    &::before {
      content: '🔍';
      font-size: 14px;
    }
  }
  
  .active-filters {
    color: var(--primary);
    font-weight: 500;
    background: rgba(var(--primary-rgb), 0.1);
    padding: 4px 8px;
    border-radius: 12px;
    border: 1px solid rgba(var(--primary-rgb), 0.2);
  }
  
  .no-filters {
    color: var(--text-muted);
    font-weight: 500;
    background: var(--border-color);
    padding: 4px 8px;
    border-radius: 12px;
    border: 1px solid var(--border-color);
  }
  
  .debug-info {
    font-size: 11px;
    color: var(--text-muted);
    background: var(--border-color);
    padding: 8px;
    border-radius: 8px;
    margin-top: 8px;
    font-family: monospace;
    line-height: 1.4;
  }
}

.search-results-list {
  padding: 8px 0;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 20px;
  margin: 0 5px;
  border-radius: 8px;
  cursor: pointer;
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

.result-metadata {
  font-size: 11px;
  color: var(--text-muted);
  opacity: 0.8;
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

.search-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--border-color);
  background: var(--bg-color-secondary);
}

.shortcuts {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: var(--text-muted);
  kbd {
    background: var(--border-color);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: monospace;
    font-weight: 600;
  }
}

.advanced-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--border-color);
  font-size: 11px;
  color: var(--text-muted);
  
  .hint-icon {
    width: 12px;
    height: 12px;
    color: var(--primary);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 768px) {
  .global-search-modal {
    width: 95%;
    margin: 20px;
    max-height: 80vh;
  }
  
  .shortcuts {
    flex-direction: column;
    gap: 8px;
  }
  
  .filter-row {
    flex-direction: column;
    gap: 12px;
  }
  
  .search-tabs {
    flex-direction: column;
  }
}
</style>

