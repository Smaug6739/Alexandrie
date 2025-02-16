<template>
  <div style="text-align: center; margin: 10vh auto; gap: 20px">
    <h1>Alexandrie dashboard</h1>
    <img style="max-width: 300px; max-height: 300px" :src="`/empty-${colorMode.value}.png`" /> <br />
    <NuxtLink to="/dashboard/docs/new"><AppButton type="link">+ Create new document </AppButton></NuxtLink>
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode();
</script>
<style scoped>
h1 {
  font-size: 32px;
  margin-bottom: 20px;
}
</style>
