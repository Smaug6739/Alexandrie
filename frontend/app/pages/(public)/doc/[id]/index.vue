<!-- eslint-disable vue/no-v-html -->
<template>
  <div style="width: 100%; padding: 1rem 0">
    <!-- ⬇️ Remplace le wrapper inline flex par une classe .reader + style dynamique -->
    <div
      v-if="!error"
      class="reader"
      :style="{
        marginRight: !isTablet() && preferencesStore.get('hideTOC').value && useSidebar().isOpened.value ? '200px' : '0px',
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

      <!-- ⬇️ retire le style inline (width/margin-left), on gère en CSS -->
      <div v-if="!isTablet() && !preferencesStore.get('hideTOC').value" class="toc">
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

const route = useRoute();
const documentsStore = useNodesStore();
const preferencesStore = usePreferences();
const element = ref<HTMLElement>();

const article = ref<Node | undefined>();
const error: Ref<false | string> = ref(false);

watchEffect(async () => {
  article.value = undefined;
  const document_id = route.params.id as string;
  const doc = await documentsStore.fetchPublic(document_id);
  if (doc) article.value = doc;
  else error.value = 'Document not found';
  const title = article.value?.name || 'Unknown Document';
  const description = article.value?.description;
  useHead({
    title: title,
    meta: [
      // Basic
      { name: 'description', content: description },

      // OpenGraph
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'article' },
      { property: 'og:url', content: `${window.location.origin}/doc/${document_id}` },

      // Twitter card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
    ],
  });
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
