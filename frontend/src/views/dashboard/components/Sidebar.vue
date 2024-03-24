<template>
	<nav :class="opened ? 'open' : ''">
		<div :class="['sidebar', isResizing ? 'no-select' : '']">
			<div :style="{ width: panewidthCSS }">

				<div class="sidebar-header">
					<h3>Dashboard</h3>
					<span @click="opened = !opened" class="icon">
						<AppIcon name="menu-alt-right" size="md" />

					</span>
				</div>
				<div class="sidebar-content">
					<ul>
						<li>Home</li>
						<li>Profile</li>
						<li>Settings</li>
					</ul>
				</div>
			</div>
			<div class="separator" @mousedown="startResize"></div>
		</div>
	</nav>
</template>

<script setup lang="ts">
import AppIcon from '@/components/AppIcon.vue'
import { computed, ref } from 'vue';
const isResizing = ref(false)
const startX = ref(0)
const startWidth = ref(0)
const paneWidth = ref(320)// initial width of pane 1
const panewidthCSS = computed(() => `${paneWidth.value}px`)
const opened = ref(true)

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
	position: absolute;
	transition: transform 0.3s;
	transform: translate(-100%);
	height: 100%;
}

.sidebar {
	background-color: var(--bg-color-secondary);
	overflow-x: hidden;
	height: 100%;
	display: flex;

}

.open {
	transform: translate(0);
}

.sidebar-header {
	display: flex;
	align-items: center;
	padding: 10px;
	justify-content: space-between;
	border-bottom: 1px solid var(--border-color);
}

.icon {
	cursor: pointer;
}

.separator {
	width: 5px;
	cursor: col-resize;
}

.sidebar {
	&:hover {
		.separator {
			background-color: var(--border-color);
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
