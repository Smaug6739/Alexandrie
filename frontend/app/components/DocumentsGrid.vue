<template>
  <div class="document-list">
    <DocumentCard v-for="document in documents" :key="document.id" :document="document" />
  </div>
</template>

<script setup lang="ts">
import type { Node } from '~/stores';
defineProps<{ documents: Node[] }>();
</script>

<style scoped lang="scss">
.document-list {
  display: grid;
  width: 100%;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}
</style>
