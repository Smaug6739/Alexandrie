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

    <Error v-else :error="error" />
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

const element = ref<HTMLElement | undefined>();

const article = ref<Node | undefined>(undefined);
const error = ref<string | undefined>(undefined);

watch(
  () => route.params.id,
  async documentId => {
    if (!documentId || typeof documentId !== 'string') return;

    article.value = undefined;
    error.value = undefined;

    const doc = await documentsStore.fetchPublic(documentId);

    if (!doc) {
      error.value = 'Document not found';
      return;
    }

    article.value = doc;

    /**
     * SEO
     */
    const title = doc.name;
    const description = doc.description || 'Public document published on Alexandrie, a modern Markdown-based note-taking platform.';

    const baseUrl = runtimeConfig.public.baseUrl || 'https://alexandrie-hub.fr';

    const canonicalUrl = `${baseUrl}/doc/${documentId}`;

    const ogImage = doc.thumbnail ? `${baseUrl}${doc.thumbnail}` : `${baseUrl}/og/default-article.png`;

    useSeoMeta({
      // Basic
      title,
      description,
      keywords: doc.tags,

      // Open Graph
      ogTitle: title,
      ogDescription: description,
      ogType: 'article',
      ogUrl: canonicalUrl,
      ogImage,

      // Article metadata
      articlePublishedTime: new Date(doc.created_timestamp).toISOString(),
      articleModifiedTime: new Date(doc.updated_timestamp).toISOString(),

      // Twitter
      twitterCard: 'summary_large_image',
      twitterTitle: title,
      twitterDescription: description,
      twitterImage: ogImage,
    });
  },
  { immediate: true },
);
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
