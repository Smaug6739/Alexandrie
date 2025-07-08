<template>
  <div class="card-component">
    <header>
      <h1 style="font-size: 20px">Documents of category <tag class="blue">New</tag></h1>
    </header>
    <div class="document-list">
      <div v-if="documents.length" v-for="document in documents" :key="document.id" class="document-card">
        <div>
          <header class="document-header">
            <Icon :name="category(document.category)?.icon || ''" :class="`category-icon ${getAppColor(category(document.category)?.color as number)}`" />
            <NuxtLink :to="`/dashboard/docs/${document.id}`" :class="`document-title`" :style="`color: var(--${getAppColor(category(document.category)?.color as number)})`">{{ document.name }}</NuxtLink>
          </header>
          <p class="document-description">{{ document.description }}</p>
        </div>
        <div class="document-tags" v-if="document.tags">
          <tag v-for="tag in document.tags.split(',')" :key="tag" class="blue">{{ tag.trim() }}</tag>
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
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const mainCategoryId = route.params.id as string;
const categoriesStore = useCategoriesStore();
const documentsStore = useDocumentsStore();
const category = (cat_id?: string) => categoriesStore.getById(cat_id || mainCategoryId);
const colorMode = useColorMode();

definePageMeta({
  breadcrumb: () => {
    const category = useCategoriesStore().getById(useRoute().params.id as string);
    return category?.name || '';
  },
});
const documents = computed(() => {
  const documents = documentsStore.getByCategories(mainCategoryId);
  const childCategories = categoriesStore.getChilds(mainCategoryId);
  for (const childCategory of childCategories) {
    const childDocuments = documentsStore.getByCategories(childCategory.id);
    documents.push(...childDocuments);
  }
  return documents;
});
function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
}
</script>

<style scoped lang="scss">
.document-list {
  border-top: 1px solid #ddd;
  padding: 10px 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 20px;
  width: 100%;
}

.document-card {
  border-radius: 6px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  min-width: 340px;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
}

.document-header {
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

.document-description {
  padding: 5px;
  font-size: 16px;
  height: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.document-tags {
  padding: 0 5px;
  margin-bottom: 10px;
  display: flex;
  flex-wrap: wrap;
}

.document-footer {
  padding: 10px;
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
}

.footer-item svg {
  margin-right: 5px;
}
</style>
