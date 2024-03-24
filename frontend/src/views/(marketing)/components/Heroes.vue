<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings';
import { storeToRefs } from 'pinia';
const theme = storeToRefs(useSettingsStore()).theme
</script>

<template>
	<div style="display: flex; align-items: center; justify-content: center; max-width: 80rem;">
		<div style="position: relative; width: 300px; height: 300px; display: none;">
			<img :src="`/documents-${theme}.png`" />
		</div>
		<div style="position: relative; width: 300px; height: 300px;">
			<img :src="`/reading-${theme}.png`" />
		</div>
	</div>
</template>

<style scoped lang="scss">
@media (min-width: 768px) {
	[style*="display: none"] {
		display: block !important;
	}
}

@media (min-width: 1024px) {
	[style*="width: 300px"] {
		width: 350px !important;
		height: 350px !important;
	}
}
</style>