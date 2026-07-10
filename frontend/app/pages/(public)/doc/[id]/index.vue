<template>
  <div style="width: 100%; padding: 1rem 0">
    <div
      v-if="!error && data?.node"
      class="reader"
      :style="{
        marginRight: isOpened && hasContent ? '200px' : '0px',
        transition: 'margin $transition-medium',
      }"
    >
      <div class="doc-container">
        <NodeDocumentHeader :doc="data.node" public style="margin: 20px 0" />

        <NodeDocumentContentCompiled v-if="hasContent" ref="elementComponent" :node="data.node" />
        <NodeTree v-if="data.children.length > 0" :nodes="data.children" :parent-id="data.node.id" />
      </div>

      <div v-if="hasContent" class="toc">
        <NodeTOC :doc="data.node" :element="element" />
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

const elementComponent = ref<InstanceType<typeof NodeDocumentContentCompiled>>();
const element = computed(() => elementComponent.value?.rootElement as HTMLElement | undefined);

const { data, error } = await useAsyncData(`public-doc-${route.params.id}`, async (): Promise<{ node: Node | undefined; children: Node[] }> => {
  const documentId = route.params.id;
  if (!documentId || typeof documentId !== 'string') return { node: undefined, children: [] };

  const request = await makeRequest(`nodes/public/${documentId}`, 'GET', {});
  if (request.status === 'success') {
    const response = request.result as PublicNodeResponse;
    return {
      node: { ...response.node, shared: false, public: true, permissions: [] } as Node,
      children: response.children?.map(child => ({ ...child, shared: false, public: true }) as Node) || [],
    };
  }
  return { node: undefined, children: [] };
});

/** Check if node has displayable content */
const hasContent = computed(() => !!data.value?.node?.content_compiled?.trim());

const baseUrl = requestUrl.origin || __BASE_URL__;

useSeoMeta({
  title: () => data.value?.node?.name || 'Unknown document',
  description: () => data.value?.node?.description || 'Public document published on Alexandrie, a modern Markdown-based note-taking platform.',
  keywords: () => data.value?.node?.tags,

  ogTitle: () => data.value?.node?.name || 'Unknown document',
  ogDescription: () => data.value?.node?.description || 'Public document published on Alexandrie, a modern Markdown-based note-taking platform.',
  ogType: 'article',
  ogUrl: () => `${baseUrl}/doc/${route.params.id}`,
  ogImage: () => (data.value?.node?.thumbnail ? `${baseUrl}${data.value?.node.thumbnail}` : `${baseUrl}/og/default-data.png`),

  articlePublishedTime: () => (data.value?.node?.created_timestamp ? new Date(data.value?.node.created_timestamp).toISOString() : undefined),
  articleModifiedTime: () => (data.value?.node?.updated_timestamp ? new Date(data.value?.node.updated_timestamp).toISOString() : undefined),

  twitterCard: 'summary_large_image',
  twitterTitle: () => data.value?.node?.name || 'Unknown document',
  twitterDescription: () => data.value?.node?.description || 'Public document published on Alexandrie, a modern Markdown-based note-taking platform.',
  twitterImage: () => (data.value?.node?.thumbnail ? `${baseUrl}${data.value?.node.thumbnail}` : `${baseUrl}/og/default-data.png`),
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
