<template>
	<form>
		<fieldset>
			<legend>Connexion</legend>
			<input ref="username" type="text" placeholder="Username" autocomplete="username" />
			<input ref="password" type="password" placeholder="Password" autocomplete="current-password" />
			<button type="button" @click="connect" class="btn btn-theme">Connexion</button>
		</fieldset>
	</form>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

if (process.client && document.cookie?.includes("user_auth")) {
	router.push({ name: "admin" });
}

const username = ref<HTMLInputElement>();
const password = ref<HTMLInputElement>();

async function connect() {
	const content = JSON.stringify({
		username: username.value?.value,
		password: password.value?.value,
	});
	const Response = await fetch(`${import.meta.env.VITE_BASE_API}/api/v1/auth`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: content,
		credentials: "include",
	});

	const result = await Response.json();
	if (result.status == "success" && result.result.auth) {
		router.push("/admin");
	}
}
</script>

<style scoped>
form {
	width: 70%;
	margin: 0 auto;
}

@media (max-width: 768px) {
	form {
		width: 95%;
	}
}
</style>