<template>
	<span @click="emit('open')">
		<Icon name="bx bx-search" class="icon" />
		<input type="text" :placeholder="searchPlaceholder" :class="isOpened ? 'open' : ''"
			@input="(v) => emit('search', (v.target as HTMLInputElement).value)" />
	</span>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import Icon from "@/components/Icon.vue";

defineProps<{ isOpened: boolean, searchPlaceholder: string }>();
const emit = defineEmits(['open', 'search']);
</script>

<style lang="scss" scoped>
input {
	outline: none;
	height: 50px;
	border: none;
	border-radius: 12px;
	transition: all 0.2s ease;
	background: var(--contrast-color);

	&.open {
		padding: 0 20px 0 50px;
		width: 95%;
	}
}

span {
	margin-top: 25px;
	position: relative;
}

.icon {
	position: absolute;
	top: 50%;
	left: 0;
	transform: translateY(-50%);
	font-size: 20px;
	background: var(--contrast-color);
}
</style>