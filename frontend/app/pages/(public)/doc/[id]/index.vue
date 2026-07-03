<template>
  <div style="width: 100%; padding: 1rem 0">
    <div
      v-if="!error && article"
      class="reader"
      :style="{
        marginRight: !isTablet && isOpened && hasContent ? '200px' : '0px',
        transition: 'margin $transition-medium',
      }"
    >
      <div class="doc-container">
        <NodeDocumentHeader :doc="article" public style="margin: 20px 0" />

        <NodeDocumentContentCompiled v-if="hasContent" ref="elementComponent" :node="article" />

        <NodeTree v-if="children.length > 0" :nodes="children" :parent-id="article.id" />
      </div>

      <div v-if="!isTablet && hasContent" class="toc">
        <NodeTOC :doc="article" :element="element" />
      </div>
    </div>

    <div v-else-if="!error" class="reader">
      <div class="doc-container">
        <NodeDocumentSkeleton />
      </div>
    </div>

    <Error v-else :error="error?.message" />
  </div>
</template>

<script setup lang="ts">
import NodeDocumentContentCompiled from '~/components/Node/Document/ContentCompiled.vue';
import type { Node, PublicNodeResponse } from '~/stores';

const route = useRoute();
const requestUrl = useRequestURL();
const { isOpened } = useSidebar();
const { isTablet } = useDevice();

const children = ref<Node[]>([]);
const elementComponent = ref<InstanceType<typeof NodeDocumentContentCompiled>>();
const element = computed(() => elementComponent.value?.rootElement as HTMLElement | undefined);

const { data: article, error } = await useAsyncData(`public-doc-${route.params.id}`, async (): Promise<Node | undefined> => {
  const documentId = route.params.id;
  if (!documentId || typeof documentId !== 'string') return undefined;

  const request = await makeRequest(`nodes/public/${documentId}`, 'GET', {});
  if (request.status === 'success') {
    const response = request.result as PublicNodeResponse;

    children.value = (response.children || []).map(c => ({ ...c, partial: true, shared: false, permissions: [] }));

    return {
      ...response.node,
      partial: false,
      shared: false,
      permissions: [],
    };
  }
  return undefined;
});

/** Check if node has displayable content */
const hasContent = computed(() => !!article.value?.content_compiled?.trim());

const baseUrl = requestUrl.origin || 'https://alexandrie-hub.fr';

// Configuration SEO robuste pour le SSR
useSeoMeta({
  title: () => article.value?.name || 'Unknown document',
  description: () => article.value?.description || 'Public document published on Alexandrie, a modern Markdown-based note-taking platform.',
  keywords: () => article.value?.tags,

  ogTitle: () => article.value?.name || 'Unknown document',
  ogDescription: () => article.value?.description || 'Public document published on Alexandrie, a modern Markdown-based note-taking platform.',
  ogType: 'article',
  ogUrl: () => `${baseUrl}/doc/${route.params.id}`,
  ogImage: () => (article.value?.thumbnail ? `${baseUrl}${article.value.thumbnail}` : `${baseUrl}/og/default-article.png`),

  articlePublishedTime: () => (article.value?.created_timestamp ? new Date(article.value.created_timestamp).toISOString() : undefined),
  articleModifiedTime: () => (article.value?.updated_timestamp ? new Date(article.value.updated_timestamp).toISOString() : undefined),

  twitterCard: 'summary_large_image',
  twitterTitle: () => article.value?.name || 'Unknown document',
  twitterDescription: () => article.value?.description || 'Public document published on Alexandrie, a modern Markdown-based note-taking platform.',
  twitterImage: () => (article.value?.thumbnail ? `${baseUrl}${article.value.thumbnail}` : `${baseUrl}/og/default-article.png`),
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
