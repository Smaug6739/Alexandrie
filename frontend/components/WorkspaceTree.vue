<template>
  <div class="tree-node">
    <div class="tree-content">
      <div class="tree-label">
        <Icon name="folder" style="display: inline" />
        <span>{{ node.title }}</span>
      </div>
      <div class="tree-actions">
        <span style="padding: 2px" @click="$emit('edit', node)" title="Editer"><Icon name="edit" style="display: inline" /></span>
        <span style="padding: 2px" @click="$emit('delete', node)" title="Supprimer"><Icon name="delete" style="display: inline" /></span>
      </div>
    </div>

    <div class="tree-children" v-if="node.childrens && node.childrens.length">
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
  margin-left: 20px;
  padding-left: 12px;
  border-left: 1px solid var(--border-color);
}

.tree-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.tree-content::before {
  content: '';
  position: absolute;
  left: -12px;
  top: 50%;
  width: 12px;
  height: 1px;
  background-color: var(--border-color);
}

.tree-label {
  padding: 4px 0;
  font-size: 14px;
  display: flex;
  align-items: center;
  span {
    margin-left: 4px;
  }
}

.tree-actions {
  display: flex;
}

.tree-actions button {
  border: none;
  background: none;
  cursor: pointer;
}
</style>
