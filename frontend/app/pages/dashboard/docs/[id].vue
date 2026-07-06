<template>
  <div style="width: 100%; padding: 1rem 0" @contextmenu.prevent="openContextMenu">
    <div v-if="!error" style="display: flex; justify-content: space-between">
      <div :style="{ maxWidth: width }" class="doc-container">
        <NodeDocumentHeader :doc="node" style="margin-bottom: 20px" />

        <NodeDocumentContentCompiled v-if="node && !node.partial" ref="elementComponent" :node="node" />
        <NodeDocumentSkeleton v-else />
        <NodeDocumentFooter :document="node" :next="next" :previous="previous" />
      </div>

      <div v-if="!devise.isTablet.value && !hideTOC" class="toc">
        <NodeTOC :doc="node" :element="element" style="width: 320px; margin-left: 20px" />
      </div>
    </div>
    <Error v-else :error="error" />
  </div>
</template>
<script setup lang="ts">
import NodeContextMenu from '~/components/Node/Action/ContextMenu.vue';
import NodeDocumentContentCompiled from '~/components/Node/Document/ContentCompiled.vue';
import DeleteNodeModal from '~/components/Node/Modals/Delete.vue';

import type { RouteLocationNormalizedLoaded } from 'vue-router';
import type { Node } from '~/stores';

definePageMeta({
  breadcrumb: (route: RouteLocationNormalizedLoaded) => {
    return useBreadcrumbs().generateBreadcrumbsById(route.params.id as string);
  },
});

const documentsStore = useNodesStore();
const preferencesStore = usePreferencesStore();

const devise = useDevice();
const nodesTree = useNodesTree();
const contextMenu = useContextMenu();
const modals = useModal();
const route = useRoute();
const router = useRouter();

const hideTOC = preferencesStore.get('hideTOC');
const docSize = preferencesStore.get('docSize');

const elementComponent = ref<InstanceType<typeof NodeDocumentContentCompiled>>();
const element = computed(() => elementComponent.value?.rootElement as HTMLElement | undefined);

const error = ref<false | string>(false);

const documentId = computed(() => route.params.id as string);

const next = computed(() => nodesTree.nextDocument(node.value?.id));
const previous = computed(() => nodesTree.prevDocument(node.value?.id));

const node = computed<Node | undefined>(() => {
  if (!documentId.value) return undefined;
  return documentsStore.getById(documentId.value);
});

const width = computed(() => {
  if (docSize.value == 2) return '980px';
  if (docSize.value == 1) return '800px';
  return '700px';
});

async function loadDocument(id: string) {
  error.value = false;

  if (documentsStore.isFetching) return;

  const cached = documentsStore.getById(id);

  if (!cached) {
    error.value = 'Document not found';
    return;
  }

  if (cached.partial) {
    try {
      await documentsStore.fetch({ id });
    } catch (err: unknown) {
      error.value = (err as Error).message || 'Failed to fetch document';
    }
  }

  if (node.value) useHead({ title: node.value.name });
}

watch(
  [documentId, () => documentsStore.isFetching],
  ([newId, _]) => {
    if (newId) {
      loadDocument(newId);
    }
  },
  { immediate: true },
);

// Actions
const openContextMenu = (event: MouseEvent) => {
  if (!node.value) return;
  contextMenu.open(shallowRef(NodeContextMenu), event, {
    props: { contextMenu: true, node: node.value },
  });
};

const openDeleteModal = () => {
  if (!node.value) return;
  modals.add(
    new Modal(shallowRef(DeleteNodeModal), {
      props: { node: node.value, redirectTo: '/dashboard' },
      size: 'small',
    }),
  );
};

// Shortcuts
function handleDocumentKeydown(e: KeyboardEvent) {
  if (e.ctrlKey && e.key === 'e') {
    // Go to the edit page of the current document
    if (!node.value) return;
    e.preventDefault();
    router.push(`/dashboard/docs/edit/${node.value.id}`);
  }
  if (e.key === 'ArrowRight') {
    // Go to the next document page
    e.preventDefault();
    if (!next.value?.id) return;
    e.preventDefault();
    router.push(`/dashboard/docs/${next.value.id}`);
  }
  if (e.key === 'ArrowLeft') {
    if (!previous.value?.id) return;
    e.preventDefault();
    router.push(`/dashboard/docs/${previous.value.id}`);
  }
  if (e.key === 'Escape') {
    // Close context menu on Escape
    contextMenu.close();
  }
  if (e.key === 'Delete') {
    // Open delete modal on Delete
    e.preventDefault();
    openDeleteModal();
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleDocumentKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleDocumentKeydown);
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
