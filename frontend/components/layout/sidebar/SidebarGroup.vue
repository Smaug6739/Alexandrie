<template>
	<li class="li-style">
		<span class="a-style">
			<NuxtLink :to="`/docs/${menuItem.theme}/${menuItem.path}`">
				<i class="bx" :class="menuItem.icon || 'bx-square-rounded'" />
				<span class="links_name">{{ menuItem.name }}</span>
			</NuxtLink>
		</span>
		<ul v-if="isOpened">
			<span v-for="(children, index) of menuItem.childrens" :key="index">
				<li class="children" @click="emit('close')">
					<NuxtLink :to="children.link" class="sub_link a-classic">
						{{children.name}}
					</NuxtLink>
				</li>
			</span>
		</ul>
	</li>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import type { MenuItem } from './types';

defineProps<{ menuItem: MenuItem, isOpened: boolean }>();
const emit = defineEmits(['close']);
</script>


<style lang="scss" scoped>
.a-style a {
	display: flex;
	height: 100%;
	width: 100%;
	border-radius: 12px;
	align-items: center;
	text-decoration: none;
	transition: all 0.8s ease;
	background: var(--bg-color);
}

.a-style a:hover {
	background: var(--opposite-color);
}

.children {
	list-style: none;
	color: white;
	padding: 8px;
	text-align: left;
	font-size: 15.2px;
	line-height: 1.25rem;
}

.links_name {
	color: var(--font-color);
	font-size: 15px;
	font-weight: 600;
	white-space: nowrap;
	opacity: 0;
	pointer-events: none;
	transition: 0.4s;
}

.sub_link {
	margin-left: 40px;
}

.sidebar.open .li-style .a-style a .links_name {
	opacity: 1;
	pointer-events: auto;
}

.a-style a:hover .links_name,
.a-style a:hover i {
	transition: all 0.2s ease;
	color: var(--bg-color);
}

.li-style {
	position: relative;
	margin: 8px 0;
	list-style: none;

}

.li-style i {
	height: 50px;
	min-width: 50px;
	line-height: 50px;
	font-size: 18px;
	text-align: center;
	border-radius: 12px;
}
</style>