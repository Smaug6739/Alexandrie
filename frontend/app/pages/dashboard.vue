<template>
  <div style="width: 100%; height: 100%">
    <ClientOnly>
      <BackToTop />
    </ClientOnly>
    <Sidebar />
    <CommandCenter />
    <QuickSearch />
    <MediumView>
      <Navbar />
      <div style=" width: 100%;height: calc(100% - 65px)"><NuxtPage /></div>
    </MediumView>
  </div>
</template>
<script setup lang="ts">
definePageMeta({ breadcrumb: 'Home' });
await Promise.all([useDocumentsStore().fetch(), useCategoriesStore().fetch(), useUserStore().fetch(), useRessourcesStore().fetch()]);
</script>
