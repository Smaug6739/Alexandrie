<template>
  <div class="page-card">
    <h2 style="text-align: center">Search documents</h2>
    <DataTable :headers="headers" :rows="rows">
      <template #actions="{ cell }">
        <NuxtLink :to="`/dashboard/admin/users/${route.params.id}/documents/${(cell?.data as Node).id}`"><Icon name="view" /></NuxtLink>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import type { Node } from '~/stores';

definePageMeta({ breadcrumb: 'Nodes' });

const categoriesStore = useNodesStore();
const store = useAdminStore();

const route = useRoute();
const { numericDate } = useDateFormatters();

const nodes = ref<Node[]>([]);

watchEffect(async () => {
  nodes.value = (await store.fetchUserDocuments(route.params.id as string)) || [];
});

const headers = [
  { label: 'Name', key: 'name' },
  { label: 'Category', key: 'category' },
  { label: 'Tags', key: 'tags' },
  { label: 'Last update', key: 'last_update' },
  { label: 'Attributes', key: 'attributes' },
  { label: 'Actions', key: 'actions' },
];
const rows = computed(() =>
  nodes.value.map(doc => {
    let badges = '';
    switch (doc.role) {
      case 1:
        badges = '<tag class="primary">Workspace</tag>';
        break;
      case 2:
        badges = '<tag class="red">Category</tag>';
        break;
      case 3:
        badges = '<tag class="green">Document</tag>';
        break;
      case 4:
        badges = '<tag class="yellow">Resource</tag>';
        break;
    }
    if (doc.parent_id) badges += '<tag class="yellow">Child</tag>';
    if (nodes.value.some(d => d.parent_id === doc.id)) badges += '<tag class="yellow">Parent</tag>';
    return {
      name: { content: doc.name, type: 'text' as const },
      category: { content: categoriesStore.getById(doc.parent_id || '')?.name || '', type: 'text' as const },
      tags: { content: stringToBadge(doc.tags), type: 'html' as const },
      last_update: { content: numericDate(doc.updated_timestamp), type: 'text' as const },
      attributes: { content: badges, type: 'html' as const },
      actions: { type: 'slot' as const, data: { id: doc.id } },
    };
  }),
);

function stringToBadge(str?: string): string {
  if (str?.length)
    return str
      .trim()
      .split(',')
      .map(t => `<tag class="blue">${t.trim()}</tag>`)
      .join('');
  return '';
}
</script>
