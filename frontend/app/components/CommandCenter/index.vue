<template>
  <Teleport to="body">
    <div v-if="isOpen" class="command-center-overlay" @click="closeSearch">
      <div class="command-center-modal">
        <!-- Header -->
        <div class="search-header">
          <div class="search-input-wrapper">
            <Icon name="search" class="search-icon" fill="var(--font-color)" />
            <input
              ref="searchInput"
              v-model="searchQuery"
              type="text"
              placeholder="Search for a page, action, or document..."
              class="search-input"
              @keydown="handleSearchKeydown"
            />
          </div>
          <button class="close-btn" @click="closeSearch">
            <Icon name="close" />
          </button>
        </div>

        <!-- Tab Navigation -->
        <TabNavigation :active-tab="activeTab" @change-tab="changeTab" />

        <!-- Tab Content -->
        <div class="tab-content">
          <QuickSearchTab
            v-if="activeTab === 'quick'"
            ref="quickSearchTab"
            :search-query="searchQuery"
            :selected-index="selectedIndex"
            @select-item="handleQuickSelect"
            @update-selected-index="updateSelectedIndex"
          />

          <AdvancedSearchTab
            v-else-if="activeTab === 'advanced'"
            ref="advancedSearchTab"
            :query="searchQuery"
            :selected-index="selectedIndex"
            @select-document="handleDocumentSelect"
            @update-selected-index="updateSelectedIndex"
          />
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
const searchQuery = ref('');
const selectedIndex = ref(0);
const activeTab = ref('quick');
const searchInput = ref<HTMLInputElement>();
const quickSearchTab = ref();
const advancedSearchTab = ref();

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
  if (
    e &&
    e.target &&
    (e.target as Element).closest('.command-center-modal') &&
    !(e.target as Element).classList.contains('close-btn') &&
    !(e.target as Element).closest('.search-results-list')
  )
    return;
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

function handleQuickSelect() {
  const selectedItem = quickSearchTab.value.flattenedItems[selectedIndex.value];
  if (selectedItem) {
    navigateTo(selectedItem.path);
    closeSearch();
  }
}

function handleDocumentSelect(document: Document) {
  navigateTo(`/dashboard/docs/${document.id}`);
  closeSearch();
}

function handleSearchKeydown(e: KeyboardEvent) {
  let items = [];
  if (activeTab.value === 'quick') {
    items = quickSearchTab.value?.flattenedItems || [];
  } else if (activeTab.value === 'advanced') {
    items = advancedSearchTab.value?.flattenedItems || [];
  }
  const maxIndex = items.length - 1;
  if ((e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) && selectedIndex.value < maxIndex) {
    e.preventDefault();
    selectedIndex.value = (selectedIndex.value + 1) % Math.max(maxIndex + 1, 1);
  } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey && selectedIndex.value > 0)) {
    e.preventDefault();
    selectedIndex.value = (selectedIndex.value - 1 + Math.max(maxIndex + 1, 1)) % Math.max(maxIndex + 1, 1);
  } else if (e.key === 'Enter' && items.length > 0) {
    e.preventDefault();
    if (activeTab.value === 'quick') {
      handleQuickSelect();
    } else if (activeTab.value === 'advanced') {
      const selectedItem = items[selectedIndex.value];
      if (selectedItem) {
        handleDocumentSelect(selectedItem);
      }
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
  z-index: 9999;
  display: flex;
  background: rgb(0 0 0 / 50%);
  align-items: flex-start;
  backdrop-filter: blur(2px);
  inset: 0;
  justify-content: center;
  padding-top: 10vh;
}

.command-center-modal {
  position: relative;
  display: flex;
  width: 92%;
  max-width: 720px;
  max-height: 80vh;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  background: var(--bg-color);
  box-shadow: 0 20px 60px rgb(0 0 0 / 30%);
  animation: slide-in 0.2s ease-out;
  flex-direction: column;
  overflow: auto;
}

.search-header {
  display: flex;
  padding: 20px;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
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
  transform: translateY(-50%);
}

.search-input {
  width: 100%;
  padding: 12px 12px 12px 44px;
  border: none;
  font-size: 16px;
  background: transparent;
  outline: none;
}

.close-btn {
  padding: 8px;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;

  &:hover {
    background: var(--border-color);
  }
}

.tab-content {
  position: relative;
  min-height: 0;
  flex: 1;
  overflow: auto;
}

.search-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--border-color);
  flex-shrink: 0;
}

.shortcuts {
  display: flex;
  font-size: 13px;
  font-weight: 500;
  flex-wrap: wrap;
  gap: 10px;
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
  .command-center-modal {
    width: 95%;
    max-height: 80vh;
    margin: 20px;
  }

  .shortcuts {
    gap: 8px;
  }
}
</style>
