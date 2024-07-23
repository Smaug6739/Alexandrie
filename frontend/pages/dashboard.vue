<template>
  <div style="display: flex; width: 100%; height: 100%">
    <Sidebar />
    <MediumView>
      <Navbar />
      <NuxtPage />
    </MediumView>
  </div>
</template>
<script setup lang="ts">
definePageMeta({ breadcrumb: 'Home' });
await Promise.all([useDocumentsStore().fetch(), useCategoriesStore().fetch(), useUserStore().fetch()]);
</script>
