<template>
  <div>
    <Teleport to="#navbar-bottom"><NodeTeamNavbar :team-id="teamId" /></Teleport>
    <NodeContainerView :parent="parent" :nodes="nodes" :parent-id="teamId" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ breadcrumb: { i18n: 'common.labels.all' } });

const nodesStore = useNodesStore();

const route = useRoute();
const tree = useNodesTree();

const teamId = route.params.id as string;
const parent = computed(() => nodesStore.getById(teamId));

const nodes = computed(() =>
  tree
    .getSubtreeAsArray(teamId)
    .filter(node => node.data.role === 3)
    .map(i => i.data),
);
</script>
