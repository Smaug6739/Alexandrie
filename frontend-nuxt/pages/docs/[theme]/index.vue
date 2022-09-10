<!--404 error page (not found )-->
<template>
	<div>
		<div class="view-medium">
			<div>
				<h1>
					Scientia</h1>
				<h2>{{ category?.name }}</h2>
				<div>
					Index de la catégorie {{ category?.name }} vous retrouvtrez ici plusieurs documents classéss dans les
					catégories suivantes :
					<ul>
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
<script lang="ts">
import { defineComponent } from "vue";
import { type Theme, useCategoriesStore } from "../../../store";

export default defineComponent({
	name: "theme",
	data() {
		return {
			category: {} as Theme | undefined,
		};
	},
	async mounted() {
		this.category = await this.getCategory();
	},
	methods: {
		async getCategory() {
			const categoriesStore = useCategoriesStore();
			return await categoriesStore.getByPath(this.$route.params.theme as string);
		}
	},
	watch: {
		async $route() {
			this.category = await this.getCategory();
		}
	},
});
</script>