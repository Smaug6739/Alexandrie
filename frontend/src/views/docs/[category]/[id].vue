<template>
	<div class="view-medium" v-if="article?.id" style="display:flex;">
		<div style="width:100%;">
			<article class="document-theme" style="max-width: 100%;overflow: auto;" ref="element"
				v-html="article.content_html"></article>
			<DocumentFooter :document="article" :next="next" :previous="previous" class="footer" />
		</div>
		<TableOfContent :element="element" class="toc" />
	</div>
</template>
<script lang="ts" setup>
import { useRoute } from "vue-router";
import { ref, watchEffect, computed } from "vue";
import { useDocumentsStore, type Document } from '@/stores';
import TableOfContent from "@/components/table-of-content/TableOfContents.vue";
import DocumentFooter from "@/components/DocumentFooter.vue";

const route = useRoute();
const doc_store = useDocumentsStore();
const element = ref<HTMLElement>() as any;
const document_id = computed(() => route.params.doc_id as string);
const article = ref<Document>();

watchEffect(async () => {
	const docFromStore = doc_store.getById(document_id.value);
	if (docFromStore?.partial) {
		try {
			article.value = await doc_store.fetch({ id: document_id.value });
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

@media print {
	.toc {
		display: none;
	}

	.footer {
		display: none;
	}


}
</style>