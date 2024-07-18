<template>
	<div style="display: flex; width: 100%; height: 100%;">
		<Sidebar />
		<MediumView>
			<Navbar />
			<NuxtPage />
		</MediumView>
	</div>
</template>
<script setup lang="ts">
import Sidebar from '~/components/sidebar/Sidebar.vue';
definePageMeta({ breadcrumb: 'Home' });
</script>