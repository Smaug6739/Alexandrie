<!--404 error page (not found )-->
<template>
	<div>
		<div class="view-medium">
			<div>
				<h1>
					Scientia</h1>
				<h2>{{ category?.name }}</h2>
				<div>
					Index de la catégorie {{ category?.name }} vous retrouverez ici plusieurs documents classés dans les
					catégories suivantes :
					<ul v-if="category?.id">
						<li v-for="(item, index) in category.categories" :key="index">
							<NuxtLink :to="`/docs/${category.path}/${item.path}`">{{item.name}}</NuxtLink>
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
import { useRoute } from "vue-router";
import { useCategoriesStore } from "../../../store";

const route = useRoute();
const categoryStore = useCategoriesStore();

const category = computed(() => categoryStore.getByPath(route.params.theme as string));
</script>