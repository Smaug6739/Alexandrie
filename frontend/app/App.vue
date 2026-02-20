<template>
  <div id="app">
    <ModalManager />
    <ContextMenuManager />
    <NuxtPage />
    <Notification />
  </div>
</template>

<script setup lang="ts">
import 'virtual:svg-icons-register';

useFavicon();
const preferences = usePreferencesStore();
const { setAppColor } = useAppColors();
const { setLocale } = useI18n();

const primaryColor = preferences.get('primaryColor');
const interfaceStyle = preferences.get('style');
const locale = preferences.get('locale');

/* Watchers to make sure app state reflects preferences */
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

watch(
  locale,
  newLocale => {
    if (newLocale) setLocale(newLocale);
  },
  { immediate: true },
);
</script>

<style lang="scss">
#app {
  height: 100vh;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

@media print {
  #app {
    height: auto;
    overflow: visible;
  }
}
</style>
