<template>
  <header>
    <button v-if="!isOpened" @click="toggleSidebar" class="open-sidebar" aria-label="open sidebar">
      <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
        <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
      </svg>
    </button>
    <IconApp v-if="!isOpened" style="width: 40px" />
    <BreadCrumb v-if="!isMobile()" />
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
  margin-bottom: 15px;
  padding: 10px 0;
}

svg {
  fill: var(--font-color);
}

button {
  padding: 0;
  margin: 0;
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
</script>
