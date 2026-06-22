<template>
  <div>
    <Teleport to="#navbar-bottom"><NodeTeamNavbar :team="team!" /></Teleport>
    <NodeContainerView :parent="parent" :nodes="nodes" :parent-id="teamId" />
  </div>
</template>

<script setup lang="ts">
import type { TreeItem } from '~/helpers/TreeBuilder';
import type { Node } from '~/stores';

definePageMeta({ breadcrumb: { i18n: 'common.labels.all' } });

const nodesStore = useNodesStore();

const route = useRoute();
const tree = useNodesTree();

const teamId = computed(() => route.params.id as string);
const team = computed(() => nodesStore.getById(teamId.value));
const parent = computed(() => nodesStore.getById(teamId.value));

const nodes = computed(() => {
  return tree.getChildren(teamId.value).map((item: TreeItem<Node>) => item.data);
});
</script>
