<template>
	<div>
		<admin-sidebar />
		<main class="view view-source">
			<h1>Dashboard: Admin</h1>
			<router-view></router-view>
		</main>
	</div>

</template>
<script lang="ts">
import adminSidebar from '../../components/layout/admin-sidebar/Sidebar.vue';
import { defineComponent } from 'vue';
export default defineComponent({
	name: 'admin-dashboard',
	components: {
		adminSidebar,
	},
});
</script>