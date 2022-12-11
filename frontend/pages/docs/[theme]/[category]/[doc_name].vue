<template>
	<main>
		<section class="view-medium" v-if="article?.id" style="display:flex;">
			<div style="width:100%;">
				<article ref="element" v-html="article.content_html"></article>
				<hr />
				<ArticleFooter :article="article" :next="next" :previous="previous" />
			</div>
			<TableOfContent :element="element" class="toc" />
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

const article = computed(() => {
	return articlesStore.getByPaths(route.params.doc_name as string, route.params.category as string, route.params.theme as string)
});

// Footer
const next = computed(() => articlesStore.getNext(article.value));
const previous = computed(() => articlesStore.getPrevious(article.value));

</script>
<style scoped>
.toc {
	margin-top: 40px;
}
</style>
