<template>
  <li>
    <div
      class="tree-node"
      :style="{ marginLeft: `${level * 20}px`, fontWeight: node.children?.length ? 700 : 500 }"
      :disabled="disabled && disabled(node)"
      :class="{ selected: node.id === selectedId }"
      @click.stop="select"
    >
      <slot v-if="$slots.node" name="node" :node="node" />
      <template v-else>
        {{ node.label }}
      </template>
    </div>
    <ul v-if="node.children?.length">
      <AppSelectNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :level="level + 1"
        :disabled="disabled"
        :selected-id="selectedId"
        @select="$emit('select', $event)"
      >
        <template v-if="$slots.node" #node="{ node: childNode }">
          <slot name="node" :node="childNode" />
        </template>
      </AppSelectNode>
    </ul>
  </li>
</template>

<script setup lang="ts">
import type { VNodeChild } from 'vue';

const props = defineProps<{
  node: ANode;
  level: number;
  disabled?: (i: ANode) => boolean;
  selectedId?: string | number;
}>();

const emit = defineEmits(['select']);

defineSlots<{
  node?: (props: { node: ANode }) => VNodeChild;
}>();

function select() {
  if (props.disabled && props.disabled(props.node)) return;
  emit('select', props.node);
}
</script>

<style scoped lang="scss">
.tree-node {
  display: block;
  margin: 0 auto;
  padding: 4px 6px;
  border-radius: var(--radius-xs);
  font-family: $font-ui;
  font-size: 0.85rem;
  text-align: left;
  cursor: pointer;
}

.tree-node:hover {
  background-color: var(--selection-color);
}

.selected {
  background-color: var(--selection-color);
}

ul,
li {
  margin: 0;
  padding: 0;
  list-style: none;
}

div[disabled='true'] {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
