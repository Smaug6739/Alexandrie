<template>
  <div class="card-component">
    <header>
      <h1>Documents <tag blue>New</tag></h1>
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
const view: Ref<'table' | 'list'> = ref('list');
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
        badges = '<tag class="green">Document</tag>';
        break;
      case 2:
        badges = '<tag class="teal">Draft</tag>';
        break;
      case 3:
        badges = '<tag class="red">Archived</tag>';
    }
    if (doc.parent_id) badges += '<tag class="yellow">Child</tag>';
    if (documents.value.some(d => d.parent_id === doc.id)) badges += '<tag class="yellow">Parent</tag>';
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
      .map(t => `<tag class="blue">${t.trim()}</tag>`)
      .join('');
  return '';
}
</script>

<style scoped lang="scss">
// Line container first item radius:
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
