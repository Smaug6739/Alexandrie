<template>
  <div class="document-list">
    <div v-if="documents.length" v-for="document in documents" :key="document.id" class="document-card">
      <div>
        <header class="document-header">
          <i v-html="category?.icon" class="category-icon"></i>
          <NuxtLink :to="`/dashboard/docs/${document.id}`" class="document-title" :style="`border-bottom: 2px solid ${useColorHash(document.id)};`">{{ document.name }}</NuxtLink>
        </header>
        <p class="document-description">{{ document.description }}</p>
      </div>
      <div class="document-tags" v-if="document.tags">
        <span v-for="tag in document.tags.split(',')" :key="tag" class="tag blue">{{ tag.trim() }}</span>
      </div>
      <footer class="document-footer">
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
    <div v-else style="width: 100%; height: 100%">
      <div style="text-align: center; margin: 10vh auto">
        <h1>No documents found</h1>
        <img style="max-width: 300px; max-height: 300px" :src="`/empty-${colorMode.value}.png`" />
        <p>There are no documents in this category</p>
        <NuxtLink to="/dashboard/docs/new"><AppButton type="link">+ Create new document </AppButton></NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const categoriesStore = useCategoriesStore();
const documentsStore = useDocumentsStore();
const category = computed(() => categoriesStore.getById(route.params.id as string));
const colorMode = useColorMode();

definePageMeta({
  breadcrumb: () => {
    const category = useCategoriesStore().getById(useRoute().params.id as string);
    return category?.name || '';
  },
});
const documents = computed(() => {
  const documents = documentsStore.getByCategories(category.value?.id || '');
  const childCategories = categoriesStore.getChilds(category.value?.id || '');
  for (const childCategory of childCategories) {
    const childDocuments = documentsStore.getByCategories(childCategory.id);
    documents.push(...childDocuments);
  }
  return documents;
});
// Output ex: 10 Jan 2021
function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
}
</script>

<style scoped lang="scss">
h1 {
  font-size: 32px;
  margin-bottom: 20px;
}

.document-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  max-width: 420px * 3 + 100px;
  margin: 0 auto;
}

.document-card {
  border-radius: 10px;
  box-shadow: 0 4px 6px var(--border-color);
  overflow: hidden;
  width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s;
  flex: 0 1 auto;
}

.document-header {
  background-color: var(--bg-contrast-2);
  padding: 15px;
  display: flex;
  align-items: center;
}

.category-icon {
  font-size: 30px;
  margin-right: 10px;
}

.document-title {
  font-size: 18px;
  font-weight: bold;
  text-decoration: none;
}

.document-description {
  padding: 5px;
  font-size: 16px;
}

.document-tags {
  padding: 0 5px;
  margin-bottom: 10px;
  display: flex;
  flex-wrap: wrap;
}

.document-footer {
  padding: 15px;
  background-color: var(--bg-contrast);
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: #777;
  border-top: 1px solid var(--border-color);
}

.footer-item {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.footer-item svg {
  margin-right: 5px;
}

.category-icon {
  display: flex;
  align-items: center;

  &:deep(svg) {
    fill: var(--font-color);
    width: 35px;
    height: 35px;

    path {
      fill: var(--font-color);
    }
  }
}
</style>
