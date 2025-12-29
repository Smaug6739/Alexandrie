<template>
  <div class="no-content">
    <h1>{{ title || 'Nothing here' }}</h1>
    <img :src="`/empty-${colorMode.value}.png`" alt="" />
    <p>{{ description }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ title?: string; description?: string }>();

const colorMode = useColorMode();
</script>

<style scoped lang="scss">
.no-content {
  margin: 5vh auto;
  text-align: center;

  img {
    max-width: 300px;
    max-height: 300px;
  }
}
</style>
