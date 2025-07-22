<template>
  <div class="card-component">
    <header>
      <h1 style="font-size: 20px">Documents of category <tag class="blue">New</tag></h1>
      <ViewSelection v-model="view" />
    </header>
    <div v-if="view == 'table'" class="line-container">
      <DocumentLine v-for="document of documents" :document="document" class="line-item" :key="document.id" />
    </div>
    <div v-else class="document-list">
      <DocumentsGrid :documents="documents" />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const mainCategoryId = route.params.id as string;
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
  const documents = documentsStore.getByCategories(mainCategoryId);
  const childCategories = categoriesStore.getChilds(mainCategoryId);
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
