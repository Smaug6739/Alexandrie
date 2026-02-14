<template>
  <div class="app">
    <ModalManager />
    <ContextMenuManager />
    <NuxtPage />
    <Notification />
  </div>
</template>

<script setup lang="ts">
// @ts-expect-error ignore missing types
import 'virtual:svg-icons-register';

useFavicon();
const preferences = usePreferences();
const { setAppColor } = useAppColors();

const primaryColor = preferences.get('primaryColor');
const interfaceStyle = preferences.get('style');

watch(
  primaryColor,
  color => {
    setAppColor(Number(color));
  },
  { immediate: true },
);

watch(
  interfaceStyle,
  style => {
    document.documentElement.classList.toggle('glassmorphism', style === 'glassmorphism');
  },
  { immediate: true },
);
</script>

<style lang="scss">
.app {
  height: 100vh;
  overflow: auto;
  display: flex;
  flex-direction: column;
}
</style>
