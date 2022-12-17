<template>
	<li>
		<a :href="node.link">{{ node.title }}</a>
		<ul v-if="node.childrens && node.childrens.length">
			<NodeTree v-for="child in node.childrens" :node="child"></NodeTree>
		</ul>
	</li>
</template>

<script lang="ts" setup>
interface Node {
	title: string;
	link: string;
	childrens?: Node[];
}

defineProps<{ node: Node; }>();
</script>

<style scoped>
a {
	color: var(--opposite-color);
	opacity: 0.75;
}

a:hover {
	opacity: 1;
}

li {
	list-style: none;
	padding: 0;
	margin: 3px 0 0 0;
}

ul {
	padding: 0 0 0 15px;
	margin: 0;
}
</style>
