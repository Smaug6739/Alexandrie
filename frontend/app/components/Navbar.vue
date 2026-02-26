<template>
  <header>
    <div>
      <button v-if="!isOpened" class="open-sidebar" aria-label="open sidebar" @click="toggleSidebar">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
          <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
        </svg>
      </button>
      <Navigation v-if="navbarItems.breadcrumb" />
    </div>
    <div>
      <button v-if="navbarItems.search" class="search-btn" :title="t('components.navbar.commandCenter')" aria-label="Command center" @click="openCommandCenter">
        <Icon name="search" />
        <span class="search-text">
          <i18n-t scope="global" keypath="components.navbar.searchHint">
            <template #key>
              <kbd>/</kbd>
            </template>
          </i18n-t>
        </span>
      </button>
      <ThemeToggle v-if="navbarItems.theme" aria-label="toggle theme" />
    </div>
  </header>
</template>

<script lang="ts" setup>
import Navigation from "~/components/Navigation/Navigation.vue";

const { t } = useI18nT();
const { isOpened, toggleSidebar } = useSidebar();
const preferences = usePreferencesStore();

const navbarItems = preferences.get('navbarItems');
const openCommandCenter = () => useCommandCenter().open();
</script>

<style lang="scss" scoped>
header {
  position: sticky;
  display: flex;
  width: 100%;
  height: 50px;
  padding: 10px 0;
  align-items: center;
  border-bottom: 1px solid var(--border);
  justify-content: space-between;

  div {
    display: flex;
    align-items: center;
    gap: 16px;
  }
}

svg {
  fill: var(--text-body);
}

button {
  margin: 0;
  padding: 0;
}

.search-btn {
  display: flex;
  width: 200px;
  padding: 8px 12px;
  border: none;
  border-radius: var(--radius-sm);
  background: var(--border);
  transition:
    background-color $transition-base ease,
    transform $transition-base ease;
  align-items: center;
  cursor: pointer;
  gap: 4px;

  &:hover {
    background: var(--selection-color);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
}

.search-text {
  font-size: 14px;
  font-weight: 500;
}

kbd {
  padding: 0 5px;
  border: 1px solid var(--text-secondary);
  border-radius: var(--radius-xs);
  font-family: monospace;
  font-size: 14px;
  font-weight: 600;
  background: var(--border);
}
</style>
