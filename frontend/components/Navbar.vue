<template>
	<header>
		<div class="container">
			<button v-if="!isOpened" @click="toggleSidebar" class="open-sidebar">
				<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
					<path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
				</svg>
			</button>
			<DHeader v-if="!isMobile()" />
		</div>
		<ThemeToggle />
	</header>
</template>

<style lang="scss" scoped>
header {
	height: 50px;
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: 1px solid var(--border-color);
	margin-bottom: 15px;
}

.container {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 10px 0;
}

svg {
	fill: var(--font-color);
	height: 25px;
	width: 25px;
}

button {
	padding: 0;
	margin: 0
}

// Mobile styles
@media screen and (max-width: 719px) {
	.no-mobile {
		display: none;
	}
}
</style>
<script lang="ts" setup>
const { toggleSidebar, isOpened } = useSidebar();
</script>