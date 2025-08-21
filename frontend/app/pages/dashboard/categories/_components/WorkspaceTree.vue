<template>
  <div v-if="node.data.type === 'category'" class="tree-node">
    <div class="tree-content">
      <div class="tree-label">
        <Icon class="icon" name="folder" style="display: inline; width: 15px" />
        <span>{{ node.label }}</span>
      </div>
      <div class="tree-actions">
        <span style="padding: 2px" @click="$emit('edit', node)"><Icon class="icon" name="edit" style="display: inline" /></span>
        <span style="padding: 2px" @click="$emit('delete', node)"><Icon class="icon" name="delete" style="display: inline" /></span>
      </div>
    </div>

    <div v-if="node.childrens && node.childrens.length" class="tree-children">
      <WorkspaceTree v-for="child in node.childrens" :key="child.id" :node="child" @edit="$emit('edit', $event)" @delete="$emit('delete', $event)" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Category } from '~/stores';

defineProps<{ node: Item<Category> }>();

defineEmits(['edit', 'delete']);
</script>

<style scoped lang="scss">
.tree-node {
  position: relative;
  border-left: 1px solid var(--border-color);
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
  background-color: var(--border-color);
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
