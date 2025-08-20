<template>
  <nav :class="{ open: isOpened }">
    <div class="sidebar no-select">
      <div :style="{ width: panewidthCSS, display: 'flex' }">
        <slot/>
      </div>
      <div class="separator" @mousedown="startResize"/>
    </div>
  </nav>
</template>

<script setup lang="ts">
const { isOpened, paneWidth, isResizing } = useSidebar();

const startX = ref(0);
const startWidth = ref(0);
const panewidthCSS = computed(() => `${paneWidth.value}px`);

// Open and close sidebar from parent component
function startResize(event: MouseEvent) {
  if (event.button !== 0 || event.buttons > 1) return; // only main (left) mouse button is allowed
  isResizing.value = true;
  startX.value = event.pageX;
  startWidth.value = paneWidth.value;

  document.addEventListener('mousemove', resize);
  document.addEventListener('mouseup', stopResize);
}

const minWidth = 200;
const maxWidth = 700;

function resize(event: MouseEvent) {
  if (event.buttons === 0 || !isResizing.value) return stopResize();
  const deltaX = event.pageX - startX.value;
  let newWidth = startWidth.value + deltaX;
  if (newWidth < minWidth) newWidth = minWidth;
  else if (newWidth > maxWidth) newWidth = maxWidth;
  paneWidth.value = newWidth;
}
function stopResize() {
  isResizing.value = false;
  document.removeEventListener('mousemove', resize);
  document.removeEventListener('mouseup', stopResize);
}
</script>

<style scoped lang="scss">
nav {
  position: fixed;
  top: 0;
  left: 0;
  transition: transform 0.3s;
  transform: translate(-100%);
  height: 100%;
  z-index: 100;
}

.sidebar {
  overflow-x: hidden;
  height: 100%;
  display: flex;
  &:hover {
    .separator {
      background-color: var(--bg-contrast);
    }
  }
}

.open {
  transform: translate(0);
  border-right: 1px solid var(--border-color);
}

.separator {
  width: 5px;
  height: 96%;
  margin: auto 0;
  cursor: col-resize;
}

/* Disable text selection while resizing */
/* Selection can cause problems with selection */
/* PREVENT SELECTION DURING MOUSE EVENTS */
.no-select {
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
</style>
