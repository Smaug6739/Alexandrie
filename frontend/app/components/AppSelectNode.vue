<template>
  <li>
    <div class="tree-node" :style="{ paddingLeft: `${level * 20 + 12}px`, fontWeight: node.childrens?.length ? 700 : 500 }" @click.stop="select" :disabled="disabled && disabled(node)">
      {{ node.label }}
    </div>
    <ul v-if="node.childrens?.length">
      <AppSelectNode v-for="child in node.childrens" :key="child.id" :node="child" :level="level + 1" @select="$emit('select', $event)" :disabled="disabled" />
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
  padding: 8px 12px;
  text-align: left;
  cursor: pointer;
  font-size: 15px;
  width: 100%;
  margin: 0 auto;
}

.tree-node:hover {
  background-color: var(--selection-color);
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
