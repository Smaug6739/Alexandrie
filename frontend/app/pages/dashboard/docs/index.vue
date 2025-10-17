<template>
  <NodeList :parent="parent" :nodes="nodes" :parent-id="workspaceId" />
</template>

<script setup lang="ts">
import NodeList from '~/components/Node/NodeList.vue';
import type { Node } from '~/stores';

const nodesStore = useNodesStore();
const { filtered, workspaceId } = useSidebar();

const parent = computed(() => nodesStore.getById(workspaceId.value || ''));
definePageMeta({
  breadcrumb: () => 'All',
});

const nodes = computed(() => {
  const result: Node[] = [];
  const getNodes = (items: Item[]) => {
    for (const item of items) {
      if (item.data.role == 3) result.push(item.data);
      if (item.childrens) getNodes(item.childrens);
    }
  };
  getNodes(filtered.value);
  return result;
});
</script>
