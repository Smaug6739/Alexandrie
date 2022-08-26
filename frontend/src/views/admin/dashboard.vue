<template>
	<div>
		<admin-sidebar />
		<main class="view view-large">
			<h1>Dashboard: Admin</h1>
			<router-view></router-view>
			<div class="bottom">
				<div class="btn btn-pink" @click="logout">Logout</div>
			</div>
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
	methods: {
		logout() {
			fetch(`http://192.168.0.25:8082/api/v1/auth/disconnection`, {
				method: "GET",
				credentials: "include",
			}).then(() => {
				this.$router.push("/login")
			});
		}
	}
});
</script>
<style lang="scss" scoped>
.bottom {
	margin-top: 25px;
}
</style>