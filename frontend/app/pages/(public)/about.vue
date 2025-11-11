<template>
  <main class="about-page">
    <AppAbout />
  </main>
</template>

<script setup lang="ts">
import AppAbout from '~/components/AppAbout.vue';

definePageMeta({
  breadcrumb: 'About',
});
</script>

<style scoped lang="scss">
.about-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1rem 4rem;
}
</style>
