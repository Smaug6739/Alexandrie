<template>
  <Teleport to="body">
    <div v-if="isOpen" class="command-center-overlay" @click="closeSearch">
      <div class="command-center-modal">
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

        <!-- Tab Navigation -->
        <TabNavigation :active-tab="activeTab" @change-tab="changeTab" />

        <!-- Tab Content -->
        <div class="tab-content">
          <QuickSearchTab v-if="activeTab === 'quick'" ref="quickSearchTab" :search-query="searchQuery" :selected-index="selectedIndex" :documents="documentsStore.getAll" @select-item="closeSearch" @update-selected-index="updateSelectedIndex" />

          <AdvancedSearchTab v-else-if="activeTab === 'advanced'" :documents="documentsStore.getAll" @select-document="handleDocumentSelect" />
        </div>

        <!-- Footer -->
        <div class="search-footer">
          <div class="shortcuts"><kbd>↑↓</kbd> or <kbd>Tab</kbd>Navigate <kbd>Enter</kbd> Select <kbd>⇄</kbd> Switch tabs <kbd>Escape</kbd> Close</div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import CreateCategoryModal from '~/pages/dashboard/categories/_modals/CreateCategoryModal.vue';
import TabNavigation from './TabNavigation.vue';
import QuickSearchTab from './QuickSearchTab.vue';
import AdvancedSearchTab from './AdvancedSearchTab.vue';
import { useModal, Modal } from '~/composables/ModalBus';
import type { Document } from '~/stores';

const router = useRouter();
const isOpen = ref(false);
const documentsStore = useDocumentsStore();
const searchQuery = ref('');
const selectedIndex = ref(0);
const activeTab = ref('quick');
const searchInput = ref<HTMLInputElement>();
const quickSearchTab = ref();

// *********** Lifecycle ***********
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
    } else if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && isOpen.value) {
      e.preventDefault();
      changeTab(activeTab.value === 'quick' ? 'advanced' : 'quick');
    }
  };

  const handleWheel = (e: WheelEvent) => {
    if (isOpen.value) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isOpen.value) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  document.addEventListener('keydown', handleGlobalKeydown);
  document.addEventListener('touchmove', handleTouchMove, { passive: false });
  const openListener = () => openSearch();
  window.addEventListener('command-center-open', openListener as EventListener);

  onUnmounted(() => {
    document.removeEventListener('keydown', handleGlobalKeydown);
    document.removeEventListener('wheel', handleWheel);
    document.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('command-center-open', openListener as EventListener);
  });
});

// --- Methods ---
function openSearch() {
  isOpen.value = true;
  selectedIndex.value = 0;
  searchQuery.value = '';
  activeTab.value = 'quick';
  nextTick(() => searchInput.value?.focus());
}

function closeSearch(e?: MouseEvent) {
  if (e && e.target && (e.target as Element).closest('.command-center-modal')) return;
  isOpen.value = false;
  searchQuery.value = '';
  selectedIndex.value = 0;
  document.body.style.overflow = '';
}

function changeTab(tabId: string) {
  activeTab.value = tabId;
  selectedIndex.value = 0;
  if (tabId === 'quick') {
    nextTick(() => searchInput.value?.focus());
  }
}

function updateSelectedIndex(index: number) {
  selectedIndex.value = index;
}

function handleDocumentSelect(document: Document) {
  navigateTo(`/dashboard/docs/${document.id}`);
  closeSearch();
}

function handleSearchKeydown(e: KeyboardEvent) {
  if (activeTab.value === 'advanced') {
    return;
  }

  if ((e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) && selectedIndex.value < (quickSearchTab.value?.flattenedItems?.length || 0) - 1) {
    e.preventDefault();
    const maxIndex = (quickSearchTab.value?.flattenedItems?.length || 0) - 1;
    selectedIndex.value = (selectedIndex.value + 1) % Math.max(maxIndex + 1, 1);
  } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey && selectedIndex.value > 0)) {
    e.preventDefault();
    const maxIndex = (quickSearchTab.value?.flattenedItems?.length || 0) - 1;
    selectedIndex.value = (selectedIndex.value - 1 + Math.max(maxIndex + 1, 1)) % Math.max(maxIndex + 1, 1);
  } else if (e.key === 'Enter' && quickSearchTab.value?.flattenedItems?.length > 0) {
    e.preventDefault();
    const selectedItem = quickSearchTab.value.flattenedItems[selectedIndex.value];
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
</script>

<style scoped lang="scss">
.command-center-overlay {
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

.command-center-modal {
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 92%;
  max-width: 720px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: auto;
  animation: slideIn 0.2s ease-out;
  position: relative;
}

.search-header {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
  gap: 12px;
  flex-shrink: 0;
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
}

.search-input {
  width: 100%;
  padding: 12px 12px 12px 44px;
  border: none;
  background: transparent;
  font-size: 16px;
  outline: none;

  &::placeholder {
  }
}

.close-btn {
  background: transparent;
  border: none;

  cursor: pointer;
  padding: 8px;
  border-radius: 8px;

  &:hover {
    background: var(--border-color);
  }
}

.tab-content {
  flex: 1;
  overflow: auto;
  min-height: 0;
  position: relative;
}

.search-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--border-color);
  background: var(--bg-color-secondary);
  flex-shrink: 0;
}

.shortcuts {
  display: flex;
  gap: 10px;
  font-size: 13px;
  font-weight: 500;

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
  .command-center-modal {
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
