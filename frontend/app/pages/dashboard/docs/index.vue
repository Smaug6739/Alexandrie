<template>
  <NodeContainerView :parent="parent" :nodes="nodes" :parent-id="workspaceId" />
</template>

<script setup lang="ts">
import type { TreeItem } from '~/helpers/TreeBuilder';
import type { Node } from '~/stores';

definePageMeta({ breadcrumb: {i18n: 'common.labels.all'} });

const nodesStore = useNodesStore();
const { filtered, workspaceId } = useSidebar();

const parent = computed(() => nodesStore.getById(workspaceId.value || ''));

const nodes = computed(() => {
  const result: Node[] = [];
  const getNodes = (items: TreeItem<Node>[]) => {
    for (const item of items) {
      if (item.data.role == 3) result.push(item.data);
      if (item.children) getNodes(item.children);
    }
  };
  getNodes(filtered.value);
  return result;
});
</script>
