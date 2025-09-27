<template>
  <li>
    <div
      class="tree-node"
      :style="{ marginLeft: `${level * 20}px`, fontWeight: node.childrens?.length ? 500 : 400 }"
      :disabled="disabled && disabled(node)"
      @click.stop="select"
    >
      {{ node.label }}
    </div>
    <ul v-if="node.childrens?.length">
      <AppSelectNode v-for="child in node.childrens" :key="child.id" :node="child" :level="level + 1" :disabled="disabled" @select="$emit('select', $event)" />
    </ul>
  </li>
</template>

<script setup lang="ts">
const props = defineProps<{
  node: ANode;
  level: number;
  disabled?: (i: ANode) => boolean;
}>();

const emit = defineEmits(['select']);

function select() {
  if (props.disabled && props.disabled(props.node)) return;
  emit('select', props.node);
}
</script>

<style scoped>
.tree-node {
  display: block;
  margin: 0 auto;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 15px;
  text-align: left;
  cursor: pointer;
}

.tree-node:hover {
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
