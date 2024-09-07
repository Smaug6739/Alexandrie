<template>
  <div style="display: flex; align-items: center; column-gap: 0.5rem">
    <img style="width: 50px" :src="`/Alexandrie-${colorMode.value}.svg`" alt="Alexandrie" />
    <NuxtLink to="/" style="font-weight: 600">Alexandrie</NuxtLink>
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode();
</script>

<style scoped>
@media screen and (max-width: 768px) {
  p {
    display: none;
  }
  img {
    margin: 0 10px;
  }
}
</style>
