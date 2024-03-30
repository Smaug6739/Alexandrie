<template>
	<header>
		<span>
			<svg v-if="hasSidebar" @click="isOpened = !isOpened" class="open-sidebar" xmlns="http://www.w3.org/2000/svg"
				height="24" viewBox="0 -960 960 960" width="24">
				<path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
			</svg>
		</span>
		<ul>
			<li>
				<NuxtLink class="no-mobile" to="/">Home</NuxtLink>
			</li>
			<li class="no-mobile">
				<NuxtLink to="https://dashboard.alexandrie-hub.fr" target="_blank">Dashboard</NuxtLink>
			</li>
			<li style="padding-right:10px;">
				<ThemeToggle />
			</li>
		</ul>
	</header>
</template>

<style lang="scss" scoped>
header {
	width: 100%;
	height: 60px;
	display: flex;
	justify-content: space-between;
}

.open-sidebar {
	width: 30px;
	height: 30px;
	fill: var(--font-color);
	margin: 15px;
	cursor: pointer;
}


.dropdown-item {
	display: block;
	padding: 4px;
	font-size: calc(100% - 1px);
}

ul {
	list-style: none;
	padding: 0;
	display: flex;
	align-items: center;
}

// Mobile styles
@media screen and (max-width: 719px) {
	.no-mobile {
		display: none;
	}
}

// Desktop styles
@media screen and (min-width: 720px) {
	li {
		margin-right: 20px;
	}
}

@media print {
	nav {
		display: none;
	}
}
</style>
<script lang="ts" setup>
import { hasSidebar, isOpened } from "@/components/sidebar/helpers";

</script>