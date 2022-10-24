
<script lang="ts" setup>
import NodeTree from './NodeTree.vue';
const props = defineProps<{
	element: HTMLElement;
}>();
const headers = computed(() => {
	return getHeaders(props.element)
});

interface TableItem {
	level: number;
	title: string;
	link: string;
}

function getHeaders(element: HTMLElement): GroupedHeaders[] {
	if (!element) return [];
	const updatedHeaders: TableItem[] = [];
	element
		.querySelectorAll<HTMLHeadingElement>('h2, h3')
		.forEach((el) => {
			if (el.textContent && el.id) {
				updatedHeaders.push({
					level: Number(el.tagName[1]),
					title: el.innerText.split(' ').slice(1).join(' '),
					link: `#${el.id}`,
				})
			}
		})
	return groupHeaders(updatedHeaders);
}

interface GroupedHeaders {
	title: string;
	link: string;
	childrens?: GroupedHeaders[];
}

function groupHeaders(headers: TableItem[]): GroupedHeaders[] {
	const groupedHeaders: GroupedHeaders[] = [];
	headers.forEach((header) => {
		if (header.level === 2) {
			groupedHeaders.push({
				title: header.title,
				link: header.link,
			})
		} else {
			const parent = groupedHeaders[groupedHeaders.length - 1];
			if (parent) {
				if (!parent.childrens) {
					parent.childrens = [];
				}
				parent.childrens.push({
					title: header.title,
					link: header.link,
				})
			}
		}
	})
	return groupedHeaders
}

</script>


<template>
	<!--Create recursive lists -->
	<ul class="table_of_content">
		<h4>Table des matières</h4>
		<NodeTree v-for="header of headers" :node="header" />
	</ul>
</template>

<style lang="scss">
.table_of_content {
	li {
		list-style: none;
		font-size: 0.75rem;
		padding: 0;
		margin: 0;
		margin-top: 3px;
	}

	ul {
		padding: 0;
		margin: 0;
		padding-left: 15px;
	}

	.label {
		cursor: pointer;
	}
}
</style>