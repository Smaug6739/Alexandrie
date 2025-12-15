<template>
  <div v-if="menu">
    <!-- Backdrop transparent -->
    <div class="context-backdrop" @click="contextMenu.close" />

    <!-- Menu -->
    <div ref="menuRef" class="context-menu" :style="{ top: `${pos.y}px`, left: `${pos.x}px` }">
      <component :is="menu.component" v-bind="menu.options.props" class="context-menu-content" @close="contextMenu.close" />
    </div>
  </div>
</template>

<script setup lang="ts">
const contextMenu = useContextMenu();
const menu = contextMenu.menu;

const pos = computed(() => {
  if (!menu.value) return { x: 0, y: 0 };

  let x = menu.value.x;
  let y = menu.value.y;

  // Estimated menu dimensions (cannot measure before rendering)
  const menuWidth = 240;
  const menuHeight = 380;
  const pad = 8;
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 1080;

  // Horizontal: if right overflow, open to the left
  if (x + menuWidth > vw - pad) {
    x = Math.max(pad, vw - menuWidth - pad);
  }

  // Vertical: if bottom overflow, open upwards
  if (y + menuHeight > vh - pad) {
    y = menu.value.y - menuHeight;
    if (y < pad) {
      y = pad;
    }
  }

  return { x, y };
});
</script>

<style scoped lang="scss">
.context-menu {
  position: fixed;
  z-index: 6000;
  min-width: 240px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: var(--bg-color);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.context-menu-content {
  display: flex;
  flex-direction: column;
}

.context-backdrop {
  position: fixed;
  z-index: 5000;
  background: transparent;
  inset: 0;
}

:root.dark .context-menu {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4), 0 0 1px rgba(255, 255, 255, 0.1);
}
</style>
