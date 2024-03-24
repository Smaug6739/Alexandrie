<template>
	<div style="display:flex;width: 100%;height: 100%;">
		<Sidebar />
		<main style="flex-grow:1">
			<header>TEST DU HEADER</header>
			<!-- Content for pane 2 -->
			Contenu de la page admin
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum libero assumenda molestiae quidem mollitia impedit
			porro reprehenderit molestias illo ipsam ut sit, quis distinctio expedita nobis fugit nulla nesciunt ratione!
		</main>

	</div>
</template>

<script setup lang="ts">

import Sidebar from './components/Sidebar.vue'
</script>

<style scoped lang="scss">
header {
	background-color: var(--bg-color-secondary);
	padding: 1rem;
}
</style>
