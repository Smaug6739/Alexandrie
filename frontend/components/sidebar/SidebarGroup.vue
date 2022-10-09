<template>
	<li>
		<NuxtLink :to="`/docs/${menuItem.theme}/${menuItem.path}`" class="parent" @click="emit('closeMobile')">
			<i class="icon bx" :class="menuItem.icon || 'bx-square-rounded'" />
			<span class="parent_name">{{ menuItem.name }}</span>
		</NuxtLink>
		<ul v-if="isOpened">
			<li v-for="(children, index) of menuItem.childrens" :key="index" class="children" @click="emit('closeMobile')">
				<NuxtLink :to="children.link" class="sub_link a-classic">{{children.name}}</NuxtLink>
			</li>
		</ul>
	</li>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import type { MenuItem } from './types';

defineProps<{ menuItem: MenuItem, isOpened: boolean }>();
const emit = defineEmits(['closeMobile']);
</script>

<style lang="scss" scoped>
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
		background: var(--opposite-color);

		i {
			transition: all 0.2s ease;
			color: var(--bg-color);
		}

		.parent_name {
			color: var(--bg-color);
		}
	}
}

.children {
	padding: 5px;
	text-align: left;
	font-size: 15px;
	line-height: 1rem;
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


.icon {
	min-width: 50px;
	line-height: 50px;
	font-size: 18px;
	text-align: center;
	border-radius: 12px;
}
</style>