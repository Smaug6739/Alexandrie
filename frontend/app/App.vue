<template>
  <div style="height: 100vh">
    <ModalManager />
    <ContextMenuManager />
    <NuxtPage />
    <Notification />
  </div>
</template>

<script setup lang="ts">
// @ts-expect-error ignore missing types
import 'virtual:svg-icons-register';

const color = usePreferences().get('primaryColor').value;
setAppColor(Number(color));
useFavicon();
</script>
