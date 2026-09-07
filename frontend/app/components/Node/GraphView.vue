<template>
  <div class="graph-view-container">
    <div class="tree">
      <ul>
        <GraphNode :nodes="nodes" @node-click="handleClick" />
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TreeItem } from '~/helpers/TreeBuilder';
import type { Node } from '~/stores';
import GraphNode from './GraphNode.vue';

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

<style lang="scss">
.graph-view-container {
  width: 100%;
  padding: 40px 20px;
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  background: var(--surface-base);
  overflow: auto hidden;
}

/* CSS Tree Layout */
.graph-view-container .tree {
  display: flex;
  justify-content: center;

  ul {
    position: relative;
    display: flex;
    margin: 0;
    padding-top: 20px;
    padding-left: 0;
    transition: all 0.5s;
  }

  li {
    position: relative;
    float: left;
    padding: 20px 5px 0;
    text-align: center;
    transition: all 0.5s;
    list-style-type: none;
  }

  /* We will use ::before and ::after to draw the connectors */
  li::before, li::after {
    position: absolute;
    top: 0;
    right: 50%;
    width: 50%;
    height: 20px;
    border-top: 2px solid var(--border);
    content: '';
  }

  li::after {
    right: auto;
    left: 50%;
    border-left: 2px solid var(--border);
  }

  /* We need to remove left-right connectors from elements without any siblings */
  li:only-child::after, li:only-child::before {
    display: none;
  }

  /* Remove space from the top of single children */
  li:only-child {
    padding-top: 0;
  }

  /* Remove left connector from first child and right connector from last child */
  li:first-child::before, li:last-child::after {
    border: 0 none;
  }

  /* Adding back the vertical connector to the last nodes */
  li:last-child::before {
    border-right: 2px solid var(--border);
    border-radius: 0 5px 0 0;
  }

  li:first-child::after {
    border-radius: 5px 0 0;
  }

  /* Time to add downward connectors from parents */
  ul ul::before {
    position: absolute;
    top: 0;
    left: 50%;
    width: 0;
    height: 20px;
    border-left: 2px solid var(--border);
    content: '';
  }

  /* Hide connectors for the absolute root level items */
  > ul > li::before, > ul > li::after {
    border: 0 !important;
  }
  
  /* Node styles */
  .node-card {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    font-family: var(--font-family);
    font-size: 14px;
    color: var(--text-body);
    text-decoration: none;
    background: var(--surface-raised);
    box-shadow: 0 2px 5px rgb(0 0 0 / 5%);
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      border-color: var(--primary);
      color: var(--primary);
      background: var(--primary-light, var(--surface-hover));
      box-shadow: 0 4px 10px rgb(0 0 0 / 10%);
      transform: translateY(-2px);
    }

    svg {
      width: 18px;
      height: 18px;
    }
  }

  .node-label {
    font-weight: 500;
    white-space: nowrap;
  }
}
</style>
