<template>
	<main>
		<Sidebar />
		<NuxtPage />
	</main>
</template>
<script lang="ts" setup>
import Sidebar from "../../components/sidebar/Sidebar.vue";
</script>

<style scoped>
@media (min-width: 1700px) {
	main {
		padding-left: var(--padding);
		padding-right: var(--padding);
	}
}
</style>