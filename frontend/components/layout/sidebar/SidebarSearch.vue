<template>
	<li class="li-style" v-if="isSearch" @click="emit('open')">
		<i class="bx bx-search" />
		<input type="text" :placeholder="searchPlaceholder"
			@input="(v) => emit('search',( v.target as HTMLInputElement).value)" />
	</li>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';

defineProps<{ isOpened: boolean, isSearch: boolean, searchPlaceholder: string }>();
const emit = defineEmits(['open', 'search']);

</script>

<style lang="scss" scoped>
.li-style {
	position: relative;
	margin: 8px 0;
	list-style: none;
}

li:hover .tooltip {
	opacity: 1;
	pointer-events: auto;
	transition: all 0.4s ease;
	top: 50%;
	transform: translateY(-50%);
}

input {
	font-size: 15px;
	color: var(--font-color);
	font-weight: 400;
	outline: none;
	height: 50px;
	padding: 0 20px 0 50px;
	width: 95%;
	border: none;
	border-radius: 12px;
	transition: all 0.2s ease;
	background: var(--contrast-color);
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

.bx-search {
	position: absolute;
	top: 50%;
	left: 0;
	transform: translateY(-50%);
	font-size: 22px;
	background: var(--contrast-color);
}

.li-style .tooltip {
	position: absolute;
	top: -20px;
	left: calc(100% + 15px);
	z-index: 3;
	background: var(--font-color-dimmed);
	box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
	padding: 6px 12px;
	border-radius: 4px;
	font-size: 15px;
	font-weight: 400;
	opacity: 0;
	white-space: nowrap;
	pointer-events: none;
	transition: 0s;
}
</style>