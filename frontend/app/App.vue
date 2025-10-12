<template>
  <div style="height: 100vh">
    <ModalManager />
    <ContextMenuManager />
    <NuxtPage />
    <Notification />
  </div>
</template>

<script setup lang="ts">
import 'virtual:svg-icons-register';

const color = usePreferences().get('primaryColor').value;
setAppColor(Number(color) || 'primary');
useFavicon();
</script>
