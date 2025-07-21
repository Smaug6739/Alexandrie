<template>
  <div class="card-component">
    <header>
      <h1 style="font-size: 20px">Documents of category <tag class="blue">New</tag></h1>
    </header>
    <div class="document-list">
      <DocumentsGrid v-if="documents.length" :documents="documents" />
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
</script>
