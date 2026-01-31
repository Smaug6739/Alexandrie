<template>
  <AppDotMenu>
    <NodeActionContextMenu :node="node" />
  </AppDotMenu>
</template>

<script setup lang="ts">
import type { Node } from '~/stores';

defineProps<{ node: Node }>();
</script>
