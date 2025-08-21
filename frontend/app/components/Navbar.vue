<template>
  <header>
    <div>
      <button v-if="!isOpened" class="open-sidebar" aria-label="open sidebar" @click="toggleSidebar">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
          <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
        </svg>
      </button>
      <IconApp v-if="!isOpened" style="width: 40px" />
      <BreadCrumb v-if="!isMobile()" />
    </div>
    <div>
      <button class="search-btn" title="Global search (Ctrl+K)" aria-label="Global search" @click="openGlobalSearch">
        <Icon name="search" />
        <span class="search-text">Search</span>
        <kbd class="shortcut">Ctrl+K</kbd>
      </button>

      <ThemeToggle aria-label="toggle theme" />
    </div>
  </header>
</template>

<script lang="ts" setup>
const { toggleSidebar, isOpened } = useSidebar();
const openGlobalSearch = () => window.dispatchEvent(new CustomEvent('command-center-open'));
</script>
<style lang="scss" scoped>
header {
  height: 50px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 10px;
  padding: 10px 0;
  position: sticky;
  div {
    display: flex;
    align-items: center;
    gap: 16px;
  }
}

svg {
  fill: var(--font-color);
}

button {
  padding: 0;
  margin: 0;
}

.search-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--border-color);
  border: none;
  border-radius: 8px;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: 16px;
  width: 200px;
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

.shortcut {
  background: rgba(255, 255, 255, 0.2);
  color: inherit;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-family: monospace;
  font-weight: 600;
}

// Mobile styles
@media screen and (max-width: 719px) {
  .no-mobile {
    display: none;
  }
}
</style>
