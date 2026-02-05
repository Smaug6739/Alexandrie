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
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-color);
  margin-top: 2rem;
  overflow: hidden;
}

.tree-header {
  display: flex;
  padding: 1rem 1.25rem;
  background: var(--bg-contrast);
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  justify-content: space-between;

  h2 {
    display: flex;
    margin: 0;
    border: none;
    font-size: 1rem;
    font-weight: 600;
    color: var(--font-color-dark);
    align-items: center;
    gap: 0.5rem;
  }
}

.item-count {
  padding: 4px 10px;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  font-size: 0.75rem;
  color: var(--font-color-light);
  background: var(--bg-color);
}

.tree-content {
  padding: 0.5rem 0;
}

.empty-state {
  display: flex;
  padding: 3rem;
  color: var(--font-color-light);
  align-items: center;
  flex-direction: column;
  justify-content: center;

  p {
    margin: 0.5rem 0 0;
  }
}
</style>
