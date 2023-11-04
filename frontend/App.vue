<template>
  <div id="app">
    <div id="backdrop"></div>
    <Navbar />
    <BackToTop />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { useDocumentsStore, useCategoriesStore } from './store';
// @ts-ignore
useDocumentsStore().fetch({ fields: ['id', 'name', 'description', 'category', 'created_timestamp'] });
useCategoriesStore().fetch();
</script>
<style scoped>
#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  max-width: 100% !important;
}
</style>
