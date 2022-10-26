<template>
	<main>
		<section class="view view-container" v-if="article?.id" style="display:flex;">
			<div style="width:100%;">
				<article ref="element" v-html="article.content_html"></article>
				<hr />
				<ArticleFooter :article="article" :next="next" :previous="previous" />
			</div>
			<TableOfContent :element="element" class="toc" />
		</section>
		<div v-else>
			<Loader msg="Loading..." />
		</div>
	</main>
</template>
<script lang="ts" setup>
import { useRoute } from "vue-router";
import { useArticlesStore } from '@/store';
import Loader from "@/components/Loader.vue";
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
<style lang="scss" scoped>
.view-container {
	display: block;
	max-width: 100%;
	margin: auto 50px auto 250px;
	padding: 5px;

	@media (max-width: 768px) {
		width: 100%;
		margin: auto;
	}
}


.toc {
	margin-top: 40px;
}
</style>
