<template>
	<div>
		<Sidebar />
		<main class="view view-medium">
			<div v-if="article.name">
				<div v-html="article.content_html"></div>
				<hr class="sep">
				<p>Dernière mise à jour le {{ formatDate(article.updated_timestamp) }}</p>
			</div>
			<div v-else>
				<Loader msg="Loading" />
			</div>
		</main>
	</div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { Article, useArticlesStore } from "../store";
import Loader from "../components/common/Loader.vue"
import Sidebar from "../components/layout/sidebar/Sidebar.vue";
const articlesStore = useArticlesStore();

export default defineComponent({
	name: "Data",
	components: {
		Sidebar,
		Loader,
	},
	data() {
		return {
			article: {} as Article,
		};
	},
	async mounted() {
		this.article = await this.getArticle();
	},
	methods: {
		async getArticle(): Promise<Article> {
			const art = await articlesStore.getByPaths(this.$route.params.subject as string, this.$route.params.category as string, this.$route.params.doc_name as string)
			if (art) return art

			return this.article
		},
		formatDate(date: string) {
			return new Date(parseInt(date)).toLocaleDateString();
		}
	},
	watch: {
		async $route() {
			this.article = await this.getArticle();
		}
	},
});
</script>
<style lang="scss" scoped>
.sep {
	margin-top: 2rem;
	margin-bottom: 1rem;
}
</style>
