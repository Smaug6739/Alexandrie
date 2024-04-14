<template>
	<NuxtLink class="item" :to="item.route" @click="() => item.route && toggle()">
		<i v-html="getIcon(item)" class="icon"></i>
		<span>{{ item.title }}</span>
		<slot></slot>
	</NuxtLink>
</template>

<script setup lang="ts">
import type { Item } from './tree_builder';
import { icons } from './helpers';
const { isOpened } = useSidebar();
defineProps<{ item: Item }>();
const isMobile = () => process.client ? window.innerWidth <= 768 : false;

function getIcon(item: Item) {
	if ('icon' in item.data && item.data.icon) return item.data.icon;
	if (item.data.type === 'category') return icons.folder;
	if (item.data.type === 'document' && item.childrens?.length) return icons.file_parent;
	if (item.data.type === 'document' && item.data.accessibility != 1) return icons.draft;
	return icons.file;
}
const toggle = () => isMobile() && (isOpened.value = false);
</script>

<style lang="scss" scoped>
.item {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	min-height: 29px;
	padding: 0 2.5px;
	margin: 2.5px 0;
	border-radius: 5px;
	color: var(--font-color);
	cursor: pointer;
	width: 98%;

	&:hover,
	&.router-link-active {
		background: var(--bg-contrast-2);
	}

	.icon {
		display: flex;
		align-items: center;

		&:deep(svg) {
			fill: var(--blue);
			width: 22px;
			height: 20px;
			margin-right: 5px;

			path {
				fill: var(--blue);
			}
		}
	}
}
</style>