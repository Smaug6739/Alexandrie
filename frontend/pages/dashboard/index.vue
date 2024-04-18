<template>
	<div style="width: 300px; height: 300px;margin:25vh auto;">
		<img :src="`/empty-${colorMode.value}.png`" />
	</div>
</template>

<script setup lang="ts">
const colorMode = useColorMode();
</script>
