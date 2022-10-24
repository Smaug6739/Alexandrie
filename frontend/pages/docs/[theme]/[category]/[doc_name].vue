<template>
	<main>
		<div class="view view-container">
			<section v-if="article?.id">
				<div style="display:flex;">
					<article id="art-main" ref="element" v-html="article.content_html"></article>
					<div style="position:relative;">
						<TableOfContent :element="element" class="table-content" />
					</div>
				</div>
				<footer>
					<hr class="sep">
					<p>Dernière mise à jour le {{ timestampToString(article.updated_timestamp) }}</p>
					<NuxtLink v-if="next" class="next" :to="`/docs/${next.main_category}/${next.sub_category}/${next.path}`">{{
							next.name
					}}→</NuxtLink>
					<NuxtLink v-if="previous" class="previous"
						:to="`/docs/${previous.main_category}/${previous.sub_category}/${previous.path}`">←{{
		previous.name
						}}</NuxtLink>
				</footer>
			</section>
			<div v-else>
				<Loader msg="Loading..." />
			</div>
		</div>
	</main>
</template>
<script lang="ts" setup>
import { useRoute } from "vue-router";
import { timestampToString } from "@/helpers/date";
import { useArticlesStore } from '@/store';
import Loader from "@/components/Loader.vue";
import TableOfContent from "@/components/table-of-content/index.vue";
const route = useRoute();
const articlesStore = useArticlesStore();

const element = ref<HTMLElement>() as any;

const article = computed(() => {
	return articlesStore.getByPaths(route.params.doc_name as string, route.params.category as string, route.params.theme as string)
});
const next = computed(() => articlesStore.getNext(article.value));
const previous = computed(() => articlesStore.getPrevious(article.value));

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

.view-container {
	width: 80%;
	max-width: 100%;
	margin: auto;
	padding: 5px;

	@media (max-width: 768px) {
		width: 100%;
		padding: 0;
		padding-right: 5px;
	}
}

#art-main {
	width: 90%;
}

.table-content {
	position: sticky;
	margin-top: 35px;
	top: 15px;
}
</style>
