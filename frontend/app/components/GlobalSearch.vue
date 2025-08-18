<template>
  <Teleport to="body">
    <Transition name="search-modal">
      <div v-if="isOpen" class="global-search-overlay" @click="closeSearch">
        <div class="global-search-modal" @click.stop>
          <div class="search-header">
            <div class="search-input-wrapper">
              <Icon name="search" class="search-icon" />
              <input ref="searchInput" v-model="searchQuery" type="text" placeholder="Search for a page or action..." class="search-input" @keydown="handleKeydown" @input="filterResults" />
            </div>
            <button class="close-btn" @click="closeSearch">
              <Icon name="close" />
            </button>
          </div>

          <div class="search-results">
            <div v-if="searchQuery && filteredResults.length === 0" class="no-results">
              <Icon name="search" class="no-results-icon" />
              <p>No results found for "{{ searchQuery }}"</p>
            </div>

            <div v-else-if="!searchQuery" class="quick-actions">
              <h3>Quick Actions</h3>
              <div class="quick-actions-grid">
                <button v-for="action in quickActions" :key="action.id" class="quick-action-btn" @click="executeAction(action)">
                  <Icon :name="action.icon" class="action-icon" />
                  <div class="action-content">
                    <span class="action-title">{{ action.title }}</span>
                    <span class="action-description">{{ action.description }}</span>
                  </div>
                  <kbd class="shortcut">{{ action.shortcut }}</kbd>
                </button>
              </div>
            </div>

            <div v-else class="search-results-list">
              <div v-for="(result, index) in filteredResults" :key="result.id" class="search-result-item" :class="{ selected: index === selectedIndex }" @click="navigateTo(result)" @mouseenter="selectedIndex = index">
                <Icon :name="result.icon" class="result-icon" />
                <div class="result-content">
                  <span class="result-title">{{ result.title }}</span>
                  <span class="result-description">{{ result.description }}</span>
                </div>
                <Icon name="new_tab" class="navigate-icon" />
              </div>
            </div>
          </div>

          <div class="search-footer">
            <div class="shortcuts"><kbd>↑↓</kbd> Navigate <kbd>Enter</kbd> Select <kbd>Escape</kbd> Close</div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { Icon } from '#components';
import CreateCategoryModal from '@/pages/dashboard/categories/_modals/CreateCategoryModal.vue';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
  category: string;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  shortcut: string;
  action: () => void;
}

const router = useRouter();
const isOpen = ref(false);
const searchQuery = ref('');
const selectedIndex = ref(0);
const searchInput = ref<HTMLInputElement>();

const availablePages: SearchResult[] = [
  {
    id: 'home',
    title: 'Home',
    description: 'Main dashboard',
    icon: 'dashboard',
    path: '/dashboard',
    category: 'Navigation',
  },
  {
    id: 'docs',
    title: 'Documents',
    description: 'Manage your documents',
    icon: 'file',
    path: '/dashboard/docs',
    category: 'Management',
  },
  {
    id: 'categories',
    title: 'Categories',
    description: 'Organize your categories',
    icon: 'categories',
    path: '/dashboard/categories',
    category: 'Management',
  },
  {
    id: 'cdn',
    title: 'CDN',
    description: 'Manage your resources',
    icon: 'cdn',
    path: '/dashboard/cdn',
    category: 'Management',
  },
  {
    id: 'import',
    title: 'Import',
    description: 'Import documents',
    icon: 'import',
    path: '/dashboard/import',
    category: 'Actions',
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Configure the application',
    icon: 'settings',
    path: '/dashboard/settings',
    category: 'Configuration',
  },
  {
    id: 'admin',
    title: 'Administration',
    description: 'Manage users',
    icon: 'users',
    path: '/dashboard/admin',
    category: 'Administration',
  },
];

const filteredResults = ref<SearchResult[]>([]);

const quickActions: QuickAction[] = [
  {
    id: 'new-doc',
    title: 'New document',
    description: 'Create a new document',
    icon: 'add_file',
    shortcut: 'Ctrl+N',
    action: () => router.push('/dashboard/docs/new'),
  },
  {
    id: 'new-category',
    title: 'New category',
    description: 'Create a new category',
    icon: 'add_folder',
    shortcut: 'Ctrl+Shift+N',
    action: () => router.push('/dashboard/categories'),
  },
  {
    id: 'search-docs',
    title: 'Search in docs',
    description: 'Search in your documents',
    icon: 'search',
    shortcut: 'Ctrl+q',
    action: () => router.push('/dashboard/docs'),
  },
  {
    id: 'upload-file',
    title: 'Upload file',
    description: 'Add a resource to CDN',
    icon: 'import',
    shortcut: 'Ctrl+U',
    action: () => router.push('/dashboard/cdn'),
  },
];

onMounted(() => {
  const handleKeydown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u') {
      e.preventDefault();
      router.push('/dashboard/cdn');
    } else if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === 'n') {
      e.preventDefault();
      useModal().add(new Modal(shallowRef(CreateCategoryModal), { role: 1 }));
    }

    if (e.key === 'Escape' && isOpen.value) {
      closeSearch();
    }
  };

  document.addEventListener('keydown', handleKeydown);
  const openListener = () => openSearch();
  window.addEventListener('global-search-open', openListener as EventListener);

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown);
    window.removeEventListener('global-search-open', openListener as EventListener);
  });
});

function openSearch() {
  isOpen.value = true;
  selectedIndex.value = 0;
  searchQuery.value = '';
  nextTick(() => {
    searchInput.value?.focus();
  });
}

function closeSearch() {
  isOpen.value = false;
  searchQuery.value = '';
  selectedIndex.value = 0;
}

function filterResults() {
  if (!searchQuery.value.trim()) {
    filteredResults.value = [];
    return;
  }

  const query = searchQuery.value.toLowerCase();
  filteredResults.value = availablePages.filter(page => page.title.toLowerCase().includes(query) || page.description.toLowerCase().includes(query) || page.category.toLowerCase().includes(query));

  selectedIndex.value = 0;
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    selectedIndex.value = (selectedIndex.value + 1) % Math.max(filteredResults.value.length, 1);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    selectedIndex.value = selectedIndex.value === 0 ? Math.max(filteredResults.value.length - 1, 0) : selectedIndex.value - 1;
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (filteredResults.value.length > 0) {
      navigateTo(filteredResults.value[selectedIndex.value]!);
    }
  }
}

function navigateTo(result: SearchResult) {
  router.push(result.path);
  closeSearch();
}

function executeAction(action: QuickAction) {
  action.action();
  closeSearch();
}

defineExpose({
  openSearch,
  closeSearch,
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
  backdrop-filter: blur(8px);
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
  width: 90%;
  max-width: 600px;
  max-height: 70vh;
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
  max-height: 400px;
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
  gap: 12px;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.2s ease;

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
  gap: 2px;
}

.result-title {
  font-weight: 600;
  color: var(--text-color);
}

.result-description {
  font-size: 13px;
  color: var(--text-muted);
}

.navigate-icon {
  width: 16px;
  height: 16px;
  color: var(--text-muted);
  flex-shrink: 0;
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

.search-modal-enter-active,
.search-modal-leave-active {
  transition: all 0.2s ease;
}

.search-modal-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.search-modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
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
