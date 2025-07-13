<template>
  <div v-if="article?.id" style="width: 100%; padding: 0 0.5rem">
    <div style="display: flex; justify-content: space-between">
      <div style="width: 100%; max-width: 980px; margin: auto">
        <DocumentCardHeader :doc="article" style="margin-bottom: 20px" />
        <article class="document-theme" style="max-width: 100%" ref="element" v-html="article.content_html"></article>
        <DocumentCardFooter :document="article" :next="next" :previous="previous" />
      </div>
      <div v-if="!isTablet() && !preferencesStore.get('hideTOC')"><TableOfContent :tags="article.tags" :element="element" :doc_id="article.id" class="toc" style="width: 400px" /></div>
      <div v-else-if="!isTablet() && preferencesStore.get('hideTOC')" style="margin-right: 200px"></div>
    </div>
  </div>
  <Error v-else-if="error" :error="error" />
</template>

<script setup lang="ts">
import type { Document } from '~/stores';
import TableOfContent from './_components/table-of-content/TableOfContents.vue';
import DocumentCardHeader from './_components/DocumentCardHeader.vue';
import DocumentCardFooter from './_components/DocumentCardFooter.vue';
const route = useRoute();
const documentsStore = useDocumentsStore();
const preferencesStore = usePreferencesStore();
const element = ref<HTMLElement>();

const article = ref<Document | undefined>();
const error: Ref<false | string> = ref(false);

watchEffect(async () => {
  const document_id = route.params.id as string;
  const docFromStore = documentsStore.getById(document_id);
  if (!docFromStore) {
    return (error.value = 'Document not found');
  }
  article.value = undefined;
  if (docFromStore.partial) {
    try {
      error.value = false;
      article.value = await documentsStore.fetch({ id: document_id });
    } catch (err) {
      error.value = err instanceof Error ? err.message : (err as string);
    }
  } else article.value = docFromStore;
  useHead({ title: `Alexandrie ${article.value?.name || ''}` });
});

definePageMeta({
  breadcrumb: () => {
    const doc = useDocumentsStore().getById(useRoute().params.id as string);
    return doc?.name || '';
  },
});

const next = computed(() => documentsStore.getNext(article.value));
const previous = computed(() => documentsStore.getPrevious(article.value));
</script>
