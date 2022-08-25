<template>
	<form>
		<fieldset>
			<legend>Connexion</legend>
			<input id="form-username" type="text" placeholder="Username" />
			<input id="form-password" type="text" placeholder="Password" />
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
			const responce = await fetch(`http://localhost:8082/api/v1/auth`, {
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

<style scoped lang="scss">
form {
	padding: 10px;
	width: 80%;
	margin: auto;
	margin-top: 10%;
}

fieldset {
	padding: 10px;
}

legend {
	float: left;
	text-align: left;
	width: 100%;
	padding: 0;
	margin-bottom: 0.5rem;
	font-size: calc(1.275rem + 0.3vw);
	line-height: inherit;
}

input {
	display: block;
	margin: auto;
	margin-top: 10px;
	padding: 3px;
	width: 100%;
	font-size: 1rem;
	font-weight: 400;
	line-height: 1.5;
	color: var(--font-color);
	background-color: var(--bg-color-1);
	background-clip: padding-box;
	border: 1px solid #ced4da;
	border-radius: 0.25rem;
}



button {
	margin-top: 10px;
}

element.style {}
</style>