<!-- eslint-disable vue/no-v-html -->
<template>
  <div style="width: 100%; padding: 1rem 0">
    <div
      v-if="!error"
      class="reader"
      :style="{
        marginRight: !isTablet && preferencesStore.get('hideTOC').value && isOpened ? '200px' : '0px',
        transition: 'margin 0.3s',
      }"
    >
      <div class="doc-container">
        <DocumentCardHeader :doc="article" :public="true" style="margin: 20px 0" />
        <!-- eslint-disable-next-line vue/no-v-html -->
        <article
          v-if="article"
          ref="element"
          :class="`${article.theme || preferencesStore.get('theme').value}-theme`"
          style="max-width: 100%"
          v-html="article.content_compiled"
        />
        <DocumentSkeleton v-else />
      </div>

      <div v-if="!isTablet && !preferencesStore.get('hideTOC').value" class="toc">
        <TableOfContent :doc="article" :element="element" />
      </div>
    </div>

    <Error v-else :error="error?.message" />
  </div>
</template>
<script setup lang="ts">
import TableOfContent from '~/pages/dashboard/docs/_components/table-of-content/TableOfContents.vue';
import DocumentSkeleton from '~/pages/dashboard/docs/_components/DocumentSkeleton.vue';
import DocumentCardHeader from '~/pages/dashboard/docs/_components/DocumentCardHeader.vue';
import type { Node } from '~/stores';

definePageMeta({
  ssr: true,
});

const documentsStore = useNodesStore();
const preferencesStore = usePreferences();

const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const { isOpened } = useSidebar();
const { isTablet } = useDevice();

const element = ref<HTMLElement>();

/**
 * SSR-aware fetch
 */
const { data: article, error } = await useAsyncData(`public-doc-${route.params.id}`, async (): Promise<Node | undefined> => {
  const documentId = route.params.id;
  if (!documentId || typeof documentId !== 'string') return undefined;
  return (await documentsStore.fetchPublic(documentId)) ?? undefined;
});

/**
 * SEO (SSR-safe)
 */
const title = computed(() => article.value?.name || 'Unknown document');

const description = computed(() => article.value?.description || 'Public document published on Alexandrie, a modern Markdown-based note-taking platform.');

const baseUrl = runtimeConfig.public.baseUrl || 'https://alexandrie-hub.fr';

const canonicalUrl = computed(() => `${baseUrl}/doc/${route.params.id}`);

const ogImage = computed(() => (article.value?.thumbnail ? `${baseUrl}${article.value.thumbnail}` : `${baseUrl}/og/default-article.png`));

useSeoMeta({
  title,
  description,
  keywords: () => article.value?.tags,

  ogTitle: title,
  ogDescription: description,
  ogType: 'article',
  ogUrl: canonicalUrl,
  ogImage,

  articlePublishedTime: () => (article.value ? new Date(article.value.created_timestamp).toISOString() : undefined),

  articleModifiedTime: () => (article.value ? new Date(article.value.updated_timestamp).toISOString() : undefined),

  twitterCard: 'summary_large_image',
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: ogImage,
});
</script>

<style scoped lang="scss">
.reader {
  display: grid;
  align-items: start;
  column-gap: 20px;
  grid-template-columns: 1fr minmax(0, 800px) 1fr;
}

.doc-container {
  margin: 0;
  grid-column: 2;
}

@media screen and (width >= 810px) {
  .doc-container {
    max-width: 800px;
    padding: 0 2rem;
  }
}

.toc {
  position: sticky;
  top: 1rem;
  width: 100%;
  max-width: 320px;
  grid-column: 3;
  justify-self: start;
}

@media screen and (width <= 1280px) {
  .toc {
    display: none;
  }
}
</style>
