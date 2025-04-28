<template>
  <div style="display: flex; width: 100%; height: 100%">
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
definePageMeta({ breadcrumb: 'Home' });
await Promise.all([useDocumentsStore().fetch(), useCategoriesStore().fetch(), useUserStore().fetch(), useRessourcesStore().fetch()]);
</script>
