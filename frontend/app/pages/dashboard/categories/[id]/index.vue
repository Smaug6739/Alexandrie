<template>
  <div class="card-component">
    <header>
      <h1 style="font-size: 20px">Documents of category <tag class="blue">New</tag></h1>
      <div style="display: flex; align-items: center; gap: 8px">
        <NuxtLink :to="`/dashboard/categories/${categoryId}/edit`"><Icon name="settings" :big="true" fill="var(--font-color)" /></NuxtLink>
        <ViewSelection v-model="view" />
      </div>
    </header>
    <div v-if="view == 'table'" class="line-container">
      <DocumentLine v-for="document of documents" :key="document.id" :document="document" class="line-item" />
    </div>
    <div v-else class="document-list">
      <DocumentsGrid :documents="documents" />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const categoryId = route.params.id as string;
const categoriesStore = useCategoriesStore();
const documentsStore = useDocumentsStore();
const view: Ref<'table' | 'list'> = ref('list');

definePageMeta({
  breadcrumb: () => {
    const category = useCategoriesStore().getById(useRoute().params.id as string);
    return category?.name || '';
  },
});
const documents = computed(() => {
  const documents = documentsStore.getByCategories(categoryId);
  const childCategories = categoriesStore.getChilds(categoryId);
  for (const childCategory of childCategories) {
    const childDocuments = documentsStore.getByCategories(childCategory.id);
    documents.push(...childDocuments);
  }
  return documents;
});
</script>

<style scoped lang="scss">
.line-container {
  display: flex;
  flex-direction: column;
}

.line-item:first-child {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.line-item:last-child {
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}
</style>
