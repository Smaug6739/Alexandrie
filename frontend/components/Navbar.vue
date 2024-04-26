<template>
	<header>
		<div class="container">
			<button v-if="!isOpened" @click="toggleSidebar" class="open-sidebar">
				<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
					<path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
				</svg>
			</button>
			<!--<button @click="previous" class="no-mobile">
				<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
					<path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" />
				</svg>
			</button>
			<button @click="next" class="no-mobile">
				<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
					<path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" />
				</svg>
			</button>-->
		</div>
		<ThemeToggle />
	</header>
</template>

<style lang="scss" scoped>
header {
	height: 60px;
	width: 100%;
	display: flex;
	justify-content: space-between;
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
	padding: 5px 0;
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
//const router = useRouter();
//const next = () => router.go(1);
//const previous = () => router.go(-1);
</script>