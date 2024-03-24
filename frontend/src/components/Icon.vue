<template>
	<i :class="name" v-html="svg"></i>
</template>

<script lang="ts" setup>
defineProps<{ name?: string; big?: boolean, svg?: string }>();

</script>

<style lang="scss" scoped>
i {
	width: 50px;
	height: 50px;
	display: flex;
	justify-content: center; // Centrage horizontal
	align-items: center; // Centrage vertical

	&:deep(svg) {
		fill: $primary-400;
		width: 20px;
		height: 20px;

		path {
			fill: $primary-400;
		}
	}
}
</style>