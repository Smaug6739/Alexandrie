<template>
	<div class="collapse-header item" @click="toggleShow">
		<svg :class="{ 'rotated': !show }" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
			<path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z" />
		</svg>
		<slot name="header"></slot>
	</div>
	<div v-if="show" class="collapse-body">
		<slot name="body"></slot>
	</div>
</template>

<script setup lang="ts">
const show = ref(true);
const toggleShow = () => show.value = !show.value;
</script>

<style lang="scss" scoped>
.collapse-header {
	cursor: pointer;
	display: flex;
	align-items: center;

	svg {
		fill: var(--font-color);

		&.rotated {
			transform: rotate(-90deg);
		}
	}
}
</style>