<template>
	<div>
		<main class="view view-medium">
			<div v-if="article?.id">
				<div v-html="article.content_html"></div>
				<p class="sep">Dernière mise à jour le {{ formatDate(article.updated_timestamp) }}</p>
				<hr>
				<div class="sep">
					<span v-if="next" class="next">
						<NuxtLink :to="`/docs/${next.main_category}/${next.sub_category}/${next.path}`">{{ next.name }}
						</NuxtLink> →
					</span>
					<span v-if="previous" class="previous">
						← <NuxtLink :to="`/docs/${previous.main_category}/${previous.sub_category}/${previous.path}`">
							{{ previous.name }}
						</NuxtLink>
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
import { useArticlesStore, type Article } from '../../../../store';
import Loader from "../../../../components/common/Loader.vue"

export default defineComponent({
	name: "doc-name",
	components: {
		Loader,
	},

	data() {
		return {
			article: {} as Article | undefined,
			next: {} as Article | undefined,
			previous: {} as Article | undefined,
		};
	},

	async beforeMount() {
		this.article = await this.getArticle();
		this.next = this.getNext()
		this.previous = this.getPrevious()
	},

	methods: {
		async getArticle() {
			const articlesStore = useArticlesStore();
			return await articlesStore.getByPaths(this.$route.params.theme as string, this.$route.params.category as string, this.$route.params.doc_name as string);
		},
		getNext() {
			const articlesStore = useArticlesStore();

			const articles_of_category = articlesStore.articles.filter(
				(a: Article) => a.main_category == this.article?.main_category && a.sub_category == this.article?.sub_category,
			);
			const index = articles_of_category.findIndex((a: Article) => a.id == this.article?.id);
			if (index == -1) return undefined;
			return articles_of_category[index + 1];
		},
		getPrevious() {
			const articlesStore = useArticlesStore();

			const articles_of_category = articlesStore.articles.filter(
				(a: Article) => a.main_category == this.article?.main_category && a.sub_category == this.article.sub_category,
			);
			const index = articles_of_category.findIndex((a: Article) => a.id == this.article?.id);
			if (index == -1) return undefined;
			return articles_of_category[index - 1];
		},
		formatDate(date: string) {
			return new Date(parseInt(date)).toLocaleDateString();
		},
	},
	watch: {
		async $route() {
			this.article = await this.getArticle();
			this.next = this.getNext()
			this.previous = this.getPrevious()
		}
	},
});
</script>
<style lang="scss" scoped>
.sep {
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
