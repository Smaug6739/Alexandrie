<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings';
import { storeToRefs } from 'pinia';
const theme = storeToRefs(useSettingsStore()).theme
</script>

<template>
	<div style="display:flex;align-items: center;column-gap: 0.5rem;">
		<img style="width:50px" :src="`/Alexandrie-${theme}.svg`" alt="Alexandrie">
		<p style="font-weight: 600;font-family: Poppins;">Alexandrie</p>
	</div>
</template>