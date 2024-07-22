<template>
	<div v-if="item.childrens?.length">
		<div v-if="root" class="collapse-header">
			<SidebarItem :item="item" @click="toggleShow">
				<svg style="margin-left:auto;" :class="{ 'rotated': !show }" xmlns="http://www.w3.org/2000/svg" height="24"
					viewBox="0 -960 960 960" width="24">
					<path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z" />
				</svg>
			</SidebarItem>
		</div>
		<div v-else class="collapse-header">
			<SidebarItem :item="item" />
		</div>
		<div v-if="show" class="collapse-body">
			<div v-for="(child, index) in item.childrens">
				<div style="margin-left:20px;">
					<CollapseItem v-if="child.childrens?.length" :item="child" :key="index" />
					<SidebarItem v-else :item="child" />
				</div>
			</div>
		</div>
	</div>
	<SidebarItem v-else :item="item" />
</template>
<script setup lang="ts">
import type { Item } from './tree_builder';
import SidebarItem from './SidebarItem.vue';

defineProps<{ item: Item, root?: boolean }>();

const show = ref(true);
const toggleShow = () => show.value = !show.value;
</script>

<style lang="scss" scoped>
h2 {
	font-size: 16px;
	font-weight: 600;
	border: none;
	margin: 3px;
	line-height: 24px;
	padding: 0 !important;
}

.collapse-header {
	display: flex;
	align-items: center;
	justify-content: space-between;

	svg {
		height: 20px;
		fill: var(--font-color);

		:hover {
			cursor: pointer;
		}

		&.rotated {
			transform: rotate(-90deg);
		}
	}
}
</style>