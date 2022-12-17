<template>
	<div class="stats">
		<div class="stat">
			<p>Articles: {{ articlesStore.articles.length }}</p>
		</div>
		<div class="stat">
			<p>Categories: {{ categoriesStore.categories.length }}</p>
		</div>
		<div class="stat">
			<p>Sub-categories: {{ subCategoriesLength }}</p>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { useArticlesStore, useCategoriesStore } from '@/store';
const articlesStore = useArticlesStore();
const categoriesStore = useCategoriesStore();
const subCategoriesLength = computed(() => {
	return categoriesStore.categories.reduce((acc, category) => {
		return acc + category.categories.length;
	}, 0);
});
</script>

<style lang="scss" scoped>
.stats {
	display: flex;

	.stat {
		background: var(--contrast-color);
		border-radius: 5px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		padding: 0.5rem;
		margin: 1rem;
		text-align: center;

		p {
			font-weight: 700;
			font-size: 2rem;
			margin: 0;
			font-size: 1.6rem;
			margin: 0;
		}


	}
}
</style>