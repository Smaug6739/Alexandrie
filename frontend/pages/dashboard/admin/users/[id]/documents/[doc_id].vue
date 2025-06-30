<template>
  <div class="card-component" style="height: 100%">
    <h1>Document view</h1>
    <div v-if="document" style="width: 100%; height: 95%; display: flex; flex-direction: column; min-height: 0">
      <h2>{{ document.name }}</h2>
      <p>{{ document.description }}</p>
      <div style="display: flex; gap: 10px; flex: 1; width: 100%; overflow: auto; min-height: 0">
        <textarea style="flex: 1">{{ document.content_markdown }}</textarea>
        <div style="flex: 1" v-html="document.content_html"></div>
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
.user-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  width: 100%;
}

.user-detail {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  width: 100%;
}

label {
  font-weight: bold;
}
button {
  margin-top: 1rem;
}
</style>
