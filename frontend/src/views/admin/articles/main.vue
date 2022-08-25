<template>
	<div>
		<Datatable :rows="displayArticles" :headers="tableOptions.headers" />
	</div>

</template>
<script lang="ts">
import adminSidebar from '../../../components/layout/admin-sidebar/Sidebar.vue';
import Datatable from '../../../components/common/DataTable.vue';
import { useArticlesStore } from '../../../store';
import { defineComponent } from 'vue';
import { Article } from '../../../store';
const store = useArticlesStore();
export default defineComponent({
	name: 'admin-dashboard',
	components: {
		adminSidebar,
		Datatable,
	},
	data() {
		return {
			articles: [] as Article[],
			tableOptions: {
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
			},
		}
	},
	computed: {
		displayArticles(): any {
			return this.articles.map(article => {
				return [
					{
						title: article.name,
						action: 'text'
					},
					{
						title: article.description,
						action: 'text'
					},
					{
						title: article.created_timestamp,
						action: 'text'
					},
					{
						title: article.updated_timestamp,
						action: 'text'
					},
					{
						title: '/admin/articles/edit/' + article.id,
						action: 'link'
					}
				]
			}).reverse();
		},
	},
	async beforeMount() {
		this.articles = await store.getAllPage();
	},
});

</script>