<template>
	<li class="node-tree">
		<a class="label a-classic" :href="node.link">{{ node.title }}</a>
		<ul v-if="node.childrens && node.childrens.length">
			<NodeTree v-for="child in node.childrens" :node="child"></NodeTree>
		</ul>
	</li>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
interface Node {
	title: string;
	link: string;
	childrens?: Node[];
}
defineProps<{
	node: Node;
}>();
</script>
