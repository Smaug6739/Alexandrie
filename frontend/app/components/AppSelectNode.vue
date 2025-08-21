<template>
  <li>
    <div class="tree-node" :style="{ marginLeft: `${level * 20}px`, fontWeight: node.childrens?.length ? 500 : 400 }" :disabled="disabled && disabled(node)" @click.stop="select">
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
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  margin: 2px auto;
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

button[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
