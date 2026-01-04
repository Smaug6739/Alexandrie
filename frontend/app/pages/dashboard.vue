<template>
  <div style="width: 100%; height: 100%">
    <ClientOnly>
      <BackToTop />
    </ClientOnly>
    <Sidebar />
    <CommandCenter />
    <MediumView>
      <Navbar />
      <NuxtPage />
    </MediumView>
  </div>
</template>
<script setup lang="ts">
definePageMeta({ breadcrumb: 'Home' });

// Initialize stores in parallel - don't block rendering but ensure they start immediately
const nodesStore = useNodesStore();
const userStore = useUserStore();

nodesStore.init();
userStore.fetch();
</script>
