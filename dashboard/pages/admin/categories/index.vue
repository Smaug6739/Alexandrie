<template>
	<div>
		<span class="btn btn-theme" @click="$router.push('/admin/categories/new')">New</span>
		<Datatable :rows="displayCategories" :headers="tableOptions.headers" />
	</div>
</template>
<script lang="ts" setup>
import Datatable from '@/components/DataTable.vue';
import { useCategoriesStore } from '@/store';
import { computed } from 'vue';

const categories = useCategoriesStore().getAll;

const tableOptions = {
	headers: [
		{
			title: 'Id',
		},
		{
			title: 'Name',
		},
		{
			title: 'Path',
		},
		{
			title: 'Icon',
		},
		{
			title: 'Actions',
		},
	],
	itemsPerPage: 10,
}

const displayCategories = computed(() => {
	const results = [];
	for (const category of categories) {
		results.push({
			fields: [
				{
					content: category.id,
					action: 'text' as const,
				},
				{
					content: category.name,
					action: 'text' as const,
				},
				{
					content: `/${category.path}`,
					action: 'text' as const,
				},
				{
					content: category.icon,
					action: 'text' as const,
				},
				{
					content: '/admin/categories/edit-' + category.id,
					action: 'link' as const,
				}
			]
		});
	}
	return results;
});



</script>