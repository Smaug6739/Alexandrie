<template>
	<div class="sidebar-group">
		<NuxtLink class="parent" @click="emit('closeMobile')" :to="`/docs/${menuItem.id}`">
			<Icon :svg="menuItem.icon" />
			<span class="parent_name">{{ menuItem.name }}</span>
		</NuxtLink>
		<ul>
			<li v-for="(children, index) of menuItem.childrens" :key="index" class="children" @click="emit('closeMobile')">
				<NuxtLink :to="children.link" class="sub_link a-classic">{{ children.name }}</NuxtLink>
			</li>
		</ul>
	</div>
</template>

<script lang="ts" setup>
import Icon from "@/components/Icon.vue";
import type { MenuItem } from './types';

defineProps<{ menuItem: MenuItem }>();
const emit = defineEmits(['closeMobile']);
</script>

<style lang="scss" scoped>
.sidebar-group {
	margin-top: 5px;
	width: 97%;
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
		background: var(--bg-contrast);

		.parent_name {
			color: $primary-400;
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
	margin-left: 30px;
}

ul {
	padding: 0;
	margin: 0;
}

.a-classic {
	text-decoration: none;
	color: var(--font-color);

	&:hover {
		color: $primary-400;
	}
}
</style>