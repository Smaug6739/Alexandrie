<template>
	<div>
		<box-icon :name="name" :size="size"></box-icon>
	</div>
</template>

<script lang="ts" setup>

defineProps<{
	name: string
	size?: string
}>()

</script>

<style lang="scss" scoped>
div {
	width: 45px; // change this to the desired size
	height: 45px; // make sure this is equal to the width
	border-radius: 50%;
	display: flex; // to center the icon
	justify-content: center; // center horizontally
	align-items: center; // center vertically
}

div:hover {
	background-color: var(--bg-hover);
}
</style>