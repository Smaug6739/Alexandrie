<template>
	<div>
		<main class="view view-medium">
			<div v-if="article?.id">
				<article v-html="article.content_html"></article>
				<p class="sep">Dernière mise à jour le {{ timestampToString(article.updated_timestamp) }}</p>
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
import { useRoute } from "vue-router";
import { timestampToString } from "@/helpers/date";
import { useArticlesStore } from '@/store';
import Loader from '@/components/Loader.vue';

const route = useRoute();
const articlesStore = useArticlesStore();


const article = computed(() => articlesStore.getByPaths(route.params.doc_name as string, route.params.category as string, route.params.theme as string));
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
</style>
