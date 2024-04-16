<template>
	<header>
		<span>
			<svg v-if="hasSidebar" @click="toggleSidebar" class="open-sidebar" xmlns="http://www.w3.org/2000/svg" height="24"
				viewBox="0 -960 960 960" width="24">
				<path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
			</svg>
		</span>
		<ThemeToggle />
	</header>
</template>

<style lang="scss" scoped>
header {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: space-between;
	padding: 0 15px;
}

.open-sidebar {
	width: 30px;
	height: 30px;
	fill: var(--font-color);
	margin: 15px;
	cursor: pointer;
}

ul {
	list-style: none;
	padding: 0;
	display: flex;
	align-items: center;

	li {
		margin-right: 15px;
	}
}

// Mobile styles
@media screen and (max-width: 719px) {
	.no-mobile {
		display: none;
	}
}
</style>
<script lang="ts" setup>
const { toggleSidebar, hasSidebar } = useSidebar();
</script>