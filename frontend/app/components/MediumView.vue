<template>
  <main :style="{ paddingLeft: marginLeft }">
    <slot />
  </main>
</template>

<script setup lang="ts">
const { isOpened, paneWidth } = useSidebar();
const { isMobile } = useDevice();

const marginLeft = computed(() => (isMobile.value || !isOpened.value ? '10px' : `${paneWidth.value + 20}px`));
</script>

<style scoped lang="scss">
main {
  display: flex;
  width: 100%;
  height: 100%;
  padding: 0 10px;
  flex-direction: column;
  transition: padding-left $transition-medium;
}

@media print {
  main {
    margin: 0 !important;
    padding: 0 !important;
  }
}

@media screen and (width <= 719px) {
  main {
    padding: 0 0.5rem;
  }
}
</style>
