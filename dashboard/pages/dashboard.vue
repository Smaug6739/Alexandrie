<template>
	<div style="display: flex; width: 100%; height: 100%;">
		<Sidebar2 />
		<MediumView>
			<NuxtPage />

		</MediumView>
	</div>
</template>
<script setup lang="ts">
import Sidebar2 from '~/components/sidebar/Sidebar2.vue';

</script>