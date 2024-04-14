<template>
	<div class="view-medium">
		<h1>Documents de la catégorie {{ category?.name }}</h1>
		<div class="article-list">
			<div v-for="document in allDocuments" :key="document.id" class="article"
				:style="`border-bottom: 4px solid ${useColorHash(document.id)};`">
				<div>
					<NuxtLink :to="`/dashboard/doc/${document.id}`">{{ document.name }}</NuxtLink>
					<p class="description">{{ document.description }}</p>
				</div>
				<p>{{ formatDate(parseInt(document.created_timestamp)) }}</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useCategoriesStore, useDocumentsStore } from '~/store';

const route = useRoute();
const categoriesStore = useCategoriesStore();
const documentsStore = useDocumentsStore();

const category = computed(() => categoriesStore.getById(route.params.id as string));

const allDocuments = computed(() => {
	const documents = documentsStore.getByCategories(category.value?.id || '');
	const childCategories = categoriesStore.getChilds(category.value?.id || '');
	for (const childCategory of childCategories) {
		const childDocuments = documentsStore.getByCategories(childCategory.id);
		documents.push(...childDocuments);
	}
	return documents;
});

// Output ex: 10 Jan 2021
function formatDate(timestamp: number): string {
	const date = new Date(timestamp);
	return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
}

</script>


<style scoped lang="scss">
.article-list {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
	gap: 20px;
}

.article {
	background-color: var(--bg-contrast);
	padding: 15px;
	border-radius: 8px;
	position: relative;
	transition: box-shadow $transition-duration;
	margin-bottom: 10px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

h1 {
	font-size: 28px;
	margin-bottom: 20px;
}

a {
	font-size: 24px;
	font-weight: 600;
	margin: 0;
}

.description {
	font-size: 16px;
	margin: 10px 0;
}
</style>
