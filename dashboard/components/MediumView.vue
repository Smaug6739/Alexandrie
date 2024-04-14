<template>
	<main class="medium-view" ref="mediumContainer" :style="{ marginLeft }">
		<slot></slot>
	</main>
</template>

<script setup lang="ts">
const { isOpened, paneWidth } = useSidebar();
const mediumContainer = ref<HTMLElement | null>(null);
const isMobile = () => process.client ? window.innerWidth <= 768 : false;
const marginLeft = computed(() => (isMobile() || !isOpened.value) ? '0' : `${paneWidth.value}px`);
</script>

<style scoped>
.medium-view {
	padding: 0 2rem;
	width: 100%;
	height: 100%;
}

@media print {
	.medium-view {
		padding: 0 !important;
		margin: 0 !important;
	}
}
</style>