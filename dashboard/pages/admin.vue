<template>
	<div>
		<main class="view-large">
			<admin-sidebar />
			<h1>Dashboard: Admin</h1>
			<NuxtPage />
		</main>
	</div>
</template>
<script lang="ts" setup>
import adminSidebar from '@/components/layout/admin-sidebar/Sidebar.vue';
import { useArticlesStore, useCategoriesStore } from '@/store';
const store = useArticlesStore();
const categoriesStore = useCategoriesStore();
store.fetchArticles();
categoriesStore.fetchCategories();
</script>
