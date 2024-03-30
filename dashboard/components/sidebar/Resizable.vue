<template>

	<nav :class="{ open: isOpened }">
		<div :class="['sidebar', isResizing ? 'no-select' : '']">
			<div :style="{ width: panewidthCSS }">
				<slot></slot>

			</div>
			<div class="separator" @mousedown="startResize"></div>
		</div>
	</nav>
</template>

<script setup lang="ts">
import { isOpened, paneWidth } from "./helpers";

const isResizing = ref(false)
const startX = ref(0)
const startWidth = ref(0)
const panewidthCSS = computed(() => `${paneWidth.value}px`)

// Open and close sidebar from parent component
function startResize(event: MouseEvent) {
	if (event.button !== 0 || event.buttons > 1) return; // only main (left) mouse button is allowed
	isResizing.value = true;
	startX.value = event.pageX;
	startWidth.value = paneWidth.value;

	document.addEventListener('mousemove', resize);
	document.addEventListener('mouseup', stopResize);
}
function resize(event: MouseEvent) {
	if (event.buttons === 0 || !isResizing.value) return stopResize();
	const deltaX = event.pageX - startX.value;
	let newWidth = startWidth.value + deltaX;
	//if (newWidth < minWidth) newWidth = minWidth;
	//else if (newWidth > maxWidth) newWidth = maxWidth;
	paneWidth.value = newWidth;
}
function stopResize() {
	isResizing.value = false;
	document.removeEventListener('mousemove', resize);
	document.removeEventListener('mouseup', stopResize);
}




</script>

<style scoped lang="scss">
nav {
	position: fixed;
	top: 0;
	left: 0;
	transition: transform 0.3s;
	transform: translate(-100%);
	height: 100%;
	z-index: 100;
}

.sidebar {
	background-color: var(--bg-contrast);
	overflow-x: hidden;
	height: 100%;
	display: flex;

}

.open {
	transform: translate(0);
}

.separator {
	width: 5px;
	cursor: col-resize;
}

.sidebar {
	&:hover {
		.separator {
			background-color: var(--bg-contrast-2);
		}
	}
}

/* Disable text selection while resizing */
/* Selection can cause problems with selection */
/* PREVENT SELECTION DURING MOUSE EVENTS */
.no-select {
	user-select: none;
	-moz-user-select: none;
	-webkit-user-select: none;
	-ms-user-select: none;
}
</style>