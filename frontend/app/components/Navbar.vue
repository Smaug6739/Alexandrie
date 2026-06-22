<template>
  <header>
    <div class="navbar">
      <div class="left">
        <NavbarRouter />
        <button v-if="!isOpened" class="open-sidebar" aria-label="open sidebar" @click="toggleSidebar">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
            <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
          </svg>
        </button>
        <div id="navbar-title" />
      </div>

      <div class="navbar__search">
        <div id="navbar-actions" />
        <button
          v-if="navbarItems.search"
          class="search-btn"
          :title="t('components.navbar.commandCenter')"
          aria-label="Command center"
          @click="openCommandCenter"
        >
          <Icon name="search" />
          <span class="search-text">
            <i18n-t scope="global" keypath="components.navbar.searchHint">
              <template #key>
                <kbd>/</kbd>
              </template>
            </i18n-t>
          </span>
        </button>
        <div id="navbar-infos" />
        <ThemeToggle v-if="navbarItems.theme" aria-label="toggle theme" />
      </div>
    </div>
    <div v-if="navbarItems.breadcrumb" class="breadcrumbs">
      <BreadCrumbs />
    </div>
    <div id="navbar-bottom" />
  </header>
</template>

<script lang="ts" setup>
import BreadCrumbs from '~/components/Navigation/BreadCrumbs.vue';

const { t } = useI18nT();
const { isOpened, toggleSidebar } = useSidebar();
const preferences = usePreferencesStore();
const commandCenter = useCommandCenter();

const navbarItems = preferences.get('navbarItems');
const openCommandCenter = () => commandCenter.open();
</script>

<style lang="scss" scoped>
header {
  margin-top: 4px;
  border-bottom: 1px solid var(--border);
  width: 98%;
  margin: 0 auto;
}

.navbar {
  position: sticky;
  height: 60px;
  display: flex;
  width: 100%;
  padding: 10px 0;
  align-items: center;
  justify-content: space-between;

  &__navigation,
  &__search {
    display: flex;
    align-items: center;
    gap: 16px;
  }
}
.left {
  display: flex;
  align-items: center;
  gap: 8px;
}

#navbar-title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  gap: 12px;
}
#navbar-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

button {
  margin: 0;
  padding: 0;
}

.search-btn {
  display: flex;
  min-width: 200px;
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

.breadcrumbs {
  padding: 5px 0;
}
</style>
