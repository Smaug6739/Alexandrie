<template>
  <div>
    <Teleport to="#navbar-bottom"><NodeTeamNavbar :team-id="teamId" /></Teleport>
    <NodeContainerView :parent="parent" :nodes="nodes" :parent-id="teamId">
      <template #title>
        <Icon name="nodes" display="lg" />
        {{ t('nodes.nodes') }}
      </template>
    </NodeContainerView>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ breadcrumb: { i18n: 'common.labels.all' } });

const nodesStore = useNodesStore();

const route = useRoute();
const tree = useNodesTree();
const { t } = useI18nT();

const teamId = route.params.id as string;
const parent = computed(() => nodesStore.getById(teamId));

const nodes = computed(() =>
  tree
    .getSubtreeAsArray(teamId)
    .filter(node => node.data.role === 3)
    .map(i => i.data),
);
</script>
