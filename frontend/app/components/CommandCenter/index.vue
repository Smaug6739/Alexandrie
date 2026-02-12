<template>
  <div class="command-center">
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
          @keydown="handleKeydown"
        /><tag yellow class="tag">Beta</tag>
      </div>
    </div>

    <TabNavigation />

    <div class="tab-content">
      <QuickSearchTab
        v-if="activeTab === 'quick'"
        ref="quickSearchTab"
        :search-query="searchQuery"
        :selected-index="selectedIndex"
        @update-selected-index="setSelectedIndex"
      />
      <AdvancedSearchTab v-else ref="advancedSearchTab" :query="searchQuery" :selected-index="selectedIndex" @update-selected-index="setSelectedIndex" />
    </div>

    <div class="search-footer">
      <div class="shortcuts"><kbd>↑↓</kbd> Navigate <kbd>Enter</kbd> Select <kbd>⇄</kbd> Switch tabs <kbd>Esc</kbd> Close</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TabNavigation from './TabNavigation.vue';
import QuickSearchTab from './QuickSearchTab.vue';
import AdvancedSearchTab from './AdvancedSearchTab.vue';

const { searchQuery, selectedIndex, activeTab, close, setSearchQuery, setSelectedIndex } = useCommandCenter();

const searchInput = ref<HTMLInputElement>();
const quickSearchTab = ref<InstanceType<typeof QuickSearchTab>>();
const advancedSearchTab = ref<InstanceType<typeof AdvancedSearchTab>>();

onMounted(() => nextTick(() => searchInput.value?.focus()));

function getItems() {
  return activeTab.value === 'quick' ? quickSearchTab.value?.flattenedItems || [] : advancedSearchTab.value?.flattenedItems || [];
}

function handleSearchInput(e: Event) {
  setSearchQuery((e.target as HTMLInputElement).value);
}

function handleKeydown(e: KeyboardEvent) {
  const items = getItems();
  const max = items.length - 1;

  if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
    e.preventDefault();
    setSelectedIndex(selectedIndex.value < max ? selectedIndex.value + 1 : 0);
  } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
    e.preventDefault();
    setSelectedIndex(selectedIndex.value > 0 ? selectedIndex.value - 1 : max);
  } else if (e.key === 'Enter' && items.length) {
    e.preventDefault();
    const item = items[selectedIndex.value];
    if (item?.path) {
      close();
      navigateTo(item.path);
    }
  }
}
</script>

<style scoped lang="scss">
.command-center {
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
  width: 100%;
  padding: 12px 12px 12px 44px;
  border: none;
  font-size: 16px;
  background: transparent;
  outline: none;
}

.tag {
  margin-right: 25px;
}

.tab-content {
  min-height: 0;
  flex: 1;
  overflow: auto;
}

.search-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--border);
}

.shortcuts {
  display: flex;
  align-items: center;
  font-size: 13px;
  font-weight: 500;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
