<template>
  <div style="width: 100%; padding: 1rem 0">
    <div v-if="!error" style="display: flex; justify-content: space-between">
      <div :style="{ maxWidth: usePreferences().get('docSize') == 0 ? '980px' : '810px' }" class="doc-container">
        <DocumentCardHeader :doc="article" style="margin-bottom: 20px" />

        <!-- eslint-disable-next-line vue/no-v-html -->
        <article v-if="article" ref="element" :class="`${usePreferences().get('theme')}-theme`" style="max-width: 100%" v-html="article.content_html" />
        <DocumentSkeleton v-else />
        <DocumentCardFooter :document="article" :next="next" :previous="previous" />
      </div>

      <div v-if="!isTablet() && !preferencesStore.get('hideTOC')" class="toc">
        <TableOfContent :doc="article" :element="element" style="width: 350px" />
      </div>

      <div
        :style="{ marginRight: !isTablet() && preferencesStore.get('hideTOC') && useSidebar().isOpened.value ? '200px' : '0px', transition: 'margin 0.3s' }"
      />
    </div>
    <Error v-else :error="error" />
  </div>
</template>
<script setup lang="ts">
import TableOfContent from './_components/table-of-content/TableOfContents.vue';
import DocumentCardHeader from './_components/DocumentCardHeader.vue';
import DocumentCardFooter from './_components/DocumentCardFooter.vue';
import DocumentSkeleton from './_components/DocumentSkeleton.vue';

import type { Document } from '@/stores';

const route = useRoute();
const documentsStore = useDocumentsStore();
const preferencesStore = usePreferences();
const element = ref<HTMLElement>();

const article = ref<Document | undefined>();
const error: Ref<false | string> = ref(false);

watchEffect(async () => {
  const document_id = route.params.id as string;
  const docFromStore = documentsStore.getById(document_id);
  if (!docFromStore) {
    if (documentsStore.isFetching) return;
    return (error.value = 'Document not found');
  }
  article.value = undefined;
  if (docFromStore.partial) {
    try {
      error.value = false;
      article.value = await documentsStore.fetch({ id: document_id });
    } catch (err: unknown) {
      error.value = (err as Error).message || 'Failed to fetch document';
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

<style scoped lang="scss">
.doc-container {
  width: 100%;
  margin: 0 auto;
}

@media screen and (width >= 810px) {
  .doc-container {
    padding: 0 2rem;
  }
}

.toc {
  position: relative;
}

@media screen and (width <= 1280px) {
  .toc {
    display: none;
  }
}
</style>
