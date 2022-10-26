<template>
	<div class="sidebar-group">
		<NuxtLink :to="`/docs/${menuItem.theme}/${menuItem.path}`" class="parent" @click="emit('closeMobile')">
			<Icon :name="menuItem.icon" />
			<span class="parent_name">{{ menuItem.name }}</span>
		</NuxtLink>
		<ul v-if="isOpened">
			<li v-for="(children, index) of menuItem.childrens" :key="index" class="children" @click="emit('closeMobile')">
				<NuxtLink :to="children.link" class="sub_link a-classic">{{ children.name }}</NuxtLink>
			</li>
		</ul>
	</div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import Icon from "@/components/Icon.vue";
import type { MenuItem } from './types';

defineProps<{ menuItem: MenuItem, isOpened: boolean }>();
const emit = defineEmits(['closeMobile']);
</script>

<style lang="scss" scoped>
.sidebar-group {
	margin-top: 5px;
	width: 98%;
}

.parent {
	display: flex;
	border-radius: 12px;
	align-items: center;
	transition: all 0.8s ease;

	.parent_name {
		opacity: 1;
		pointer-events: auto;
	}

	&:hover {
		transition: all 0.2s ease;
		background: var(--contrast-color);

		.parent_name {
			color: var(--opposite-color);
		}
	}
}

.children {
	padding: 5px;
	text-align: left;
	font-size: 0.95rem;
	line-height: 1rem;
	list-style: none;
}

.parent_name {
	color: var(--font-color);
	font: normal 700 15px arial;
	opacity: 0;
	transition: 0.4s;
}

.sub_link {
	margin-left: 50px;
}

ul {
	padding: 0;
}
</style>