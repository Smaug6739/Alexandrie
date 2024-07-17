<template>
	<h2 style="text-align: center;">Rechercher un document</h2>
	<DataTable :headers="headers" :rows="rows" />
</template>

<script setup lang="ts">
import { useDocumentsStore, useCategoriesStore } from '~/store';

const documents = computed(() => useDocumentsStore().getAll)
const categoriesStore = useCategoriesStore();
const headers = [
	{ title: 'Name' },
	{ title: 'Category' },
	{ title: 'Created At' },
	{ title: 'Updated At' },
	{ title: 'Actions' },
];
const rows = computed(() => documents.value.map((doc) => {
	return {
		fields: [
			{ content: doc.name, action: `/dashboard/docs/${doc.id}` },
			{ content: categoriesStore.getById(doc.category || '')?.name || '', action: `/dashboard/categories/${doc.category}` },
			{ content: new Date(parseInt(doc.created_timestamp)).toDateString() },
			{ content: new Date(parseInt(doc.updated_timestamp)).toDateString() },
			{ content: 'View document', action: `/dashboard/docs/${doc.id}` },
		],
	};
}));
</script>
