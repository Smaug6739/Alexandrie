<template>
	<div>
		<span class="btn btn-pink" @click="$router.push('/admin/articles/new')">New</span>
		<Datatable :rows="displayArticles" :headers="tableOptions.headers" />
	</div>

</template>
<script lang="ts" setup>
import Datatable from '@/components/common/DataTable.vue';
import { useArticlesStore } from '@/store';
import { timestampToString } from '@/helpers/date';
import { storeToRefs } from 'pinia';

const articlesStore = useArticlesStore();
const { getAll } = storeToRefs(articlesStore);

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
	return getAll.value.map(article => {
		return [
			{
				title: article.name,
				action: 'text' as const,
			},
			{
				title: article.description,
				action: 'text' as const,
			},
			{
				title: timestampToString(article.created_timestamp),
				action: 'text' as const,
			},
			{
				title: timestampToString(article.updated_timestamp),
				action: 'text' as const,
			},
			{
				title: '/admin/articles/edit-' + article.id,
				action: 'link' as const,
			}
		]
	}).reverse();
})



</script>