<template>
  <NodeContainerView :parent="parent" :nodes="nodes" />
</template>

<script setup lang="ts">
import NodeDeleteModal from '~/components/Node/Modals/Delete.vue';
import type { RouteLocationNormalizedLoaded } from 'vue-router';
import type { Node } from '~/stores';

definePageMeta({
  breadcrumb: (route: RouteLocationNormalizedLoaded) => {
    return useBreadcrumbs().generateBreadcrumbsById(route.params.id as string);
  },
});

const nodesStore = useNodesStore();
const nodesTree = useNodesTree();

const modals = useModal();
const route = useRoute();

const parentId = route.params.id as string;
const parent = ref<Node | undefined>();

watchEffect(() => {
  parent.value = nodesStore.getById(parentId);
});

const nodes = computed(() => {
  return nodesTree
    .getSubtreeAsArray(parent.value?.id || '')
    .filter(d => d.data.role === 3)
    .map(c => c.data);
});

const openDeleteModal = () => {
  if (!parent.value || !nodesStore.hasPermissions(parent.value, 4)) return;
  modals.add(new Modal(shallowRef(NodeDeleteModal), { size: 'small', props: { node: parent.value, redirect: '/dashboard' } }));
};

// Shortcuts
function handleKeydown(event: KeyboardEvent) {
  if (event.key !== 'Delete') return;
  event.preventDefault();
  openDeleteModal();
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>
