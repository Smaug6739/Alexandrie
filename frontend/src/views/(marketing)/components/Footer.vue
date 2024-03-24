<script setup lang="ts">
import Logo from './Logo.vue'
import Button from '@/components/Button.vue'
</script>
<template>
	<div
		style="display: flex; align-items: center; width: 100%; padding: 1.5rem; z-index: 50;justify-content: space-between;">
		<Logo />
		<div style="margin-left: auto; justify-content: space-between; align-items: center; gap: 0.5rem;">
			<Button type="ghost">Privacy Policy</Button>
			<Button type="ghost">Terms of Service</Button>
		</div>
	</div>
</template>
