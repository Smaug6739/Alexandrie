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
const preferencesStore = usePreferencesStore();

const { isLoading } = useAppState();
useStyleInjection(); // Custom styles for the app and documents
const { initGlobalListeners, destroyGlobalListeners } = useCommandCenter();

nodesStore.init();
userStore.fetch();
preferencesStore.fetchFromBackend();

onMounted(() => {
  initGlobalListeners();
  isLoading.value = false;
});
onBeforeUnmount(() => {
  destroyGlobalListeners();
});
</script>

<style lang="scss">
.dashboard-root {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
