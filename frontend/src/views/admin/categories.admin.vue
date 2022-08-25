<template>
	<div>
		<admin-sidebar />
		<main class="view view-source">
			<h1>Dashboard: Catégories</h1>
			<Datatable :rows="displayArticles" :headers="tableOptions.headers" />
		</main>
	</div>
</template>
<script lang="ts">
import adminSidebar from '../../components/layout/admin-sidebar/Sidebar.vue';
import Datatable from '../../components/common/DataTable.vue';
import { useCategoriesStore } from '../../store';
import { defineComponent } from 'vue';
import type { Theme } from '../../store';
const store = useCategoriesStore();
export default defineComponent({
	name: 'admin-dashboard',
	components: {
		adminSidebar,
		Datatable,
	},
	data() {
		return {
			categories: [] as Theme[],
			tableOptions: {
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
			},
		}
	},
	computed: {
		displayArticles(): any {
			return this.categories.map(category => {
				return [
					{
						title: category.id,
						action: 'text'
					},
					{
						title: category.name,
						action: 'text'
					},
					{
						title: `/${category.path}`,
						action: 'text'
					},
					{
						title: category.icon,
						action: 'text'
					},
					{
						title: '/admin/categories/edit/' + category.id,
						action: 'link'
					}
				]
			}).reverse();
		},
	},
	async beforeMount() {
		this.categories = await store.getAll();
	},
});

</script>