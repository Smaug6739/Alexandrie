<template>
	<div>
		<span class="btn btn-theme" @click="$router.push('/admin/categories/new')">New</span>
		<Datatable :rows="rows" :headers="headers">
			<template #actions="params">
				<span class="btn mini btn-theme" @click="$router.push(`/admin/categories/edit-${params?.row.id}`)">Edit</span>
			</template>
		</Datatable>
	</div>
</template>
<script lang="ts" setup>
import Datatable from '@/components/datatable/DataTable.vue';
import { useCategoriesStore } from '@/store';
import { computed } from 'vue';

const categories = useCategoriesStore().getAll;

const headers = [
	{
		label: 'Id',
		field: 'id',
	},
	{
		label: 'Name',
		field: 'name',
	},
	{
		label: 'Path',
		field: 'path',
	},
	{
		label: 'Icon',
		field: 'icon',
	},
	{
		label: 'Actions',
		field: 'actions',
	},
];
const rows = computed(() => {
	const results = [];
	for (const category of categories) {
		results.push({
			id: category.id,
			name: category.name,
			path: category.path,
			icon: category.icon,
		});
	}
	return results;
});



</script>

<style>
.mini {
	font-size: 0.9rem;
	padding: 0.1rem 0.1rem !important;
	margin: 0;
}
</style>