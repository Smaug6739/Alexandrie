<template>
  <NuxtPage />
</template>

<script setup lang="ts">
definePageMeta({ breadcrumb: { i18n: 'admin.dashboard.title' } });

const store = useAdminStore();
void store.fetchAll();
</script>
