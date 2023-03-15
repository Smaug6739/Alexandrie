<template>
	<div>
		<span class="btn btn-theme" @click="$router.push('/admin/articles/new')">New</span>
		<Datatable :rows="displayArticles" :headers="headers">
			<template #actions="params">
				<span class="btn mini btn-theme" @click="$router.push(`/admin/articles/edit-${params?.row.id}`)">Edit</span>
			</template>
		</Datatable>
	</div>

</template>
<script lang="ts" setup>
import Datatable from '@/components/datatable/DataTable.vue';
import { useArticlesStore } from '@/store';
import { timestampToString } from '@/helpers/date';
import type { Header } from '@/components/datatable/dtypes';
const articles = useArticlesStore().getAll;

const headers: Header[] = [
	{
		label: 'Title',
		field: 'title',
	},
	{
		label: 'Description',
		field: 'description',
	},
	{
		label: 'Created At',
		field: 'created_at',
		representedAs: (row: any) => timestampToString(row.created_at),
	},
	{
		label: 'Updated At',
		field: 'updated_at',
		representedAs: (row: any) => timestampToString(row.updated_at),
	},
	{
		label: 'Actions',
		field: 'actions',
	},
];
const displayArticles = computed(() => {
	const results = [];
	for (const article of articles) {
		results.push({
			id: article.id,
			title: article.name,
			description: article.description.length > 40 ? article.description.substring(0, 40) + '...' : article.description,
			created_at: article.created_timestamp,
			updated_at: article.updated_timestamp,
		});
	}
	return results;
})

</script>

<style scoped>
.mini {
	font-size: 0.9rem;
	padding: 0.1rem 0.1rem !important;
	margin: 0;
}
</style>