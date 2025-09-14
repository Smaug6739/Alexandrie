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
import TableOfContent from '../../dashboard/docs/_components/table-of-content/TableOfContents.vue';
import DocumentSkeleton from '../../dashboard/docs/_components/DocumentSkeleton.vue';
import DocumentCardHeader from '../../dashboard/docs/_components/DocumentCardHeader.vue';
import type { Node } from '@/stores';

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
  useHead({ title: article.value?.name || '' });
});
</script>

<style scoped lang="scss">
/* Grille : [1fr] [contenu 800px centré] [1fr pour loger la TOC] */
.reader {
  display: grid;
  align-items: start;
  column-gap: 20px;
  grid-template-columns: 1fr minmax(0, 800px) 1fr;
}

.doc-container {
  margin: 0; /* plus besoin d'auto */
  grid-column: 2; /* colonne centrale */
}

@media screen and (width >= 810px) {
  .doc-container {
    max-width: 800px; /* cohérent avec la colonne centrale */
    padding: 0 2rem;
  }
}

/* La TOC vit dans la colonne de droite, sans décaler le centre */
.toc {
  position: sticky; /* optionnel : TOC sticky */
  top: 1rem;
  width: 100%;
  max-width: 320px;
  grid-column: 3; /* colonne droite */
  justify-self: start; /* colle à gauche de la colonne */
}

/* Cache la TOC quand la colonne droite devient trop étroite */
@media screen and (width <= 1280px) {
  .toc {
    display: none;
  }
}
</style>
