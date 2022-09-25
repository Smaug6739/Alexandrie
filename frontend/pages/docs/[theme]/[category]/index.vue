<!--404 error page (not found )-->
<template>
	<div>
		<div class="view-medium">
			<div>
				<h1>
					Scientia</h1>
				<h2>{{ category?.name }}</h2>
				<div>
					Index de la catégorie {{ category?.name }}.
					<ul>
						<li v-for="(item, index) in articles" :key="index">
							<NuxtLink :to="`/docs/${route.params.theme}/${route.params.category}/${item.path}`">{{item.name}}
							</NuxtLink>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>
<style scoped>
h1,
h2 {
	border: none;
}

.view-medium {
	margin-top: 50px;
}

ul {
	padding: 0;
	list-style-position: inside;
}
</style>
<script lang="ts" setup>
import { computed } from "vue";
import { useRoute } from "vue-router"
import { useCategoriesStore, useArticlesStore } from "../../../../store";

const categoriesStore = useCategoriesStore();
const articlesStore = useArticlesStore();

const route = useRoute();

const category = computed(() => categoriesStore.getByPath(route.params.theme as string));
const articles = computed(() => articlesStore.getByCategories(route.params.theme as string, route.params.category as string));
</script>