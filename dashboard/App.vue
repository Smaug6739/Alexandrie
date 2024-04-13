<template>
  <div id="app">
    <Navbar style="height: 60px" />
    <NuxtPage class="page" />
    <div id="backdrop"></div>
    <Notification />
  </div>
</template>

<script setup lang="ts">
import { useDocumentsStore, useCategoriesStore } from './store';

// @ts-ignore
useDocumentsStore().fetch();
useCategoriesStore().fetch();

</script>
<style scoped lang="scss">
#app {
  height: 100vh;
}

.page {
  height: calc(100vh - 60px);
}
</style>