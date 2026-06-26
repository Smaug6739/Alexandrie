<template>
  <div class="tabs-container">
    <button v-for="tab in tabsStore.tabs" :key="tab.path" class="tab" :class="{ active: route.fullPath === tab.path }" @click="selectTab(tab.path)">
      <span>{{ tab.name }}</span>
      <div class="close" @click.stop="closeTab(tab.path)">
        <Icon name="close" display="sm" />
      </div>
    </button>

    <div class="more" @click="addDefaultTab">
      <Icon name="plus" />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const tabsStore = useTabsStore();

useTabsSync();

const selectTab = (path: string): void => {
  router.push(path);
};

const addDefaultTab = (): void => {
  router.push('/dashboard/home');
};

const closeTab = (path: string): void => {
  const nextPath = tabsStore.closeTab(path, route.fullPath);
  if (nextPath) {
    router.push(nextPath);
  }
};
</script>

<style scoped lang="scss">
.tabs-container {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 0.2rem;
  margin-top: 2px;
  min-width: 0;
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
    padding: 0.3rem 0.9rem;
    gap: 0.4rem;
    min-width: max-content;
    color: var(--color);
    border: 1px solid transparent;
    border-radius: var(--radius-sm) var(--radius-sm) 0 0;
    border-color: var(--primary-border);
    cursor: pointer;
    transition:
      background 0.2s ease,
      color 0.2s ease,
      border-color 0.2s ease;
    position: relative;

    span {
      font-size: 0.85rem;
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
        background: var(--surface-raised);
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
