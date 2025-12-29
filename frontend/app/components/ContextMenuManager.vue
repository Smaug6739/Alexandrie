<template>
  <div v-if="menu">
    <!-- Desktop: Classic context menu -->
    <template v-if="!isMobile">
      <!-- Backdrop transparent -->
      <div class="context-backdrop" @click="contextMenu.close" />

      <!-- Menu -->
      <div ref="menuRef" class="context-menu" :style="{ top: `${pos.y}px`, left: `${pos.x}px` }">
        <component :is="menu.component" v-bind="menu.options.props" class="context-menu-content" @close="contextMenu.close" />
      </div>
    </template>

    <!-- Mobile: Bottom Sheet -->
    <Transition name="mobile-sheet">
      <div v-if="isMobile" class="mobile-overlay" @click.self="contextMenu.close">
        <div class="mobile-sheet" :style="sheetStyle">
          <div class="mobile-sheet-header" @touchstart="onDragStart" @touchmove="onDragMove" @touchend="onDragEnd" @mousedown="onDragStart">
            <div class="mobile-sheet-handle" />
          </div>
          <div class="mobile-sheet-body">
            <component :is="menu.component" v-bind="menu.options.props" class="mobile-menu-content" @close="contextMenu.close" />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const contextMenu = useContextMenu();
const menu = contextMenu.menu;

// Mobile detection
const mobileBreakpoint = 768;
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024);
const isMobile = computed(() => windowWidth.value < mobileBreakpoint);

function updateWindowWidth() {
  windowWidth.value = window.innerWidth;
}

// Drag/Swipe handling for mobile sheet
const isDragging = ref(false);
const dragStartY = ref(0);
const dragCurrentY = ref(0);
const sheetTranslateY = ref(0);

const sheetStyle = computed(() => {
  if (sheetTranslateY.value > 0) {
    return {
      transform: `translateY(${sheetTranslateY.value}px)`,
      transition: isDragging.value ? 'none' : 'transform 0.3s ease-out',
    };
  }
  return {};
});

function getClientY(e: TouchEvent | MouseEvent): number {
  if ('touches' in e) {
    return e.touches[0]?.clientY ?? 0;
  }
  return e.clientY;
}

function onDragStart(e: TouchEvent | MouseEvent) {
  isDragging.value = true;
  dragStartY.value = getClientY(e);
  dragCurrentY.value = dragStartY.value;

  if (!('touches' in e)) {
    // Mouse events need global listeners
    window.addEventListener('mousemove', onDragMove);
    window.addEventListener('mouseup', onDragEnd);
  }
}

function onDragMove(e: TouchEvent | MouseEvent) {
  if (!isDragging.value) return;

  dragCurrentY.value = getClientY(e);
  const deltaY = dragCurrentY.value - dragStartY.value;

  // Only allow dragging down (positive delta)
  sheetTranslateY.value = Math.max(0, deltaY);
}

function onDragEnd() {
  if (!isDragging.value) return;

  isDragging.value = false;

  // Remove mouse listeners if added
  window.removeEventListener('mousemove', onDragMove);
  window.removeEventListener('mouseup', onDragEnd);

  const threshold = 100; // pixels to trigger close

  if (sheetTranslateY.value > threshold) {
    // Close the menu
    contextMenu.close();
  }

  // Reset translate
  sheetTranslateY.value = 0;
}

// Reset drag state when menu closes
watch(
  () => menu.value,
  newMenu => {
    if (!newMenu) {
      sheetTranslateY.value = 0;
      isDragging.value = false;
    }
    if (isMobile.value) {
      document.body.style.overflow = newMenu ? 'hidden' : '';
    }
  },
);

onMounted(() => {
  window.addEventListener('resize', updateWindowWidth);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateWindowWidth);
  document.body.style.overflow = '';
});

const pos = computed(() => {
  if (!menu.value) return { x: 0, y: 0 };

  let x = menu.value.x;
  let y = menu.value.y;

  // Estimated menu dimensions (cannot measure before rendering)
  const menuWidth = 240;
  const menuHeight = 340;
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
  background: var(--bg-color);
  box-shadow: 0 8px 30px rgb(0 0 0 / 12%), 0 2px 8px rgb(0 0 0 / 6%);
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
  box-shadow: 0 8px 30px rgb(0 0 0 / 40%), 0 0 1px rgb(255 255 255 / 10%);
}

/* ========================
   Mobile Bottom Sheet Styles
   ======================== */
.mobile-overlay {
  position: fixed;
  z-index: 6000;
  display: flex;
  background: rgb(0 0 0 / 50%);
  align-items: flex-end;
  inset: 0;
  justify-content: center;
}

.mobile-sheet {
  display: flex;
  width: 100%;
  min-height: 60vh;
  max-height: 85vh;
  border-radius: 16px 16px 0 0;
  background: var(--bg-color);
  animation: slide-up 0.3s ease-out;
  flex-direction: column;
}

@keyframes slide-up {
  from {
    transform: translateY(100%);
  }

  to {
    transform: translateY(0);
  }
}

.mobile-sheet-header {
  display: flex;
  padding: 12px 16px 8px;
  align-items: center;
  cursor: grab;
  flex-shrink: 0;
  justify-content: center;
  touch-action: none;
  user-select: none;

  &:active {
    cursor: grabbing;
  }
}

.mobile-sheet-handle {
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background: var(--border-color);
  transition: background 0.2s, width 0.2s;

  .mobile-sheet-header:active & {
    width: 48px;
    background: var(--font-color-light, #888);
  }
}

.mobile-sheet-body {
  flex: 1;
  -webkit-overflow-scrolling: touch;
  overflow-y: auto;
}

/* Transitions */
.mobile-sheet-enter-active,
.mobile-sheet-leave-active {
  transition: opacity 0.3s ease;
}

.mobile-sheet-enter-active .mobile-sheet,
.mobile-sheet-leave-active .mobile-sheet {
  transition: transform 0.3s ease;
}

.mobile-sheet-enter-from,
.mobile-sheet-leave-to {
  opacity: 0;
}

.mobile-sheet-enter-from .mobile-sheet,
.mobile-sheet-leave-to .mobile-sheet {
  transform: translateY(100%);
}
</style>
