<template>
  <main ref="mediumContainer" class="medium-view" :style="{ paddingLeft: marginLeft, transition }">
    <slot />
  </main>
</template>

<script setup lang="ts">
const { isOpened, paneWidth, isResizing } = useSidebar();
const mediumContainer = ref<HTMLElement | null>(null);
const marginLeft = computed(() => (isMobile() || !isOpened.value ? '10px' : `${paneWidth.value + 20}px`));
const transition = computed(() => (isResizing.value ? 'none' : 'padding-left 0.3s'));
</script>

<style scoped>
.medium-view {
  padding: 0 20px;
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
