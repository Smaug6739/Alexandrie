<script setup lang="ts">
import Heading from './components/Heading.vue'
import Heroes from './components/Heroes.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div style="height: 100%; display: flex; flex-direction: column;">
    <div
      style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 2rem; flex: 1;">
      <Heading />
      <Heroes />
    </div>
    <Footer />
  </div>
</template>