<template>
  <div class="document-card">
    <header>
      <Icon :name="category(document.category)?.icon || 'files'" :class="`category-icon ${getAppColor(category(document.category)?.color as number) || 'primary'}`" />
      <NuxtLink :to="`/dashboard/docs/${document.id}`" :class="`document-title`" :style="`color: var(--${getAppColor(category(document.category)?.color as number)})`">{{ document.name }}</NuxtLink>
    </header>
    <div class="tags" v-if="document.tags">
      <tag v-for="tag in document.tags.split(',')" :key="tag" class="primary">{{ tag.trim() }}</tag>
    </div>
    <p class="description" v-text="document.description"></p>
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
import type { Document } from '@/stores';
defineProps<{ document: Document }>();
const categoriesStore = useCategoriesStore();
const category = (cat_id?: string) => categoriesStore.getById(cat_id || '');
function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
}
</script>

<style scoped lang="scss">
.document-card {
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 10px var(--shadow);
  overflow: hidden;
  min-width: 340px;
  max-width: 400px;
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
}

header {
  background-color: var(--bg-contrast-2);
  padding: 12px;
  display: flex;
  align-items: center;
}

.category-icon {
  margin-right: 10px;
  padding: 6px;
  border-radius: 6px;
}

.document-title {
  font-size: 18px;
  font-weight: bold;
  text-decoration: none;
}

.description {
  padding: 8px;
  font-size: 16px;
  height: 100%;
  overflow: hidden;
  margin: 0;
  text-overflow: ellipsis;
}

.tags {
  padding: 6px 5px;
  display: flex;
  flex-wrap: wrap;
}

footer {
  padding: 10px;
  background-color: var(--bg-contrast);
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: #777;
  border-top: 1px solid var(--border-color-accent);
}

.footer-item {
  display: flex;
  align-items: center;
}

.footer-item svg {
  margin-right: 5px;
}
</style>
