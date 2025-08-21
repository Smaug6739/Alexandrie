<template>
  <div class="document-list">
    <DocumentCard v-for="document in documents" :key="document.id" :document="document" />
    <div v-if="!documents.length" style="width: 100%; height: 100%">
      <div style=" margin: 10vh auto;text-align: center">
        <h1>No documents found</h1>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Document } from '@/stores';
defineProps<{ documents: Document[] }>();
</script>

<style scoped lang="scss">
.document-list {
  display: grid;
  width: 100%;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}
</style>
