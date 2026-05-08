<template>
  <NodeContainerView :parent="parent" :nodes="nodes" />
</template>

<script setup lang="ts">
import type { RouteLocationNormalizedLoaded } from 'vue-router';
import type { Node } from '~/stores';

import NodeDeleteModal from '~/components/Node/Modals/Delete.vue';

definePageMeta({
  breadcrumb: (route: RouteLocationNormalizedLoaded) => {
    return useBreadcrumbs().generateBreadcrumbsById(route.params.id as string);
  },
});

const route = useRoute();
const nodesStore = useNodesStore();

const parentId = route.params.id as string;
const parent = ref<Node | undefined>();

watchEffect(() => {
  parent.value = nodesStore.getById(parentId);
});

const nodes = computed(() => {
  return nodesStore.getAllChildrens(parent.value?.id || '').filter(d => d.role == 3);
});

const openDeleteModal = () => {
  if (!parent.value || !nodesStore.hasPermissions(parent.value, 4)) return;
  useModal().add(new Modal(shallowRef(NodeDeleteModal), { size: 'small', props: { node: parent.value, redirect: '/dashboard' } }));
};

const handleDocumentKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'Delete') return;
  event.preventDefault();
  openDeleteModal();
};

onMounted(() => {
  document.addEventListener('keydown', handleDocumentKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleDocumentKeydown);
});
</script>
