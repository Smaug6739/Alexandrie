<template>
	<main>
		<section class="view-medium" v-if="article?.id" style="display:flex;">
			<div style="width:100%;">
				<article ref="element" v-html="article.content_html"></article>
				<ArticleFooter :article="article" :next="next" :previous="previous" />
			</div>
			<span class="spacer">
				<TableOfContent :element="element" class="toc" />
			</span>
		</section>
	</main>
</template>
<script lang="ts" setup>
import { useRoute } from "vue-router";
import { useArticlesStore } from '@/store';
import TableOfContent from "@/components/table-of-content/TableOfContents.vue";
import ArticleFooter from "@/components/ArticleFooter.vue";
const route = useRoute();
const articlesStore = useArticlesStore();

const element = ref<HTMLElement>() as any;

const meta = computed(() => articlesStore.getByPaths(
	route.params.doc_name as string,
	route.params.category as string,
	route.params.theme as string));


const article = await articlesStore.fetchArticle(meta.value?.id!);

useHead({
	title: article?.name || 'Documentation',
	meta: [
		{
			name: 'description',
			content: article?.description || 'Documentation'
		},
		{
			property: 'og:title',
			content: article?.name || 'Documentation'
		},
		{
			property: 'og:description',
			content: article?.description || 'Documentation'
		},
		{
			property: 'og:image',
			content: 'https://alexandrie-hub.fr/icon-72x72.png'
		},
		{
			name: 'twitter:title',
			content: article?.name || 'Documentation'
		},
		{
			name: 'twitter:description',
			content: article?.description || 'Documentation'
		},
		{
			name: 'twitter:image',
			content: 'https://alexandrie-hub.fr/icon-72x72.png'
		},
	]
});

// Footer
const next = computed(() => articlesStore.getNext(article));
const previous = computed(() => articlesStore.getPrevious(article));

</script>
<style scoped>
.toc {
	margin-top: 40px;
}

.spacer {
	display: none;
}

@media (min-width: 1280px) {
	.spacer {
		display: block;
		width: 350px;
	}
}
</style>
