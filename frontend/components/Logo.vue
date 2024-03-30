<script setup lang="ts">
const colorMode = useColorMode()
</script>

<template>
	<div style="display:flex;align-items: center;column-gap: 0.5rem;">
		<img style="width:50px" :src="`/Alexandrie-${colorMode.value}.svg`" alt="Alexandrie">
		<p style="font-weight: 600;font-family: Poppins;">Alexandrie</p>
	</div>
</template>