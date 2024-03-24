<script setup lang="ts">
import MarketingPage from './MarketingPage.vue'
import Navbar from './Navbar.vue'
</script>

<template>
	<div style="height:100%;display: flex; flex-direction: column;">
		<Navbar />
		<main style="height:100%;flex-grow: 1;padding-top:5rem;">
			<MarketingPage />
		</main>
	</div>
</template>