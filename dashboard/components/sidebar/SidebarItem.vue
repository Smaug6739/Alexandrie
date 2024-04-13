<template>
	<NuxtLink class="item" :to="item.route" :class="{ active: isActive(item.id) }">
		<i v-html="item.icon" class="icon"></i>
		<span>{{ item.title }}</span>
		<slot></slot>
	</NuxtLink>
</template>

<script setup lang="ts">
import { type Item } from './helpers';
const route = useRoute();

defineProps<{ item: Item }>();
const doc_id = computed(() => route.query.doc as string);
const isActive = (id: string) => doc_id.value === id;
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
	&.active {
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