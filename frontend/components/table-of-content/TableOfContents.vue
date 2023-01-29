
<script lang="ts" setup>

import { ref, onBeforeUnmount, watch, computed } from "vue";
import NodeTree from './NodeTree.vue';
import type { GroupedHeaders } from "./types"


const props = defineProps<{ element: HTMLElement; }>();
const headers = computed(() => groupHeadersByLevels(props.element));
const list = ref<HTMLElement>();

// STEP 1: Get all headers elements from the article
// STEP 2: Group headers by level
// STEP 3: Create a tree from the grouped headers

function getAllHeadersElements(element: HTMLElement): HTMLElement[] {
	if (!element) return [];
	const updatedHeaders: HTMLElement[] = [];
	element
		.querySelectorAll<HTMLHeadingElement>('h2, h3')
		.forEach((el) => {
			if (el.textContent && el.id) {
				updatedHeaders.push(el);
			}
		})
	return updatedHeaders;
}


function groupHeadersByLevels(element: HTMLElement): GroupedHeaders[] {
	const elements = getAllHeadersElements(element);
	const groupedHeaders: GroupedHeaders[] = [];
	elements.forEach((el) => {
		if (el.tagName === 'H2') {
			groupedHeaders.push({
				title: el.innerText.split(' ').slice(1).join(' '),
				link: `#${el.id}`,
			})
		} else {
			const parent = groupedHeaders[groupedHeaders.length - 1];
			if (parent) {
				if (!parent.childrens) {
					parent.childrens = [];
				}
				parent.childrens.push({
					title: el.innerText.split(' ').slice(1).join(' '),
					link: `#${el.id}`,
				})
			}
		}
	})
	return groupedHeaders
}


const options = {
	root: null,
	threshold: 1,
}
const observerCallback = (e: IntersectionObserverEntry[]) => {
	e.forEach((entry) => {
		const activeLink = list.value?.querySelector<HTMLAnchorElement>(`[href="#${entry.target.id}"]`)
		if (activeLink && entry.isIntersecting && entry.intersectionRatio === 1) {
			activeLink.classList.add('active')
		} else if (activeLink) {
			activeLink.classList.remove('active')
		}
	})
};
if (process.client) {
	const observer = new IntersectionObserver(observerCallback, options)

	// Watch props.element for changes (= when article is loaded)
	watch(props, () => {
		observer.disconnect();
		const headings = getAllHeadersElements(props.element);
		// Track all headings
		headings.forEach((section) => observer.observe(section))
	});

	onBeforeUnmount(() => {
		observer.disconnect();
	})
}

</script>

<template>
	<aside>
		<ul ref="list" class="toc">
			<h4>Table des matières</h4>
			<!--Recursive lists -->
			<NodeTree v-if="headers.length" v-for="header of headers" :node="header" />
			<p v-else>Aucun élément à afficher</p>
		</ul>
	</aside>
</template>

<style lang="scss" scoped>
@media (min-width: 1280px) {
	.toc {
		position: sticky;
		top: 20px;
		padding-left: 15px;
		margin-left: 10px;
		font-size: 0.75rem;
		max-width: 100%;
		font-weight: 500;
	}

	ul {
		border-left: 1px solid $divider;
		padding: 0;
		margin: 0;
	}
}
</style>