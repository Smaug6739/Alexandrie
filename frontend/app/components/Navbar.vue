<template>
  <header>
    <button v-if="!isOpened" @click="toggleSidebar" class="open-sidebar" aria-label="open sidebar">
      <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
        <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
      </svg>
    </button>
    <IconApp v-if="!isOpened" style="width: 40px" />
    <BreadCrumb v-if="!isMobile()" />
    
    <button 
      class="search-btn" 
      @click="openGlobalSearch"
      title="Global search (Ctrl+K)"
      aria-label="Global search"
    >
      <Icon name="search" />
      <span class="search-text">Search</span>
      <kbd class="shortcut">Ctrl+K</kbd>
    </button>
    
    <ThemeToggle style="margin-left: auto" aria-label="toggle theme" />
  </header>
  
</template>

<style lang="scss" scoped>
header {
  height: 50px;
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 10px;
  padding: 10px 0;
  position: sticky;
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
  
  &:hover {
    background: var(--primary);
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.3);
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
<script lang="ts" setup>
const { toggleSidebar, isOpened } = useSidebar();

function openGlobalSearch() {
  window.dispatchEvent(new CustomEvent('global-search-open'))
}
</script>
