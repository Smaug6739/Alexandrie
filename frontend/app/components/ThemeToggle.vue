<template><AppBtnIcon :icon="colorMode.value === 'light' ? 'theme_light' : 'theme_dark'" @click="toggleColorMode" /></template>

<script setup lang="ts">
const colorMode = useColorMode();
const preferences = usePreferencesStore();
const toggleColorMode = () => {
  if (colorMode.value === 'light') {
    colorMode.preference = 'dark';
    preferences.set('darkMode', true);
  } else {
    colorMode.preference = 'light';
    preferences.set('darkMode', false);
  }
  document.body.style.colorScheme = colorMode.preference;
};
</script>
