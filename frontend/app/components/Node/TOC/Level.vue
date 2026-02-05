<template>
  <li>
    <NuxtLink :to="node.link">{{ node.title }}</NuxtLink>
    <ul v-if="node.childrens?.length">
      <NodeTOCLevel v-for="child in node.childrens" :key="child.link" :node="child" />
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
  font-size: 12px;
  list-style: none;
  margin-top: 2px;
}

ul {
  margin: 0;
  padding: 0 0 0 15px;
}
</style>
