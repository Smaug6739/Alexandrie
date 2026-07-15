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
  flex-shrink: 0;
  align-items: center;
  gap: 0.2rem;
  width: 100%;
  min-width: 0;
  margin-top: 2px;
  white-space: nowrap;
  overflow: auto hidden;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  .tab {
    position: relative;
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    gap: 0.4rem;
    min-width: max-content;
    padding: 0.3rem 0.9rem;
    border: 1px solid transparent;
    border-color: var(--primary-border);
    border-radius: var(--radius-sm) var(--radius-sm) 0 0;
    color: var(--color);
    cursor: pointer;
    transition:
      background 0.2s ease,
      color 0.2s ease,
      border-color 0.2s ease;

    span {
      font-size: 0.85rem;
      white-space: nowrap;
    }

    .close {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      opacity: 0;
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
      border-color: var(--primary-border);
      border-bottom-color: transparent;
      color: var(--color);
      background: var(--primary-bg);

      .close {
        opacity: 1;
      }

      &::after {
        position: absolute;
        bottom: -1px;
        left: 0;
        width: 100%;
        height: 2px;
        background: var(--primary);
        content: '';
      }
    }
  }

  .more {
    display: flex;
    flex: 0 0 auto;
    justify-content: center;
    align-items: center;
    width: 1.9rem;
    height: 1.9rem;
    margin-left: 0.25rem;
    border-radius: 8px;
    background: transparent;
    cursor: pointer;
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
