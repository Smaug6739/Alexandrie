<template>
	<div>
		<span class="btn btn-theme" @click="$router.push('/admin/articles/new')">New</span>
		<Datatable :rows="displayArticles" :headers="tableOptions.headers" />
	</div>

</template>
<script lang="ts" setup>
import Datatable from '@/components/DataTable.vue';
import { useArticlesStore } from '@/store';
import { timestampToString } from '@/helpers/date';

const articles = useArticlesStore().getAll;

const tableOptions = {
	headers: [
		{
			title: 'Title',
			key: 'title',
			sortable: true,
			textAlign: 'left',
		},
		{
			title: 'Description (short)',
			key: 'description',
			sortable: true,
			textAlign: 'left',
		},
		{
			title: 'Created At',
			key: 'created_at',
			sortable: true,
			textAlign: 'left',
		},
		{
			title: 'Updated At',
			key: 'updated_at',
			sortable: true,
			textAlign: 'left',
		},
		{
			title: 'Actions',
			key: 'actions',
			sortable: false,
			textAlign: 'left',
		},
	],
	itemsPerPage: 10,
}
const displayArticles = computed(() => {
	const results = [];
	for (const article of articles) {
		results.push({
			fields: [
				{
					content: article.name,
					action: 'text' as const,
				},
				{
					content: article.description,
					action: 'text' as const,
				},
				{
					content: timestampToString(article.created_timestamp),
					action: 'text' as const,
				},
				{
					content: timestampToString(article.updated_timestamp),
					action: 'text' as const,
				},
				{
					content: '/admin/articles/edit-' + article.id,
					action: 'link' as const,
				}
			]
		});
	}
	return results;
})



</script>