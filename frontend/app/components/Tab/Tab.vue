<template>
  <div class="tabs-container">
    <button v-for="(tab, key) in tabs.tabs" :key class="tab" :class="{ active: tabs.indexActiveTab === key }" @click="selectTab(tab, key)">
      <span>{{ tab.name }}</span>
      <div class="close" @click.stop="tabs.closeTab(key)">
        <Icon name="close" display="sm" />
      </div>
    </button>
    <div class="more" @click="tabs.addTab">
      <Icon name="plus" class="more" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTabs, type Tab } from '~/stores/tabs.stores';

const tabs = useTabs();

tabs.$subscribe(() => {
  tabs.saveTabs();
});

onMounted(() => {
  tabs.setup();
  tabs.initWatcher();
});

const selectTab = (tab: Tab, index: number): void => {
  tabs.setActive(index);

  navigateTo(tab.path);
};
</script>

<style scoped lang="scss">
.tabs-container {
  display: flex;
  align-items: center;
  margin-top: 1rem;

  overflow-y: auto;
  overflow-x: visible;
}

.tab {
  display: flex;
  align-items: center;
  gap: 10px;

  padding: 10px 14px;
  border: var(--border) solid 1px;
  border-radius: 0;

  background: var(--surface-overlay);
  color: var(--text-secondary);

  cursor: pointer;
  transition: all 0.2s ease;

  &.active {
    background: var(--surface-raised);
    font-weight: 600;
    border-bottom: 0;
  }

  &:hover {
    background: var(--surface-raised);
  }
}

.close {
  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  font-size: 12px;

  transition: 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.12);
  }
}

.more {
  margin: 0 0.5rem;
  cursor: pointer;
}
</style>
