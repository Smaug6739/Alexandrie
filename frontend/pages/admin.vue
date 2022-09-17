<template>
	<div>
		<main class="view view-large">
			<admin-sidebar />
			<h1>Dashboard: Admin</h1>
			<NuxtPage />
		</main>
	</div>
</template>
<script lang="ts" setup>
import adminSidebar from '@/components/layout/admin-sidebar/Sidebar.vue';
</script>
