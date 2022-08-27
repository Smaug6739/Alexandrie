<template>
	<div>
		<Sidebar />
		<BackToTop />
		<main class="view view-medium">
			<div v-if="article.name">
				<div v-html="article.content_html"></div>
				<p class="sep">Dernière mise à jour le {{ formatDate(article.updated_timestamp) }}</p>
				<hr>
				<div class="sep2">
					<span v-if="next" class="next">
						<router-link :to="`/doc/${next.main_category}/${next.sub_category}/${next.path}`">{{ next.name }}
						</router-link> →
					</span>
					<span v-if="previous" class="previous">
						← <router-link :to="`/doc/${previous.main_category}/${previous.sub_category}/${previous.path}`">
							{{ previous.name }}
						</router-link>
					</span>
				</div>
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
import BackToTop from "../components/common/back-to-top/index"
import Sidebar from "../components/layout/sidebar/Sidebar.vue";
const articlesStore = useArticlesStore();

export default defineComponent({
	name: "Data",
	components: {
		Sidebar,
		Loader,
		BackToTop,
	},
	data() {
		return {
			article: {} as Article,
			next: {} as Article | undefined,
			previous: {} as Article | undefined,
		};
	},
	async mounted() {
		this.article = await this.getArticle();
		this.next = await articlesStore.getNextArticle(this.article)
		this.previous = await articlesStore.getPreviousArticle(this.article)
	},
	methods: {
		async getArticle(): Promise<Article> {
			const art = await articlesStore.getByPaths(this.$route.params.subject as string, this.$route.params.category as string, this.$route.params.doc_name as string)
			if (art) return art
			return this.article
		},
		formatDate(date: string) {
			return new Date(parseInt(date)).toLocaleDateString();
		},
	},
	watch: {
		async $route() {
			this.article = await this.getArticle();
			this.next = await articlesStore.getNextArticle(this.article)
			this.previous = await articlesStore.getPreviousArticle(this.article)
		}
	},
});
</script>
<style lang="scss" scoped>
.sep {
	margin-top: 2rem;
	margin-bottom: 1rem;
}

.sep2 {
	margin-top: 1rem;
	margin-bottom: 1rem;
}

.next {
	float: right;
}

.previous {
	float: left;
}
</style>
