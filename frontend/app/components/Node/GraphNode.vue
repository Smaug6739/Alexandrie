<template>
  <li v-for="node in nodes" :key="node.id">
    <div class="node-card" @click="handleClick(node)">
      <Icon v-if="node.icon" :name="node.icon" />
      <Icon v-else :name="node.children ? 'folder' : 'document'" />
      <span class="node-label">{{ node.label }}</span>
    </div>
    
    <ul v-if="node.children && node.children.length > 0">
      <GraphNode :nodes="node.children" @node-click="handleClick" />
    </ul>
  </li>
</template>

<script setup lang="ts">
import type { TreeItem } from '~/helpers/TreeBuilder';
import type { Node } from '~/stores';

defineOptions({
  name: 'GraphNode'
});

defineProps<{
  nodes: TreeItem<Node>[];
}>();

const emit = defineEmits<{
  (e: 'node-click', node: TreeItem<Node>): void;
}>();

function handleClick(node: TreeItem<Node>) {
  emit('node-click', node);
}
</script>
