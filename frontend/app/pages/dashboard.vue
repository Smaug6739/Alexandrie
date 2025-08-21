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
      <div style="height: calc(100% - 65px); width: 100%" :style="!isMobile() ? { paddingLeft: '100px' } : {}"><NuxtPage /></div>
    </MediumView>
  </div>
</template>
<script setup lang="ts">
definePageMeta({ breadcrumb: 'Home' });
await Promise.all([useDocumentsStore().fetch(), useCategoriesStore().fetch(), useUserStore().fetch(), useRessourcesStore().fetch()]);
</script>
