<template>
  <Teleport to="body">
    <div v-if="isOpen" class="global-search-overlay" @click="closeSearch">
      <div class="global-search-modal" @click.stop>
        <!-- Header -->
        <div class="search-header">
          <div class="search-input-wrapper">
            <Icon name="search" class="search-icon" fill="var(--font-color)" />
            <input ref="searchInput" v-model="searchQuery" type="text" placeholder="Search for a page, action, or document..." class="search-input" @keydown="handleSearchKeydown" />
          </div>
          <button class="close-btn" @click="closeSearch">
            <Icon name="close" />
          </button>
        </div>

        <!-- Results -->
        <div class="search-results">
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
                </div>
                <Icon name="new_tab" class="navigate-icon" />
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="search-footer">
          <div class="shortcuts"><kbd>↑↓</kbd> Navigate <kbd>Enter</kbd> Select <kbd>Escape</kbd> Close</div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import CreateCategoryModal from '~/pages/dashboard/categories/_modals/CreateCategoryModal.vue';
import { quickActions, availablePages, type SearchResult, type BaseCommand } from '@/helpers/navigation';

const router = useRouter();
const isOpen = ref(false);
const documentsStore = useDocumentsStore();
const searchQuery = ref('');
const selectedIndex = ref(0);
const searchInput = ref<HTMLInputElement>();

// *********** Utils ***********
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

// ******** Filtered data ***********
const filteredActions = computed(() => filterByTokens(quickActions, a => `${a.title} ${a.description}`));

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
    })),
);

const filteredPages = computed(() => filterByTokens(availablePages, p => `${p.title} ${p.description} ${p.category}`));

// ******** Flattened results ********
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

// ******** Lifecycle ********
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

// --- Methods ---
function openSearch() {
  isOpen.value = true;
  selectedIndex.value = 0;
  searchQuery.value = '';
  nextTick(() => searchInput.value?.focus());
}

function closeSearch() {
  isOpen.value = false;
  searchQuery.value = '';
  selectedIndex.value = 0;
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
    navigateTo(flattenedItems.value[selectedIndex.value]?.path);
    closeSearch();
  }
}

defineExpose({ openSearch, closeSearch });

watch(searchQuery, () => {
  selectedIndex.value = 0;
});
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
.search-results {
  max-height: calc(80vh - 160px);
  overflow-y: auto;
}
.quick-actions {
  padding: 20px;
  h3 {
    margin: 0 0 16px 0;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}
.quick-actions-grid {
  display: grid;
  gap: 8px;
}
.quick-action-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  &:hover {
    background: var(--border-color);
  }
  &:active {
    transform: scale(0.98);
  }
}
.action-icon {
  width: 20px;
  height: 20px;
  color: var(--primary);
  flex-shrink: 0;
}
.action-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.action-title {
  font-weight: 600;
  color: var(--text-color);
}
.action-description {
  font-size: 13px;
  color: var(--text-muted);
}
.shortcut {
  background: var(--border-color);
  color: var(--text-muted);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-family: monospace;
  font-weight: 600;
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
}
</style>
