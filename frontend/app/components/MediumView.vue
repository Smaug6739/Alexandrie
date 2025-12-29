<template>
  <main class="medium-view" :style="{ paddingLeft: marginLeft, transition }">
    <slot />
  </main>
</template>

<script setup lang="ts">
const { isOpened, paneWidth, isResizing } = useSidebar();
const { isMobile } = useDevice();

const marginLeft = computed(() => (isMobile.value || !isOpened.value ? '10px' : `${paneWidth.value + 20}px`));
const transition = computed(() => (isResizing.value ? 'none' : 'padding-left 0.3s'));
</script>

<style scoped>
.medium-view {
  width: 100%;
  height: 100%;
  padding: 0 20px;
}

@media print {
  .medium-view {
    margin: 0 !important;
    padding: 0 !important;
  }
}

@media screen and (width <= 719px) {
  .medium-view {
    padding: 0 0.5rem;
  }
}
</style>
