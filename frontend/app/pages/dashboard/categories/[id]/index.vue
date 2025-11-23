<template>
  <NodeList :parent="parent" :nodes="nodes" />
</template>

<script setup lang="ts">
import NodeList from '~/components/Node/NodeList.vue';
import type { Node } from '~/stores';

const route = useRoute();
const nodesStore = useNodesStore();

const parentId = route.params.id as string;
const parent = ref<Node | undefined>();

definePageMeta({ breadcrumb: () => useNodesStore().getById(useRoute().params.id as string)?.name || '' });

watchEffect(() => {
  parent.value = nodesStore.getById(parentId);
});

const nodes = computed(() => {
  return nodesStore.getAllChildrens(parent.value?.id || '').filter(d => d.role == 3);
});
</script>
