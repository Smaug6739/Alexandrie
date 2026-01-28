<template>
  <div class="tree">
    <div class="tree-header">
      <h2>
        <Icon name="categories" display="lg" />
        Contents
      </h2>
      <span class="item-count">{{ totalCount }} items</span>
    </div>

    <div class="tree-content">
      <NodeTreeItem v-for="node in rootNodes" :key="node.id" :node="node" :all-nodes="allNodes" :depth="0" />
    </div>

    <div v-if="!rootNodes.length" class="empty-state">
      <Icon name="files" display="xxl" />
      <p>No content available</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Node } from '~/stores';

const props = defineProps<{
  nodes: Node[];
  parentId: string;
}>();

// All nodes map for quick lookup
const allNodes = computed(() => {
  const map = new Map<string, Node>();
  props.nodes.forEach(n => map.set(n.id, n));
  return map;
});

// Root nodes are direct children of the parent
const rootNodes = computed(() => {
  return props.nodes
    .filter(n => n.parent_id === props.parentId)
    .sort((a, b) => {
      if (a.role !== b.role) return a.role - b.role;
      const orderA = a.order ?? 0;
      const orderB = b.order ?? 0;
      if (orderA !== orderB) return orderB - orderA;
      return a.name.localeCompare(b.name);
    });
});

const totalCount = computed(() => props.nodes.length);
</script>

<style scoped lang="scss">
.tree {
  margin-top: 2rem;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-color);
  overflow: hidden;
}

.tree-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background: var(--bg-contrast);
  border-bottom: 1px solid var(--border-color);

  h2 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--font-color-dark);
    border: none;
  }
}

.item-count {
  font-size: 0.75rem;
  color: var(--font-color-light);
  background: var(--bg-color);
  padding: 4px 10px;
  border-radius: 20px;
  border: 1px solid var(--border-color);
}

.tree-content {
  padding: 0.5rem 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: var(--font-color-light);

  p {
    margin: 0.5rem 0 0;
  }
}
</style>
