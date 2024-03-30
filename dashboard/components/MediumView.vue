<template>
	<main class="medium-view" ref="mediumContainer">
		<slot></slot>
	</main>
</template>

<script setup lang="ts">
import { isOpened, paneWidth } from './sidebar/helpers';

const mediumContainer = ref<HTMLElement | null>(null);
const isMobile = () => process.client ? window.innerWidth <= 768 : false;
if (!isMobile()) {
	watch([isOpened, paneWidth], ([newIsOpened, newPaneWidth], [oldIsOpened, oldPaneWidth]) => {

		if (mediumContainer.value) {
			if (newIsOpened !== oldIsOpened) {
				mediumContainer.value.style.transition = 'margin-left 0.3s';
				mediumContainer.value.style.marginLeft = newIsOpened ? `${newPaneWidth}px` : '0';
			} else if (newPaneWidth !== oldPaneWidth) {
				mediumContainer.value.style.transition = 'none';
				mediumContainer.value.style.marginLeft = `${newPaneWidth}px`;
			}
		}
	});
}
</script>

<style scoped>
.medium-view {
	width: 100%;
	height: 100%;
}
</style>