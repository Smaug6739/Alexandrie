<template>
  <div class="command-center-modal" @click="handleOverlayClick">
    <!-- Header -->
    <div class="search-header">
      <div class="search-input-wrapper">
        <Icon name="search" class="search-icon" />
        <input
          ref="searchInput"
          :value="searchQuery"
          type="text"
          placeholder="Search for a page, action, or document..."
          class="search-input"
          @input="handleSearchInput"
          @keydown="handleSearchKeydown"
        /><tag yellow class="tag">Beta</tag>
      </div>
    </div>

    <!-- Tab Navigation -->
    <TabNavigation @change-tab="handleTabChange" />

    <!-- Tab Content -->
    <div class="tab-content">
      <QuickSearchTab
        v-if="activeTab === 'quick'"
        ref="quickSearchTab"
        :search-query="searchQuery"
        :selected-index="selectedIndex"
        @select-item="handleQuickSelect"
        @update-selected-index="setSelectedIndex"
      />

      <AdvancedSearchTab
        v-else-if="activeTab === 'advanced'"
        ref="advancedSearchTab"
        :query="searchQuery"
        :selected-index="selectedIndex"
        @select-document="handleDocumentSelect"
        @update-selected-index="setSelectedIndex"
      />
    </div>

    <!-- Footer -->
    <div class="search-footer">
      <div class="shortcuts"><kbd>↑↓</kbd> or <kbd>Tab</kbd>Navigate <kbd>Enter</kbd> Select <kbd>⇄</kbd> Switch tabs <kbd>Escape</kbd> Close</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TabNavigation from './TabNavigation.vue';
import QuickSearchTab from './QuickSearchTab.vue';
import AdvancedSearchTab from './AdvancedSearchTab.vue';
import type { Node } from '~/stores';

const { searchQuery, selectedIndex, activeTab, close, changeTab, setSearchQuery, setSelectedIndex } = useCommandCenter();

const searchInput = ref<HTMLInputElement>();
const quickSearchTab = ref();
const advancedSearchTab = ref();

// Focus input when opening
onMounted(() => {
  nextTick(() => searchInput.value?.focus());
});

// --- Methods ---
function handleSearchInput(e: Event) {
  setSearchQuery((e.target as HTMLInputElement).value);
}

function handleTabChange(tabId: string) {
  changeTab(tabId as 'quick' | 'advanced');
  if (tabId === 'quick') {
    nextTick(() => searchInput.value?.focus());
  }
}

function handleOverlayClick(e: MouseEvent) {
  if (
    e.target &&
    (e.target as Element).closest('.command-center-modal') &&
    !(e.target as Element).closest('.close-btn') &&
    !(e.target as Element).closest('.search-results-list')
  )
    return;

  close();
}

function handleQuickSelect() {
  const selectedItem = quickSearchTab.value?.flattenedItems?.[selectedIndex.value];
  if (selectedItem) {
    navigateTo(selectedItem.path);
    close();
  }
}

function handleDocumentSelect(document: Node) {
  navigateTo(`/dashboard/docs/${document.id}`);
  close();
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
    setSelectedIndex((selectedIndex.value + 1) % Math.max(maxIndex + 1, 1));
  } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey && selectedIndex.value > 0)) {
    e.preventDefault();
    setSelectedIndex((selectedIndex.value - 1 + Math.max(maxIndex + 1, 1)) % Math.max(maxIndex + 1, 1));
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
</script>

<style scoped lang="scss">
.command-center-modal {
  display: flex;
  border-radius: 16px;
  flex-direction: column;
  overflow: auto;
}

.search-header {
  display: flex;
  padding: 20px;
  align-items: center;
  border-bottom: 1px solid var(--border);
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

.tag {
  height: fit-content;
  margin-right: 20px;
}

.tab-content {
  position: relative;
  min-height: 0;
  flex: 1;
  overflow: auto;
}

.search-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--border);
  flex-shrink: 0;
}

.shortcuts {
  display: flex;
  align-items: center;
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
