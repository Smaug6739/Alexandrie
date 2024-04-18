<template>
  <div id="app">
    <NuxtPage style="overflow:auto;padding-top: 50px;" id="app-scroll" />
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
<style scoped lang="scss">
#app {
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

@media print {
  #app {
    height: auto;
  }
}
</style>