<template>
	<Collapse>
		<template v-slot:header>
			<NuxtLink class="item">
				<i v-if="item.icon" v-html="item.icon" class="icon"></i>
				<span>{{ item.title }}</span>
			</NuxtLink>
		</template>
		<template v-slot:body>
			<template v-for="(child, index) in item.childrens">
				<div style="margin-left:15px;">
					<CollapseItem v-if="child.childrens?.length" :item="child" :key="index" />
					<NuxtLink v-else class="item children" :to="child.route">
						<i v-html="child.icon" class="icon"></i>
						<span>{{ child.title }}</span>
					</NuxtLink>
				</div>
			</template>
		</template>
	</Collapse>
</template>
<script setup lang="ts">
import { type Item } from './helpers';
import Collapse from './Collapse.vue';

defineProps<{ item: Item }>();
</script>

<style lang="scss" scoped>
.item {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	height: 30px;
	padding: 0 2.5px;
	margin: 2.5px 0;
	border-radius: 5px;
	color: var(--font-color);
	cursor: pointer;
	transition: all $transition-duration ease;
	width: 90%;

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
			margin-right: 7px;

			path {
				fill: var(--blue);
			}
		}
	}
}
</style>