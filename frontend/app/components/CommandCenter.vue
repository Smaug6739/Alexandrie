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
  z-index: 9999;
  display: flex;
  background: rgb(0 0 0 / 50%);
  align-items: flex-start;
  backdrop-filter: blur(2px);
  inset: 0;
  justify-content: center;
  padding-top: 10vh;
}

.global-search-modal {
  width: 92%;
  max-width: 720px;
  max-height: 80vh;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  background: var(--bg-color);
  box-shadow: 0 20px 60px rgb(0 0 0 / 30%);
  animation: slide-in 0.2s ease-out;
  overflow: hidden;
}

.search-header {
  display: flex;
  padding: 20px;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  gap: 12px;
}

.search-input-wrapper {
  position: relative;
  flex: 1;
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 12px;
  width: 20px;
  height: 20px;
  color: var(--text-muted);
  transform: translateY(-50%);
}

.search-input {
  width: 100%;
  padding: 12px 12px 12px 44px;
  border: none;
  font-size: 16px;
  color: var(--text-color);
  background: transparent;
  outline: none;

  &::placeholder {
    color: var(--text-muted);
  }
}

.close-btn {
  padding: 8px;
  border: none;
  border-radius: 8px;
  color: var(--text-muted);
  background: transparent;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    color: var(--text-color);
    background: var(--border-color);
  }
}

.search-results {
  max-height: calc(80vh - 160px);
  overflow-y: auto;
}

.quick-actions {
  padding: 20px;

  h3 {
    margin: 0 0 16px;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-muted);
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
}

.quick-actions-grid {
  display: grid;
  gap: 8px;
}

.quick-action-btn {
  display: flex;
  padding: 12px;
  border: none;
  border-radius: 8px;
  text-align: left;
  background: transparent;
  transition: all 0.2s ease;
  align-items: center;
  cursor: pointer;
  gap: 12px;

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
  display: flex;
  flex: 1;
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
  padding: 4px 8px;
  border-radius: 6px;
  font-family: monospace;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  background: var(--border-color);
}

.search-results-list {
  padding: 8px 0;
}

.search-result-item {
  display: flex;
  margin: 0 5px;
  padding: 8px 20px;
  border-radius: 8px;
  align-items: center;
  cursor: pointer;
  gap: 10px;

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
  color: var(--text-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-description {
  font-size: 13px;
  color: var(--text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  z-index: 1;
  padding: 6px 20px;
  font-size: 12px;
  color: var(--text-muted);
  background: var(--bg-color);
  text-transform: uppercase;
}

.no-results {
  padding: 40px 20px;
  color: var(--text-muted);
  text-align: center;

  .no-results-icon {
    width: 48px;
    height: 48px;
    opacity: 0.5;
    margin-bottom: 16px;
  }

  p {
    margin: 0;
    font-size: 14px;
  }
}

.search-footer {
  padding: 16px 20px;
  background: var(--bg-color-secondary);
  border-top: 1px solid var(--border-color);
}

.shortcuts {
  display: flex;
  font-size: 12px;
  color: var(--text-muted);
  gap: 16px;

  kbd {
    padding: 2px 6px;
    border-radius: 4px;
    font-family: monospace;
    font-weight: 600;
    background: var(--border-color);
  }
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (width <= 768px) {
  .global-search-modal {
    width: 95%;
    max-height: 80vh;
    margin: 20px;
  }

  .shortcuts {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
