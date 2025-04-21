<template>
  <li>
    <button class="tree-node" :style="{ paddingLeft: `${level * 20 + 12}px`, fontWeight: node.childrens?.length ? 700 : 400 }" @click.stop="select">
      {{ node.title }}
    </button>
    <ul v-if="node.childrens?.length">
      <AppSelectNode v-for="child in node.childrens" :key="child.id" :node="child" :level="level + 1" @select="$emit('select', $event)" />
    </ul>
  </li>
</template>

<script setup lang="ts">
const props = defineProps<{
  node: Item;
  level: number;
}>();

const emit = defineEmits(['select']);

function select() {
  emit('select', props.node);
}
</script>

<style scoped>
.tree-node {
  display: block;
  width: 100%;
  padding: 6px 12px;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
}

.tree-node:hover {
  background-color: #f0f0f0;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
