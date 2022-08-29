<template>
	<div>
		<span v-if="articles.length">
			<Sidebar :articles="articles" :themes="themes" />
		</span>
		<BackToTop />
		<router-view name="doc" />
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
	async mounted() {
		this.themes = await categoriesStore.getAll();
		this.articles = await articlesStore.getAllByCategory(this.$route.params.subject as string);
	},
	watch: {
		async $route() {
			this.themes = await categoriesStore.getAll();
			this.articles = await articlesStore.getAllByCategory(this.$route.params.subject as string);
		}
	},
});
</script>
