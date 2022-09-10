<template>
	<div>
		<main class="view view-medium">
			<div v-if="article?.id">
				<div v-html="article.content_html"></div>
				<p class="sep">Dernière mise à jour le {{ formatDate(article.updated_timestamp) }}</p>
				<hr>
				<div class="sep2">
					<span v-if="next" class="next">
						<NuxtLink :to="`/doc/${next.main_category}/${next.sub_category}/${next.path}`">{{ next.name }}
						</NuxtLink> →
					</span>
					<span v-if="previous" class="previous">
						← <NuxtLink :to="`/doc/${previous.main_category}/${previous.sub_category}/${previous.path}`">
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
import type { Article } from "../../store";
import { useArticlesStore } from '../../store';
const articlesStore = useArticlesStore();
import Loader from "../../components/common/Loader.vue"

export default defineComponent({
	name: "Data",
	components: {
		Loader,
	},

	data() {
		return {
			next: {} as Article | undefined,
			previous: {} as Article | undefined,
		};
	},

	async beforeMount() {
		this.next = this.getNext()
		this.previous = this.getPrevious()
	},
	computed: {
		article(): Article | undefined {
			const art = articlesStore.articles.find((article: Article) => this.$route.params.doc_name as string == article.path && article.sub_category == this.$route.params.category as string && article.main_category == this.$route.params.subject as string);
			return art || undefined;
		},
	},
	methods: {
		getNext() {
			const articles_of_category = articlesStore.articles.filter(
				(a: Article) => a.main_category == this.article?.main_category && a.sub_category == this.article?.sub_category,
			);
			const index = articles_of_category.findIndex((a: Article) => a.id == this.article?.id);
			if (index == -1) return undefined;
			return articles_of_category[index + 1];
		},
		getPrevious() {
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
			this.next = this.getNext()
			this.previous = this.getPrevious()
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
