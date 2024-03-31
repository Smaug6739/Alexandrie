<template>
	<Transition name="fade" mode="out-in">
		<div class="view-medium" v-if="article?.id" style="display:flex;">
			<div style="width:100%;">
				<article class="document-theme" style="max-width: 100%;overflow: auto;" ref="element"
					v-html="article.content_html"></article>
				<DocumentFooter :document="article" :next="next" :previous="previous" />
			</div>
			<TableOfContent :element="element" class="toc" />
		</div>
	</Transition>
</template>
<script lang="ts" setup>
import { useRoute } from "vue-router";
import { useDocumentsStore, type Document } from '@/store';
import TableOfContent from "@/components/table-of-content/TableOfContents.vue";

const route = useRoute();
const doc_store = useDocumentsStore();
const element = ref<HTMLElement>() as any;
const document_id = route.params.id as string;
const article = ref<Document>();

watchEffect(async () => {
	const docFromStore = doc_store.getById(document_id);
	if (docFromStore?.partial) {
		try {
			article.value = await doc_store.fetch({ id: document_id });
		} catch (error) {
			console.error("Error fetching document:", error);
		}
	} else article.value = docFromStore;
});

const next = computed(() => doc_store.getNext(article.value));
const previous = computed(() => doc_store.getPrevious(article.value));

</script>


<style scoped>
.toc {
	display: none;
}

@media (min-width: 1280px) {
	.toc {
		display: block;
		margin-top: 40px;
		width: 400px;
	}
}
</style>