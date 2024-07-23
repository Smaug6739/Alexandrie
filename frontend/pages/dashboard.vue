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
try {
  await Promise.all([useDocumentsStore().fetch(), useCategoriesStore().fetch(), useUserStore().fetch()]);
} catch {}
</script>
