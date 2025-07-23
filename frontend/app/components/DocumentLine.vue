<template>
  <div class="document-line">
    <header>
      <div class="category-icon">
        <Icon :name="category?.icon || 'files'" :class="`category-icon ${getAppColor(category?.color as number) || 'primary'}`" />
      </div>

      <NuxtLink :to="`/dashboard/docs/${document.id}`" class="document-title">{{ document.name }}</NuxtLink>
      <span class="tags" v-if="document.tags">
        <tag v-for="tag in document.tags?.split(', ')" :key="tag" class="primary">{{ tag }}</tag>
      </span>
    </header>
    <p class="description">{{ document.description }}</p>
    <footer>
      <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="var(--font-color)">
        <path
          d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"
        />
      </svg>
      <span class="date">{{ formatDate(parseInt(document.updated_timestamp)) }}</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import type { Document } from '@/stores';
const props = defineProps<{ document: Document }>();
const categoriesStore = useCategoriesStore();
const category = computed(() => categoriesStore.getById(props.document.category || ''));
</script>

<style scoped lang="scss">
.document-line {
  display: flex;
  flex-direction: column;
  padding: 12px;
  border: 1px solid var(--border-color);
}
header {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
  justify-content: flex-start;
  border: none;
}
.category-icon {
  margin-right: 5px;
  padding: 4px 6px;
  border-radius: 6px;
}
.document-title {
  margin-right: 5px;
  font-size: 18px;
  font-weight: bold;
  text-decoration: none;
}
.description {
  padding: 4px 0;
  font-size: 16px;
  height: 100%;
  overflow: hidden;
  margin: 0;
  text-overflow: ellipsis;
}
footer {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 14px;
  margin-top: 8px;
}
.tags {
  display: flex;
  flex-wrap: wrap;
}
</style>
