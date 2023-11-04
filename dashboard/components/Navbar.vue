<template>
	<nav>
		<svg v-if="hasSidebar" @click="isOpened = !isOpened" class="open-sidebar" xmlns="http://www.w3.org/2000/svg"
			height="24" viewBox="0 -960 960 960" width="24">
			<path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
		</svg>
		<p>Alexandrie</p>
	</nav>
</template>

<style lang="scss" scoped>
svg {
	width: 30px;
	height: 30px;
	cursor: pointer;
	fill: #fff;
	margin: 10px;
	position: absolute;
}

nav {
	display: flex;
	align-items: center;
	height: 50px;
	width: 100%;
	z-index: 2;

	p {
		padding: 0 10px;
		font-weight: 500;
		font-size: large;
		margin: auto;
	}
}

@media print {
	nav {
		display: none;
	}
}

@media screen and (min-width: 768px) {
	nav {
		position: absolute;
		width: min-content;

		p {
			display: none;
		}

		background-color: transparent;

	}
}
</style>
<script lang="ts" setup>
import { hasSidebar, isOpened } from "@/components/sidebar/helpers";
</script>
