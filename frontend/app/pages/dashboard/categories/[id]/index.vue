<template>
  <div class="card-component">
    <header>
      <h1 style="font-size: 20px">Documents of category <tag class="blue">New</tag></h1>
      <div style="display: flex; align-items: center; gap: 8px">
        <NuxtLink @click="openPermissionsModal"><Icon name="users" :big="true" fill="var(--font-color)" /></NuxtLink>
        <NuxtLink :to="`/dashboard/categories/${categoryId}/edit`"><Icon name="settings" :big="true" fill="var(--font-color)" /></NuxtLink>
        <ViewSelection v-model="view" />
      </div>
    </header>
    <div v-if="documents.length">
      <div v-if="view == 'table'" class="line-container">
        <DocumentLine v-for="document of documents" :key="document.id" :document="document" class="line-item" />
      </div>
      <div v-else class="document-list">
        <DocumentsGrid :documents="documents" />
      </div>
    </div>
    <NoContent v-else style="width: 100%; height: 100%" title="No documents found" description="There are no documents in this category"
      ><NuxtLink to="/dashboard/docs/new"><AppButton type="link" style="font-weight: bold">+ Create new document </AppButton></NuxtLink>
    </NoContent>
  </div>
</template>

<script setup lang="ts">
import NodePermissions from '../../docs/_modals/NodePermissions.vue';
const route = useRoute();
const categoryId = route.params.id as string;
const nodesStore = useNodesStore();
const view: Ref<'table' | 'list'> = ref('list');

// definePageMeta({
//   breadcrumb: () => {
//     const category = nodesStore.getById(route.params.id as string);
//     return category?.name || '';
//   },
// });
const openPermissionsModal = () => useModal().add(new Modal(shallowRef(NodePermissions), { props: { nodeId: categoryId }, size: 'small' }));

const documents = computed(() => {
  const documents = nodesStore.getByCategories(categoryId);
  const childCategories = nodesStore.getChilds(categoryId);
  for (const childCategory of childCategories) {
    const childDocuments = nodesStore.getByCategories(childCategory.id);
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
