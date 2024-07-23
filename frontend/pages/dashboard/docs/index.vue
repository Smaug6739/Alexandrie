<template>
  <h2 style="text-align: center">Search documents</h2>
  <DataTable :headers="headers" :rows="rows" />
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
const rows: any = computed(() =>
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
    const seeIcon = ` <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" style="margin:0 5px;" fill="var(--font-color-light)"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/></svg>`;
    const editIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" style="margin:0 5px;" fill="var(--font-color-light)"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>`;
    return {
      name: { content: doc.name, type: 'link', to: `/dashboard/docs/${doc.id}` },
      category: { content: categoriesStore.getById(doc.category || '')?.name || '' },
      tags: {
        content: doc.tags?.trim().length
          ? doc.tags
              ?.trim()
              .split(',')
              .map(t => `<span class="tag blue">${t.trim()}</span>`)
              .join('')
          : '',
        type: 'html',
      },
      last_update: { content: new Date(parseInt(doc.updated_timestamp)).toLocaleDateString() },
      status: { content: badges, type: 'html' },
      actions: { content: seeIcon + editIcon, type: 'link', to: `/dashboard/docs/${doc.id}` },
    };
  }),
);
</script>
