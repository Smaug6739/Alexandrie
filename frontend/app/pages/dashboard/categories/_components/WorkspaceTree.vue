<template>
  <div v-if="node.data.role === 2" class="tree-node">
    <div class="tree-content">
      <div class="tree-label">
        <Icon class="icon" name="folder" style="display: inline; width: 18px" fill="var(--yellow)" />
        <span>{{ node.label }}</span>
      </div>
      <div class="tree-actions">
        <span style="padding: 2px" @click="$emit('edit', node)"><Icon class="icon" name="edit" style="display: inline" /></span>
        <span style="padding: 2px" @click="$emit('delete', node)"><Icon class="icon" name="delete" style="display: inline" /></span>
      </div>
    </div>

    <div v-if="node.children && node.children.length" class="tree-children">
      <WorkspaceTree v-for="child in node.children" :key="child.id" :node="child" @edit="$emit('edit', $event)" @delete="$emit('delete', $event)" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { TreeItem } from '~/helpers/TreeBuilder';
import type { Node } from '~/stores';

defineProps<{ node: TreeItem<Node> }>();
defineEmits(['edit', 'delete']);
</script>

<style scoped lang="scss">
.tree-node {
  position: relative;
  border-left: 1px solid var(--border);
  margin-left: 20px;
  padding-left: 12px;
}

.tree-content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tree-content::before {
  position: absolute;
  top: 50%;
  left: -12px;
  width: 12px;
  height: 1px;
  background-color: var(--border);
  content: '';
}

.tree-label {
  display: flex;
  padding: 4px 0;
  font-size: 14px;
  align-items: center;

  span {
    margin-left: 4px;
  }
}

.tree-actions {
  display: flex;
}

.tree-actions span {
  margin: 0 2.5px;
  border-radius: 4px;
  cursor: pointer;
}

.icon {
  margin-right: 2px;

  &:deep(svg) {
    width: 20px;
    height: 20px;
  }
}
</style>
