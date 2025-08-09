<template>
  <div class="document-list">
    <DocumentCard v-if="documents.length" v-for="document in documents" :key="document.id" :document="document" />
    <div v-else style="width: 100%; height: 100%">
      <div style="text-align: center; margin: 10vh auto">
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
  grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
  gap: 20px;
  width: 100%;
}
</style>
