<template>
	<li class="li-style" @click="emit('open')">
		<i class="bx bx-search" />
		<input type="text" :placeholder="searchPlaceholder" :class="isOpened ? 'open' : ''"
			@input="(v) => emit('search',( v.target as HTMLInputElement).value)" />
	</li>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';

defineProps<{ isOpened: boolean, searchPlaceholder: string }>();
const emit = defineEmits(['open', 'search']);

</script>

<style lang="scss" scoped>
.li-style {
	position: relative;
	margin: 8px 0;
	list-style: none;
}



input {
	font-size: 15px;
	color: var(--font-color);
	font-weight: 400;
	outline: none;
	height: 50px;
	width: 100%;
	width: 50px;
	border: none;
	border-radius: 12px;
	transition: all 0.2s ease;
	background: var(--contrast-color);

	&.open {
		padding: 0 20px 0 50px;
		width: 95%;
	}
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


.bx-search:hover {
	background: var(--font-color);
	color: var(--bg-color);
}
</style>