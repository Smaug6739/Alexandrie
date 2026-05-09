<template>
  <div class="dashboard-root">
    <ClientOnly>
      <BackToTop />
    </ClientOnly>
    <Sidebar />
    <MediumView>
      <Navbar />
      <NuxtPage />
    </MediumView>
  </div>
</template>
<script setup lang="ts">
const nodesStore = useNodesStore();
const userStore = useUserStore();

nodesStore.init();
userStore.fetch();
usePreferencesStore().fetchFromBackend();

useStyleInjection(); // Custom styles for the app and documents
const { initGlobalListeners, destroyGlobalListeners } = useCommandCenter();

onMounted(() => {
  initGlobalListeners();
});
onBeforeUnmount(() => {
  destroyGlobalListeners();
});
</script>

<style lang="scss">
.dashboard-root {
  display: flex;
  height: 100%;
  flex-direction: column;
}
</style>
