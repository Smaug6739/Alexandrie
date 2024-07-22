<template>
  <transition name="slide-fade" mode="out-in">
    <div v-if="article?.id" style="width: 100%">
      <div style="display: flex; justify-content: space-between">
        <div style="width: 100%; max-width: 900px; margin: auto">
          <DocumentCardHeader :doc="article" style="margin-bottom: 20px" />
          <article class="document-theme" style="max-width: 100%" ref="element" v-html="article.content_html"></article>
          <DocumentCardFooter :document="article" :next="next" :previous="previous" />
        </div>
        <TableOfContent :element="element" :doc_id="article.id" class="toc" style="width: 400px" v-if="!isTablet()" />
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { useDocumentsStore, type Document } from '@/stores';
import TableOfContent from '@/components/table-of-content/TableOfContents.vue';

const route = useRoute();
const documentsStore = useDocumentsStore();
const element = ref<HTMLElement>();

const article = ref<Document | undefined>();

watchEffect(async () => {
  const document_id = route.params.id as string;
  const docFromStore = documentsStore.getById(document_id);
  article.value = undefined;
  if (docFromStore?.partial) {
    try {
      article.value = await documentsStore.fetch({ id: document_id });
    } catch (error) {}
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

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
