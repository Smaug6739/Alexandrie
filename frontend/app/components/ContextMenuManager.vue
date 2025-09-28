<template>
  <div v-if="menu">
    <!-- Backdrop transparent -->
    <div class="context-backdrop" @click="contextMenu.close"></div>

    <!-- Menu -->
    <div class="context-menu" :style="{ top: menu.y + 'px', left: menu.x + 'px', zIndex: 6000 }">
      <component :is="menu.component" v-bind="menu.options.props" class="context-menu-content" @close="contextMenu.close" />
    </div>
  </div>
</template>

<script setup lang="ts">
const contextMenu = useContextMenu();
const menu = contextMenu.menu;

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (menu && !target.closest('.context-menu')) {
    contextMenu.close();
  }
}
onMounted(() => document.addEventListener('click', handleClickOutside));
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside));
</script>

<style scoped lang="scss">
.context-menu {
  position: fixed;
  background: var(--bg-color);
  border-radius: 6px;
  box-shadow: 0 2px 10px var(--shadow);
  min-width: 250px;
  overflow: hidden;
}

.context-menu-content {
  display: flex;
  flex-direction: column;
}
.context-backdrop {
  position: fixed;
  inset: 0;
  background: transparent;
  z-index: 5000;
}
</style>
