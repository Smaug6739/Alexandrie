<template>
	<div class="container">
		<form @submit.prevent="login" class="body">
			<p class="signup-link">Need an account? <a href="mailto:rveauville@gmail.com">Sign up</a></p>
			<div class="form-group">
				<label for="username">Username</label>
				<input type="username" id="username" v-model="username" :class="{ 'is-invalid': errors.username }">
				<p v-if="errors.username" class="invalid-feedback">{{ errors.username }}</p>
			</div>
			<div class="form-group">
				<label for="password">Password</label>
				<div class="password-input">
					<input :type="showPassword ? 'text' : 'password'" id="password" v-model="password"
						:class="{ 'is-invalid': errors.password }">
					<button type="button" class="password-toggle" @click="showPassword = !showPassword">{{ showPassword ? 'Hide' :
						'Show' }}</button>
				</div>
				<p v-if="errors.password" class="invalid-feedback">{{ errors.password }}</p>
			</div>
			<button type="submit" class="btn">Login</button>
			<p v-if="errors.general" class="invalid-feedback">{{ errors.general }}</p>
			<p class="forgot-password-link">Forgot your password? <a href="mailto:rveauville@gmail.com">Click here</a></p>
		</form>
	</div>
</template>
<script setup lang="ts">
const router = useRouter()
const username = ref('')
const errors = ref({
	username: '',
	password: '',
	general: ''
})
const showPassword = ref(false)
const password = ref('')

function login() {
	if (!username.value) errors.value.username = 'Username is required'
	else errors.value.username = '';

	if (!password.value) errors.value.password = 'Password is required'
	else errors.value.password = '';

	if (username.value && password.value) {
		connect(username.value, password.value);
	}
}



async function connect(username: string, password: string) {
	const content = JSON.stringify({
		username: username,
		password: password
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
	if (result.status == "success" && result.result.auth) router.push("/dashboard");
	else errors.value.general = result.message;

}
</script>
<style scoped lang="scss">
.container {
	display: flex;
	flex-direction: column;
	align-items: center;
	height: 100%;
	justify-content: center;
}

.body {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	max-width: 620px;
	padding: 3rem;
	background-color: var(--bg-contrast);
	border-radius: 15px;
}

.form-group {
	display: flex;
	flex-direction: column;
	width: 100%;
	margin-bottom: 1rem;
}

.signup-link {
	font-size: 0.8rem;
	margin-top: -0.5rem;
	margin-bottom: 1rem;
	text-align: right;
	text-decoration: none;

	&:hover {
		text-decoration: underline;
	}
}


.password-input {
	position: relative;
}

.password-toggle {
	position: absolute;
	top: 50%;
	right: 0;
	transform: translateY(-50%);
	font-size: 0.8rem;
	padding: 0.2rem;
	background-color: transparent;
	border: none;
	cursor: pointer;
	outline: none;

	&:hover {
		text-decoration: underline;
	}

}

.btn {
	font-size: 1.2rem;
	border-radius: 50px;
	width: 100%;
	background-color: $primary-300;

	&:hover {
		background: $primary-500;
		transform: none;
	}
}

input {
	background: var(--bg-contrast-2);
	outline: none;
}

.is-invalid {
	border-color: $red !important;
}

.invalid-feedback {
	font-size: 0.8rem;
	color: $red;
}

.forgot-password-link {
	margin-top: 20px;
	text-align: center;
	font-size: 14px;

	a {
		text-decoration: underline;
	}

	a:hover {
		text-decoration: none;
	}
}
</style>