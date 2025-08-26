<template>
  <div class="card-component" style="height: 100%">
    <h1>Document view</h1>
    <div v-if="document" style="display: flex; width: 100%; height: 95%; min-height: 0; flex-direction: column">
      <h2>{{ document.name }}</h2>
      <p>{{ document.description }}</p>
      <div style="display: flex; width: 100%; min-height: 0; flex: 1; gap: 10px; overflow: auto">
        <textarea v-model="document.content_markdown" style="flex: 1"></textarea>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div style="flex: 1" v-html="document.content_html" />
      </div>
    </div>

    <div v-else>No document found.</div>
  </div>
</template>

<script setup lang="ts">
import type { Document } from '@/stores';

definePageMeta({ breadcrumb: 'Document view' });
const document = ref<Document | undefined>();
const route = useRoute();
const store = useAdminStore();

document.value = await store.fetchUserDocument(route.params.id as string, route.params.doc_id as string);
</script>

<style scoped lang="scss">
.user-detail {
  display: flex;
  width: 100%;
  align-items: flex-start;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: bold;
}

button {
  margin-top: 1rem;
}
</style>
