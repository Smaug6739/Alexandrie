<template>
  <div style="width: 100%; height: 100%">
    <ClientOnly>
      <BackToTop />
    </ClientOnly>
    <Sidebar />
    <CommandCenter />
    <MediumView>
      <Navbar />
      <div style="width: 100%; height: calc(100% - 65px)"><NuxtPage /></div>
    </MediumView>
  </div>
</template>
<script setup lang="ts">
definePageMeta({ breadcrumb: 'Home' });
useNodesStore().init();
useUserStore().fetch();
</script>
