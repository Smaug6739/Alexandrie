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
<script lang="ts" setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from 'pinia'
import { useArticlesStore, type Article } from '../../../../store';
import Loader from "../../../../components/common/Loader.vue"

const route = useRoute();
const articlesStore = useArticlesStore();

const { getByPaths } = storeToRefs(articlesStore);

const article = ref<Article | undefined | null>(null);
const previous = ref<Article | null>(null);
const next = ref<Article | null>(null);


article.value = getArticle();
next.value = getNext()
previous.value = getPrevious()



function getArticle() {
	return getByPaths.value(route.params.theme as string, route.params.category as string, route.params.doc_name as string);
}
function getNext() {
	const articles_of_category = articlesStore.articles.filter(
		(a: Article) => a.main_category == article.value?.main_category && a.sub_category == article.value?.sub_category,
	);
	const index = articles_of_category.findIndex((a: Article) => a.id == article.value?.id);
	if (index == -1) return null;
	return articles_of_category[index + 1] || null;
}
function getPrevious() {
	const articles_of_category = articlesStore.articles.filter(
		(a: Article) => a.main_category == article.value?.main_category && a.sub_category == article.value.sub_category,
	);
	const index = articles_of_category.findIndex((a: Article) => a.id == article.value?.id);
	if (index == -1) return null;
	return articles_of_category[index - 1] || null;
}
function formatDate(date: string) {
	return new Date(parseInt(date)).toLocaleDateString();
}

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
