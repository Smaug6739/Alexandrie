<template>
	<div class="categories-container">
		<NuxtLink to="/dashboard/categories/new" class="add-category-btn">+ Ajouter une catégorie</NuxtLink>

		<!-- Main Categories -->
		<div v-for="mainCategory in categoriesStore.getParents" :key="mainCategory.id" class="category-group">

			<div class="category-card main-category">
				{{ mainCategory.name }}
				<div class="action-menu">
					<NuxtLink :to="'/dashboard/categories/edit?category=' + mainCategory.id">✎</NuxtLink>
				</div>
			</div>

			<!-- Sub Categories -->
			<div class="sub-categories">
				<div v-for="subCategory in categoriesStore.getChilds(mainCategory.id)" :key="subCategory.id"
					class="category-card sub-category">
					{{ subCategory.name }}
					<div class="action-menu">
						<NuxtLink :to="'/dashboard/categories/edit?category=' + subCategory.id">✎</NuxtLink>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.categories-container {
	display: flex;
	flex-wrap: wrap;
	gap: 30px;
	padding: 20px;
}

.add-category-btn {
	background: none;
	color: var(--blue);
	cursor: pointer;
	font-size: 1.1em;
	margin-top: 20px;
}

.category-group {
	width: 100%;
	border-bottom: 2px solid var(--border-color);
	padding-bottom: 20px;
	margin-bottom: 20px;
}

.category-card {
	background-color: var(--bg-contrast);
	padding: 15px;
	border-radius: 8px;
	position: relative;
	transition: box-shadow $transition-duration;
	margin-bottom: 10px;

	&:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
	}
}


.main-category {
	font-weight: bold;
	font-size: 1.2em;
}

.sub-categories {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 20px;

	@media screen and (min-width: 768px) {
		grid-template-columns: repeat(3, 1fr);
	}
}

.action-menu {
	position: absolute;
	top: 8px;
	right: 8px;
	font-size: 1.5em;
}
</style>
<script lang="ts" setup>
import { useCategoriesStore } from '~/stores'; // Adjust the path accordingly
const categoriesStore = useCategoriesStore();
</script>