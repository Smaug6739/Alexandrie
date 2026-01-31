<!-- eslint-disable vue/no-v-html -->
<template>
  <div style="width: 100%; padding: 1rem 0">
    <div
      v-if="!error && article"
      class="reader"
      :style="{
        marginRight: !isTablet && preferencesStore.get('hideTOC').value && isOpened && hasContent ? '200px' : '0px',
        transition: 'margin 0.3s',
      }"
    >
      <div class="doc-container">
        <!-- Header for all node types -->
        <NodeDocumentHeader :doc="article" :public="true" style="margin: 20px 0" />

        <!-- Document content if available -->
        <article
          v-if="hasContent"
          ref="element"
          :class="`${article.theme || preferencesStore.get('theme').value}-theme`"
          style="max-width: 100%"
          v-html="article.content_compiled"
        />

        <!-- Hierarchical children tree -->
        <NodeTree v-if="children.length > 0" :nodes="children" :parent-id="article.id" />
      </div>

      <!-- Table of contents only for documents with content -->
      <div v-if="!isTablet && !preferencesStore.get('hideTOC').value && hasContent" class="toc">
        <NodeTOC :doc="article" :element="element" />
      </div>
    </div>

    <!-- Loading state -->
    <div v-else-if="!error" class="reader">
      <div class="doc-container">
        <NodeDocumentSkeleton />
      </div>
    </div>

    <Error v-else :error="error?.message" />
  </div>
</template>
<script setup lang="ts">
import type { Node } from '~/stores';

const documentsStore = useNodesStore();
const preferencesStore = usePreferences();

const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const { isOpened } = useSidebar();
const { isTablet } = useDevice();

const element = ref<HTMLElement>();
const children = ref<Node[]>([]);

const { data: article, error } = await useAsyncData(`public-doc-${route.params.id}`, async (): Promise<Node | undefined> => {
  const documentId = route.params.id;
  if (!documentId || typeof documentId !== 'string') return undefined;
  const result = await documentsStore.fetchPublic(documentId);
  if (result) {
    children.value = result.children || [];
    return result.node;
  }
  return undefined;
});

/** Check if node has displayable content */
const hasContent = computed(() => article.value?.content_compiled && article.value.content_compiled.trim().length > 0);
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
