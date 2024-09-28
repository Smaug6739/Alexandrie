<template>
  <h2 style="text-align: center">Search documents</h2>
  <DataTable :headers="headers" :rows="rows">
    <template #actions="{ cell }">
      <NuxtLink :to="`/dashboard/docs/${cell?.data.id}`" class="btn btn-primary"><Icon name="view" /></NuxtLink>
      <NuxtLink :to="`/dashboard/docs/edit/${cell?.data.id}`" class="btn btn-primary"><Icon name="edit" /></NuxtLink>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
const documents = computed(() => useDocumentsStore().getAll);
const categoriesStore = useCategoriesStore();
const headers = [
  { label: 'Name', key: 'name' },
  { label: 'Category', key: 'category' },
  { label: 'Tags', key: 'tags' },
  { label: 'Last update', key: 'last_update' },
  { label: 'Status', key: 'status' },
  { label: 'Actions', key: 'actions' },
];
const rows = computed(() =>
  documents.value.map(doc => {
    let badges = '';
    switch (doc.accessibility) {
      case 1:
        badges = '<span class="tag green">Document</span>';
        break;
      case 2:
        badges = '<span class="tag turquoise">Draft</span>';
        break;
      case 3:
        badges = '<span class="tag red">Archived</span>';
    }
    if (doc.parent_id) badges += '<span class="tag yellow">Child</span>';
    if (documents.value.some(d => d.parent_id === doc.id)) badges += '<span class="tag yellow">Parent</span>';
    return {
      name: { content: doc.name, type: 'text' as const },
      category: { content: categoriesStore.getById(doc.category || '')?.name || '', type: 'text' as const },
      tags: { content: stringToBadge(doc.tags), type: 'html' as const },
      last_update: { content: new Date(parseInt(doc.updated_timestamp)).toLocaleDateString(), type: 'text' as const },
      status: { content: badges, type: 'html' as const },
      actions: { type: 'slot' as const, data: { id: doc.id } },
    };
  }),
);

function stringToBadge(str?: string): string {
  if (str?.length)
    return str
      .trim()
      .split(',')
      .map(t => `<span class="tag blue">${t.trim()}</span>`)
      .join('');
  return '';
}
</script>
