<!-- eslint-disable vue/no-v-html -->
<template>
  <div style="width: 100%; padding: 1rem 0">
    <div v-if="!error" style="display: flex; justify-content: space-between">
      <div :style="{ maxWidth: width }" class="doc-container">
        <DocumentCardHeader :doc="node" style="margin-bottom: 20px" />

        <!-- eslint-disable-next-line vue/no-v-html -->
        <article
          v-if="node"
          ref="element"
          :class="`${node.theme || preferencesStore.get('theme').value}-theme`"
          style="max-width: 100%"
          v-html="node.content_compiled"
        />
        <DocumentSkeleton v-else />
        <DocumentCardFooter :document="node" :next="next" :previous="previous" />
      </div>

      <div v-if="!isTablet() && !preferencesStore.get('hideTOC').value" class="toc">
        <TableOfContent :doc="node" :element="element" style="width: 320px; margin-left: 20px" />
      </div>

      <div
        class="no-print"
        :style="{
          marginRight: !isTablet() && preferencesStore.get('hideTOC').value && useSidebar().isOpened.value ? '200px' : '0px',
          transition: 'margin 0.3s',
        }"
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
import type { Node } from '~/stores';

const route = useRoute();
const documentsStore = useNodesStore();
const preferencesStore = usePreferences();
const element = ref<HTMLElement>();

const node = ref<Node | undefined>();
const error = ref<false | string>(false);

watchEffect(async () => {
  const document_id = route.params.id as string;
  const docFromStore = documentsStore.getById(document_id);
  if (!docFromStore) {
    if (documentsStore.isFetching) return;
    return (error.value = 'Document not found');
  }
  node.value = undefined;
  if (docFromStore.partial) {
    try {
      error.value = false;
      node.value = await documentsStore.fetch({ id: document_id });
    } catch (err: unknown) {
      error.value = (err as Error).message || 'Failed to fetch document';
    }
  } else node.value = docFromStore;
  useHead({ title: node.value?.name || '' });
});

definePageMeta({
  breadcrumb: () => {
    const doc = useNodesStore().getById(useRoute().params.id as string);
    return doc?.name || '';
  },
});

const next = computed(() => useSidebarTree().structure.value.next(node.value?.id)?.data);
const previous = computed(() => useSidebarTree().structure.value.previous(node.value?.id)?.data);
const width = computed(() => {
  if (preferencesStore.get('docSize').value == 2) return '980px';
  if (preferencesStore.get('docSize').value == 1) return '800px';
  return '700px';
});

onMounted(() => {
  // Keyboard shortcuts management for navigating between corresponding pages
  const handleDocumentKeydown = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'e') {
      // Go to the edit page of the current document
      if (!node.value?.id) return;
      e.preventDefault();
      useRouter().push(`/dashboard/docs/edit/${node.value.id}`);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      // Go to the next document page
      if (!next.value?.id) return;
      e.preventDefault();
      useRouter().push(`/dashboard/docs/${next.value.id}`);
    } else if (e.key === 'ArrowLeft') {
      if (!previous.value?.id) return;
      e.preventDefault();
      useRouter().push(`/dashboard/docs/${previous.value.id}`);
    }
  };

  document.addEventListener('keydown', handleDocumentKeydown);

  onUnmounted(() => {
    document.removeEventListener('keydown', handleDocumentKeydown);
  });
});
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
