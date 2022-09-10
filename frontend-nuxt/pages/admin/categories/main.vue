<template>
	<div>
		<span class="btn btn-pink" @click="$router.push('/admin/categories/new')">New</span>
		<Datatable :rows="displayArticles" :headers="tableOptions.headers" />
	</div>
</template>
<script lang="ts">
import Datatable from '../../../components/common/DataTable.vue';
import { useCategoriesStore } from '../../../store';
import { defineComponent } from 'vue';
import type { Theme } from '../../../store';
export default defineComponent({
	name: 'admin-dashboard',
	components: {
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
		const store = useCategoriesStore();
		this.categories = await store.getAll();
	},
});
</script>