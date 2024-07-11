<template>
	<div class="container">
		<form @submit.prevent="login" class="form-body">
			<div class="form-group">
				<label for="username">Username</label>
				<input type="text" id="username" v-model="username" :class="{ 'is-invalid': errors.username }">
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
			<p class="signup-link">Need an account? <a>Sign up</a></p>
			<button type="submit" class="btn">Login</button>
			<p v-if="errors.general" class="invalid-feedback">{{ errors.general }}</p>
		</form>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const errors = ref({
	username: '',
	password: '',
	general: ''
});
const showPassword = ref(false);

const router = useRouter();

function login() {
	errors.value.username = !username.value.trim() ? 'Username is required' : '';
	errors.value.password = !password.value.trim() ? 'Password is required' : '';
	if (username.value && password.value) {
		connect(username.value, password.value);
	}
}

async function connect(username: string, password: string) {
	try {
		console.log("Fetching...");
		console.log(`${import.meta.env.VITE_BASE_API}/api/v1/auth`)
		const response = await fetch(`${import.meta.env.VITE_BASE_API}/api/v1/auth`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify({ username, password }),
			credentials: 'include'
		});

		const result = await response.json();

		if (result.status === 'success' && result.result.auth) {
			logIn();
			router.push('/dashboard');
		} else {
			errors.value.general = result.message || 'Login failed';
		}
	} catch (error) {
		errors.value.general = 'Failed to connect';
	}
}


</script>

<style scoped>
.container {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	min-height: 100vh;
	background-color: #f0f0f0;
}

.header {
	font-size: 2rem;
	margin-bottom: 1rem;
	text-align: center;
	text-transform: uppercase;
	font-weight: bold;
	letter-spacing: 0.1em;
}

.form-body {
	width: 100%;
	max-width: 400px;
	padding: 2rem;
	background-color: #ffffff;
	border-radius: 8px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
	margin-bottom: 1rem;
}

.signup-link {
	font-size: 0.8rem;
	text-align: right;
	margin-bottom: 1rem;
	color: #666666;
	text-align: center;
}

.signup-link a {
	color: #007bff;
	text-decoration: none;
}

.signup-link a:hover {
	text-decoration: underline;
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
}

.btn {
	font-size: 1rem;
	width: 100%;
	padding: 0.75rem 0;
	color: #ffffff;
	background-color: #007bff;
	border: none;
	border-radius: 5px;
	cursor: pointer;
	transition: background-color 0.3s ease;
}

.btn:hover {
	background-color: #0056b3;
}

.is-invalid {
	border-color: #dc3545 !important;
}

.invalid-feedback {
	font-size: 0.8rem;
	color: #dc3545;
	margin-top: 0.25rem;
}
</style>
