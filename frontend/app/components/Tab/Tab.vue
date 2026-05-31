<template>
  <div class="tabs-container">
    <button v-for="(tab, key) in tabs.tabs" :key class="tab" :class="{ active: tabs.indexActiveTab === key }" @click="selectTab(tab, key)">
      <span>{{ tab.name }}</span>
      <div class="close" @click.stop="closeTab(key)">
        <Icon name="close" display="sm" />
      </div>
    </button>
    <div class="more" @click="addTab">
      <Icon name="plus" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tab } from '~/stores/tabs.stores';

const tabs = useTabs();
const router = useRouter();

tabs.setup();
tabs.$subscribe(() => {
  tabs.saveTabs();
});

useTabsSync();

const selectTab = (tab: Tab, index: number): void => {
  tabs.setActive(index);

  router.push(tab.path);
};

const addTab = (): void => {
  const tab = tabs.addTab();

  router.push(tab.path);
};

const closeTab = (index: number): void => {
  const nextTab = tabs.closeTab(index);

  if (nextTab) {
    router.push(nextTab.path);
  }
};
</script>

<style scoped lang="scss">
.tabs-container {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 0.25rem;
  min-height: 2.7rem;
  min-width: 0;
  padding: 0.25rem 0.5rem 0;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  width: 100%;

  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  .tab {
    display: flex;
    align-items: center;

    flex: 0 0 auto;
    padding: 0.4rem 0.9rem;
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
      font-size: 0.9rem;
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
    flex: 0 0 auto;

    width: 1.9rem;
    height: 1.9rem;

    margin-left: 0.25rem;

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
