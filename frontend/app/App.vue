<template>
  <div style="height: 100vh">
    <ModalManager />
    <NuxtPage />
    <Notification />
  </div>
</template>

<script setup lang="ts">
const color = usePreferences().get('primaryColor');
setAppColor(Number(color) || 'primary');
useFavicon();
</script>
