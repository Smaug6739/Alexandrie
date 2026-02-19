<template>
  <div class="dashboard-root">
    <ClientOnly>
      <BackToTop />
    </ClientOnly>
    <Sidebar />
    <MediumView>
      <Navbar />
      <div class="content">
        <NuxtPage />
      </div>
    </MediumView>
  </div>
</template>
<script setup lang="ts">
definePageMeta({ breadcrumb: { i18n: 'dashboard.pages.home' } });

const nodesStore = useNodesStore();
const userStore = useUserStore();

nodesStore.init();
userStore.fetch();

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
  height: 100%;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  min-height: 0;
}
</style>
