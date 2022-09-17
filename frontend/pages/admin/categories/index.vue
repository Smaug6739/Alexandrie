<template>
	<div>
		<span class="btn btn-theme" @click="$router.push('/admin/categories/new')">New</span>
		<Datatable :rows="displayArticles" :headers="tableOptions.headers" />
	</div>
</template>
<script lang="ts" setup>
import Datatable from '@/components/common/DataTable.vue';
import { useCategoriesStore } from '@/store';
import { computed } from 'vue';

const { getAll: getCategories } = useCategoriesStore();

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

const displayArticles = computed(() => {
	return getCategories.map(category => {
		return [
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
	}).reverse();
});



</script>