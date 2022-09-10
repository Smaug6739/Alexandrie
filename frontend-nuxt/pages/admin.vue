<template>
	<div>
		<admin-sidebar />
		<main class="view view-large">
			<h1>Dashboard: Admin</h1>
			<NuxtPage />
		</main>
	</div>

</template>
<script lang="ts">
import adminSidebar from '../components/layout/admin-sidebar/Sidebar.vue';
import { defineComponent } from 'vue';
export default defineComponent({
	name: 'admin-dashboard',
	components: {
		adminSidebar,
	},
	setup() {
		definePageMeta({
			middleware: ["auth"]
		})
	},
});
</script>
<style lang="scss" scoped>

</style>