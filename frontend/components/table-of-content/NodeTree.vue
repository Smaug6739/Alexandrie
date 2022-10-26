<template>
	<li>
		<a :href="node.link">{{ node.title }}</a>
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
<style scoped lang="scss">
a {
	color: var(--opposite-color);
	opacity: 0.7;

	&:hover {
		opacity: 1;
	}
}



li {
	list-style: none;
	padding: 0;
	margin: 0;
	margin-top: 3px;
}

ul {
	padding: 0;
	margin: 0;
	padding-left: 15px;
}
</style>
