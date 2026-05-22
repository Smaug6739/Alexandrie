<template>
  <div class="tabs-container">
    <button v-for="(tab, key) in tabs.tabs" :key class="tab" :class="{ active: tabs.indexActiveTab === key }" @click="selectTab(tab, key)">
      <span>{{ tab.name }}</span>
      <div class="close" @click.stop="tabs.closeTab(key)">
        <Icon name="close" display="sm" />
      </div>
    </button>
    <div class="more" @click="tabs.addTab">
      <Icon name="plus" />
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
  padding: 0.5rem;
  overflow-x: auto;

  // Optional scrollbar styling
  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #444;
    border-radius: 10px;
  }

  .tab {
    display: flex;
    align-items: center;
    gap: 0.6rem;

    padding: 0.65rem 1rem;
    min-width: max-content;

    color: var(--color);

    border: 1px solid transparent;
    border-radius: 10px 10px 0 0;
    border-color: var(--primary-border);

    cursor: pointer;
    transition:
      background 0.2s ease,
      color 0.2s ease,
      border-color 0.2s ease;

    position: relative;

    span {
      font-size: 0.95rem;
      white-space: nowrap;
    }

    .close {
      display: flex;
      align-items: center;
      justify-content: center;

      opacity: 0;

      width: 20px;
      height: 20px;

      border-radius: 50%;
      transition:
        background 0.2s ease,
        opacity 0.2s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.12);
      }
    }

    &:hover {
      background: var(--primary-border);

      .close {
        opacity: 1;
      }
    }

    &.active {
      background: var(--primary-bg);
      color: var(--color);
      border-color: var(--primary-border);
      border-bottom-color: transparent;

      .close {
        opacity: 1;
      }

      &::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        width: 100%;
        height: 2px;
        background: var(--primary);
      }
    }
  }

  .more {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 2rem;
    height: 2rem;

    margin-left: 0.5rem;

    border-radius: 8px;
    cursor: pointer;

    background: transparent;

    transition:
      background 0.2s ease,
      color 0.2s ease,
      opacity 0.2s ease;

    &:hover {
      background: var(--primary-bg);
    }
  }
}
</style>
