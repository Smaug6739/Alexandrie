<template>
  <main class="medium-view" ref="mediumContainer" :style="{ marginLeft, transition }">
    <slot></slot>
  </main>
</template>

<script setup lang="ts">
const { isOpened, paneWidth, isResizing } = useSidebar();
const mediumContainer = ref<HTMLElement | null>(null);
const marginLeft = computed(() => (isMobile() || !isOpened.value ? '0' : `${paneWidth.value}px`));
const transition = computed(() => (isResizing.value ? 'none' : 'margin-left 0.3s'));
</script>

<style scoped>
.medium-view {
  padding: 0 1rem;
  width: 100%;
  height: 100%;
}

@media print {
  .medium-view {
    padding: 0 !important;
    margin: 0 !important;
  }
}

@media screen and (max-width: 719px) {
  .medium-view {
    padding: 0 0.5rem;
  }
}
</style>
