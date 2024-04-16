<template>
	<div v-if="article?.id" style="width:100%;">
		<div style="display:flex; justify-content: space-between;">
			<div style="width:100%;max-width: 900px;margin: auto;">
				<DocumentCardHeader :doc="article" style="margin-bottom: 20px;" />
				<article class="document-theme" style="max-width: 100%;" ref="element" v-html="article.content_html">
				</article>
				<DocumentCardFooter :document="article" :next="next" :previous="previous" />
			</div>
			<TableOfContent :element="element" :doc_id="document_id" class="toc" style="width: 20%;" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { useDocumentsStore, type Document } from '@/store';
import TableOfContent from "@/components/table-of-content/TableOfContents.vue";

const route = useRoute();
const documentsStore = useDocumentsStore();
const element = ref<HTMLElement>();
const document_id = route.params.id as string;

const article = ref<Document>();

watchEffect(async () => {
	const docFromStore = documentsStore.getById(document_id);
	if (docFromStore?.partial) {
		try {
			article.value = await documentsStore.fetch({ id: document_id });
		} catch (error) {
			console.error("Error fetching document:", error);
		}
	} else article.value = docFromStore;
});
const next = computed(() => documentsStore.getNext(article.value));
const previous = computed(() => documentsStore.getPrevious(article.value));
</script>

<style scoped>
.toc {
	display: none;
}

@media (min-width: 1280px) {
	.toc {
		display: block;
	}
}
</style>