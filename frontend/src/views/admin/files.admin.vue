<template>
	<div>
		<h1>Dashboard: Files manager</h1>
		<admin-sidebar />
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