<template>
	<button :class="`button button--${style}`">
		<slot></slot>
	</button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ type: string }>()
const style = computed(() => props.type)

</script>

<style lang="scss" scoped>
button {
	padding: 10px 20px;
	border-radius: 5px;
	border: none;
	color: white;
	cursor: pointer;
	font-size: 16px;
	transition: 0.3s;
}

.button--opposite {
	background-color: var(--font-color);
	color: var(--bg-color);

	&:hover {
		background-color: var(--font-color);
	}


}

.button--ghost {
	background-color: transparent;
	color: var(--font-color-dimmed);

	&:hover {
		background-color: var(--bg-color-secondary);
	}
}
</style>
