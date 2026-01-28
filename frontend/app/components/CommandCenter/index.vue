<template>
  <Teleport to="body">
    <Transition name="modal" class="command-center-overlay">
      <div v-if="isOpen" @click="closeSearch">
        <div class="command-center-modal">
          <!-- Header -->
          <div class="search-header">
            <div class="search-input-wrapper">
              <Icon name="search" class="search-icon" />
              <input
                ref="searchInput"
                v-model="searchQuery"
                type="text"
                placeholder="Search for a page, action, or document..."
                class="search-input"
                @keydown="handleSearchKeydown"
              /><tag yellow style="height: fit-content">Beta</tag>
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
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import CreateCategoryModal from '~/components/Node/Modals/CreateCategory.vue';
import TabNavigation from './TabNavigation.vue';
import QuickSearchTab from './QuickSearchTab.vue';
import AdvancedSearchTab from './AdvancedSearchTab.vue';
import type { Node } from '~/stores';

const router = useRouter();
const isOpen = ref(false);
const searchQuery = ref('');
const selectedIndex = ref(0);
const activeTab = ref('quick');
const searchInput = ref<HTMLInputElement>();
const quickSearchTab = ref();
const advancedSearchTab = ref();

const handleGlobalKeydown = (e: KeyboardEvent) => {
  if (e.key === '/') {
    const target = e.target as HTMLElement;
    const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
    if (isTyping) return;
    e.preventDefault();
    return openSearch();
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    return openSearch();
  }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u') {
    e.preventDefault();
    return router.push('/dashboard/cdn');
  }
  if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === 'c') {
    e.preventDefault();
    return router.push('/dashboard/docs/new');
  }
  if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === 'n') {
    e.preventDefault();
    return useModal().add(new Modal(shallowRef(CreateCategoryModal), { props: { role: 1 } }));
  }
  if (e.key === 'Escape' && isOpen.value) {
    return closeSearch();
  }
  if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && isOpen.value) {
    e.preventDefault();
    e.stopImmediatePropagation();
    return changeTab(activeTab.value === 'quick' ? 'advanced' : 'quick');
  }
};
const openListener = () => openSearch();

// *********** Lifecycle ***********
onMounted(() => {
  document.addEventListener('keydown', handleGlobalKeydown);
  window.addEventListener('command-center-open', openListener as EventListener);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleGlobalKeydown);
  window.removeEventListener('command-center-open', openListener as EventListener);
});

// --- Methods ---
function openSearch() {
  isOpen.value = true;
  selectedIndex.value = 0;
  searchQuery.value = '';
  activeTab.value = 'quick';
  nextTick(() => searchInput.value?.focus());
  document.body.classList.add('modal-open');
}

function closeSearch(e?: MouseEvent) {
  if (
    e &&
    e.target &&
    (e.target as Element).closest('.command-center-modal') &&
    !(e.target as Element).closest('.close-btn') &&
    !(e.target as Element).closest('.search-results-list')
  )
    return;

  isOpen.value = false;
  searchQuery.value = '';
  selectedIndex.value = 0;
  document.body.classList.remove('modal-open');
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

function handleDocumentSelect(document: Node) {
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

watch(searchQuery, () => (selectedIndex.value = 0));
</script>

<style scoped lang="scss">
.command-center-overlay {
  position: fixed;
  z-index: 500;
  display: flex;
  background: rgb(0 0 0 / 50%);
  align-items: flex-start;
  inset: 0;
  justify-content: center;
  padding-top: 8vh;
}

.modal-enter-active,
.modal-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(1.1);
}

.command-center-modal {
  position: relative;
  z-index: 1000;
  display: flex;
  width: 92%;
  max-width: 720px;
  max-height: 85vh;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  background: var(--bg-color);
  box-shadow: 0 20px 60px rgb(0 0 0 / 30%);
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
  display: flex;
  align-items: center;
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
  padding: 12px 12px 12px 44px;
  border: none;
  font-size: 16px;
  background: transparent;
  flex: 1;
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
