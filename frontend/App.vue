<template>
  <div style="height: 100vh;">
    <NuxtPage />
    <div id="backdrop"></div>
    <Notification />
    <ClientOnly>
      <BackToTop />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useDocumentsStore, useCategoriesStore } from './store';

useDocumentsStore().fetch();
useCategoriesStore().fetch();
</script>