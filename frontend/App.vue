<template>
  <div id="app">
    <div id="app-loader"></div>
    <Navbar />
    <NuxtPage />
    <p style="text-align:center;margin-top:3%;margin-top: auto;">MIT Licensed | Copyright © 2021-2022</p>
  </div>
</template>

<script setup lang="ts">
import Navbar from "./components/layout/navbar/Navbar.vue";
</script>

<style scoped>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  color: var(--font-color);
  max-width: 100% !important;
}
</style>
