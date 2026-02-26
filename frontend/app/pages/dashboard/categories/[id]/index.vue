<template>
  <NodeContainerView :parent="parent" :nodes="nodes" />
</template>

<script setup lang="ts">
import type { RouteLocationNormalizedLoaded } from 'vue-router';
import type { Node } from '~/stores';
import {useBreadcrumbs} from "~/composables/useBreadcrumbs";

definePageMeta({
  breadcrumb: (route: RouteLocationNormalizedLoaded) => {
    return useBreadcrumbs().generateBreadcrumbsById(route.params.id as string)
  }
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
</script>
