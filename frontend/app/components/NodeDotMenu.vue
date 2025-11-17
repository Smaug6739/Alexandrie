<template>
  <AppDotMenu ref="dotMenu">
    <NodeContextMenu :node="node" />
  </AppDotMenu>
</template>

<script setup lang="ts">
import NodeContextMenu from '~/components/Node/NodeContextMenu.vue';
import type { Node } from '~/stores';

defineProps<{ node: Node }>();
</script>
