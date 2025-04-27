<template>
  <footer>
    <div style="display: flex; align-items: center; column-gap: 0.5rem">
      <img style="width: 50px" :src="`/Alexandrie-${colorMode.value}.svg`" alt="Alexandrie" />
      <NuxtLink to="/" style="font-weight: 600">Alexandrie</NuxtLink>
    </div>
    <p>Developed and designed by Smaug with ❤️</p>
  </footer>
</template>
<script setup lang="ts">
const colorMode = useColorMode();
</script>
<style scoped lang="scss">
footer {
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--border-color);
}

@media (max-width: 768px) {
  footer {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 2rem 1rem;
    margin: 0;
  }
  img {
    margin: 0 10px;
  }
  footer p {
    margin-top: 1rem;
  }
}
</style>
