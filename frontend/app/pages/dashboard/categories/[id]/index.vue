<template>
  <div class="card-component">
    <header>
      <h1 style="font-size: 20px">Documents of category <tag class="blue">New</tag></h1>
      <div style="display: flex; align-items: center; gap: 8px">
        <NuxtLink @click="openPermissionsModal"><Icon name="manage_access" :big="true" fill="var(--font-color)" /></NuxtLink>
        <NuxtLink :to="`/dashboard/categories/${node?.id}/edit`"><Icon name="settings" :big="true" fill="var(--font-color)" /></NuxtLink>
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
import NodePermissions from '@/components/Node/NodePermissions.modal.vue';
import type { Node } from '~/stores';
const route = useRoute();
const categoryId = route.params.id as string;
const nodesStore = useNodesStore();
const view: Ref<'table' | 'list'> = ref('list');
const node = ref<Node | undefined>();
const error = ref<string>('');

definePageMeta({
  breadcrumb: () => {
    const doc = useNodesStore().getById(useRoute().params.id as string);
    return doc?.name || '';
  },
});

watchEffect(async () => {
  node.value = nodesStore.getById(categoryId);
  if (!node.value) error.value = 'Document not found';
});

const openPermissionsModal = () => {
  if (node.value) useModal().add(new Modal(shallowRef(NodePermissions), { props: { node: node.value }, size: 'small' }));
};

const documents = computed(() => {
  return nodesStore.getAllChildrens(node.value?.id || '').filter(d => d.role == 3);
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
