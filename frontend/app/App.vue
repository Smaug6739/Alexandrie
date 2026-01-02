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

useFavicon();
const preferences = usePreferences();
const { setAppColor } = useAppColors();

const primaryColor = computed(() => preferences.get('primaryColor').value);

watch(
  primaryColor,
  color => {
    setAppColor(Number(color));
  },
  { immediate: true },
);
</script>
