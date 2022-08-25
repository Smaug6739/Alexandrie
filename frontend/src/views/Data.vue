<template>
	<div>
		<Sidebar />
		<main class="view view-source">
			<CustomComponent :src="article.content_html" />
		</main>

	</div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { Article, useArticlesStore } from "../store";

import Sidebar from "../components/layout/sidebar/Sidebar.vue";
import CustomComponent from "../components/CustomComponent.vue";
const articlesStore = useArticlesStore();

export default defineComponent({
	name: "Data",
	components: {
		Sidebar,
		CustomComponent
	},
	data() {
		return {
			article: {} as Article,
		};
	},
	async beforeMount() {
		this.article = await this.getArticle();
	},
	methods: {
		async getArticle(): Promise<Article> {
			const art = await articlesStore.get(this.$route.params.subject as string, this.$route.params.category as string, this.$route.params.doc_name as string)
			if (art) return art
			return this.article
		},
	},
	watch: {
		async $route(to, from) {
			this.article = await this.getArticle();
		}
	},
});
</script>
