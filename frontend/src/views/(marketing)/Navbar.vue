<script setup lang="ts">
import Logo from "./components/Logo.vue"
import ThemeToggle from "@/components/ThemeToggle.vue"
</script>

<template>
	<div
		style="background-color: var(--bg-background); position: fixed; top: 0; display: flex; align-items: center; width: 100%; padding: 1.5rem;">
		<Logo />
		<div
			style="margin-left: auto; justify-content: space-between; display: flex; align-items: center; column-gap: 0.5rem;">
			<ThemeToggle />
		</div>
	</div>
</template>