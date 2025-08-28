<template>
  <div style=" margin: 5vh auto;text-align: center">
    <h1>{{ title || 'Nothing here' }}</h1>
    <img style="max-width: 300px; max-height: 300px" :src="`/empty-${colorMode.value}.png`" />
    <p>{{ description }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode();
defineProps<{ title?: string; description?: string }>();
</script>
