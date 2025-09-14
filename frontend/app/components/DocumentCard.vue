<template>
  <div class="document-card">
    <div class="top">
      <div class="header">
        <span style="display: flex">
          <Icon :name="category?.icon || 'files'" :class="`category-icon ${getAppColor(document.color || category?.color as number, true)}`" />
          <NuxtLink :to="`/dashboard/docs/${document.id}`" class="document-title">{{ document.name }}</NuxtLink>
        </span>
        <DocumentDotMenu :document="document" :user="user" @delete="deleteDoc" />
      </div>
      <div class="body">
        <div class="category">{{ category?.name }}</div>
        <div v-if="document.tags" class="tags">
          <tag v-for="tag in document.tags.split(',')" :key="tag" class="primary">{{ tag.trim() }}</tag>
        </div>
        <p class="description" v-text="document.description" />
      </div>
    </div>
    <footer>
      <div class="footer-item">
        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="var(--font-color)">
          <path
            d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"
          />
        </svg>
        <span>{{ formatDate(parseInt(document.created_timestamp)) }}</span>
      </div>
      <div class="footer-item">
        <span>Updated : {{ formatDate(parseInt(document.updated_timestamp)) }}</span>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import type { Node } from '@/stores';
import DeleteDocumentModal from '~/pages/dashboard/docs/_modals/DeleteDocumentModal.vue';

const props = defineProps<{ document: Node }>();
const nodesStore = useNodesStore();
const category = computed(() => nodesStore.getById(props.document.parent_id || ''));
const user = useUserStore().user;
const deleteDoc = () => useModal().add(new Modal(shallowRef(DeleteDocumentModal), { props: { documentId: props.document.id } }));
</script>

<style scoped lang="scss">
.document-card {
  display: flex;
  max-width: 380px;
  min-height: 250px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  flex-direction: column;
  justify-content: space-between;
}

.header {
  display: flex;
  padding: 12px;
  align-items: center;
  justify-content: space-between;
}

.category-icon {
  width: 30px;
  height: 30px;
  padding: 6px;
  border-radius: 6px;
  margin-right: 10px;
}

.document-title {
  font-size: 18px;
  font-weight: bold;
  color: var(--font-color-dark);
}

.body {
  padding: 4px 12px;
}

.category {
  font-size: 15.5px;
  color: var(--font-color-light);
  padding-bottom: 8px;
}

.description {
  height: 100%;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tags {
  display: flex;
  flex-wrap: wrap;
}

footer {
  display: flex;
  padding: 6px 12px;
  font-size: 14px;
  color: var(--font-color-light);
  border-top: 1px solid var(--border-color-accent);
  flex-direction: column;
}

.footer-item {
  display: flex;
  align-items: center;
}

.footer-item svg {
  margin-right: 5px;
}
</style>
