<template>
  <NuxtPage />
</template>

<script setup lang="ts">
definePageMeta({ breadcrumb: 'CDN' });
useRessourcesStore().fetch();
</script>
