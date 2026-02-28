<!-- eslint-disable vue/no-v-html -->
<template>
  <div style="width: 100%; padding: 1rem 0" @contextmenu.prevent="showContextMenu">
    <div v-if="!error" style="display: flex; justify-content: space-between">
      <div :style="{ maxWidth: width }" class="doc-container">
        <NodeDocumentHeader :doc="node" style="margin-bottom: 20px" />

        <NodeDocumentContentCompiled v-if="node" ref="elementComponent" :node="node" />
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
import type { RouteLocationNormalizedLoaded } from 'vue-router';

import type { Node } from '~/stores';

import NodeContextMenu from '~/components/Node/Action/ContextMenu.vue';
import NodeDocumentContentCompiled from '~/components/Node/Document/ContentCompiled.vue';
import DeleteNodeModal from '~/components/Node/Modals/Delete.vue';
import {useBreadcrumbs} from "~/composables/useBreadcrumbs";

const documentsStore = useNodesStore();
const preferencesStore = usePreferencesStore();

const devise = useDevice();
const nodesTree = useNodesTree();
const route = useRoute();
const router = useRouter();

const hideTOC = preferencesStore.get('hideTOC');
const docSize = preferencesStore.get('docSize');

const elementComponent = ref<InstanceType<typeof NodeDocumentContentCompiled>>();
const element = computed(() => elementComponent.value?.rootElement as HTMLElement | undefined);

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
  breadcrumb: (route: RouteLocationNormalizedLoaded) => {
    return useBreadcrumbs().generateBreadcrumbsById(route.params.id as string)
  }
});

const next = computed(() => nodesTree.nextDocument(node.value?.id));
const previous = computed(() => nodesTree.prevDocument(node.value?.id));
const width = computed(() => {
  if (docSize.value == 2) return '980px';
  if (docSize.value == 1) return '800px';
  return '700px';
});

// Context menu
const contextMenu = useContextMenu();

function showContextMenu(event: MouseEvent) {
  contextMenu.open(shallowRef(NodeContextMenu), event, {
    props: { contextMenu: true, node: node.value },
  });
}

onMounted(() => {
  // Keyboard shortcuts management for navigating between corresponding pages
  const handleDocumentKeydown = (e: KeyboardEvent) => {
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
      if (!node.value) return;
      e.preventDefault();
      useModal().add(
        new Modal(shallowRef(DeleteNodeModal), {
          props: { node: node.value, redirectTo: '/dashboard' },
          size: 'small',
        }),
      );
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
