<template>
  <div id="app">
    <div id="app-loader"></div>
    <div id="backdrop"></div>
    <BackToTop />
    <NuxtPage />
    <p style="text-align:center;margin-top:3%;margin-top: auto;">MIT Licensed | Copyright © 2021-2022</p>
  </div>
</template>

<script setup lang="ts">
import BackToTop from "@/components/back-to-top/index"

import { useCategoriesStore } from "./store/categories.store";
import { useArticlesStore } from "./store/articles.store";

useCategoriesStore().fetchCategories();
useArticlesStore().fetchArticles();

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
