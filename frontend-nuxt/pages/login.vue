<template>
	<form>
		<fieldset>
			<legend>Connexion</legend>
			<input id="form-username" type="text" placeholder="Username" />
			<input id="form-password" type="password" placeholder="Password" />
			<button type="button" @click="connect" class="btn btn-pink">Connexion</button>
		</fieldset>
	</form>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "login",
	beforeMount() {
		if (document.cookie && document.cookie.includes("user_auth"))
			this.$router.push("/admin");
	},
	methods: {
		async connect() {
			const content = JSON.stringify({
				username: (document.getElementById("form-username") as HTMLInputElement).value,
				password: (document.getElementById("form-password") as HTMLInputElement).value,
			});
			const responce = await fetch(`${import.meta.env.VITE_BASE_API}/api/v1/auth`, {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: content,
				credentials: "include",
			});
			const result = await responce.json();
			if (result.status == "success" && result.result.auth) {
				this.$router.push("/admin");
			}
		},
	},
});
</script>