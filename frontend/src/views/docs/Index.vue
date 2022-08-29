<template>
	<div>
		<span v-if="articles.length">
			<Sidebar :articles="articles" :themes="themes" />
		</span>
		<BackToTop />
		<router-view name="doc" :articles="articles" />
	</div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { Article, Theme, useArticlesStore, useCategoriesStore } from "../../store";
import Loader from "../../components/common/Loader.vue"
import BackToTop from "../../components/common/back-to-top/index"
import Sidebar from "../../components/layout/sidebar/Sidebar.vue";
const articlesStore = useArticlesStore();
const categoriesStore = useCategoriesStore();

export default defineComponent({
	name: "Data",
	components: {
		Sidebar,
		Loader,
		BackToTop,
	},
	data() {
		return {
			themes: [] as Theme[],
			articles: [] as Article[],
		};
	},
	async beforeMount() {
		const p1 = categoriesStore.getAll();
		const p2 = articlesStore.getAllByCategory(this.$route.params.subject as string);
		const [categories, articles] = await Promise.all([p1, p2]);
		this.themes = categories;
		this.articles = articles;
	},
	watch: {
		async $route() {
			const p1 = categoriesStore.getAll();
			const p2 = articlesStore.getAllByCategory(this.$route.params.subject as string);
			const [categories, articles] = await Promise.all([p1, p2]);
			this.themes = categories;
			this.articles = articles;
		}
	},
});
</script>
