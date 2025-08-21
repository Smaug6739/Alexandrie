<template>
  <li>
    <a :href="node.link">{{ node.title }}</a>
    <ul v-if="node.childrens?.length">
      <NodeTree v-for="child in node.childrens" :key="child.link" :node="child" />
    </ul>
  </li>
</template>

<script lang="ts" setup>
interface Node {
  title: string;
  link: string;
  childrens?: Node[];
}

defineProps<{ node: Node }>();
</script>

<style scoped>
a {
  opacity: 0.85;
}

li {
  padding: 0;
  list-style: none;
  margin-top: 4px;
}

ul {
  margin: 0;
  padding: 0 0 0 15px;
}
</style>
