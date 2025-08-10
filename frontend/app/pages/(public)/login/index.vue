<template>
  <div class="container">
    <AppHeader />
    <div class="body-container">
      <IconApp style="width: 120px" />
      <h1>Connection</h1>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="username">Username</label>
          <input type="username" id="username" v-model="username" :class="{ 'is-invalid': errors.username }" />
          <p v-if="errors.username" class="invalid-feedback">{{ errors.username }}</p>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <div class="password-input">
            <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password" :class="{ 'is-invalid': errors.password }" />
            <button type="button" class="password-toggle" @click="showPassword = !showPassword">{{ showPassword ? 'Hide' : 'Show' }}</button>
          </div>
          <p v-if="errors.password" class="invalid-feedback">{{ errors.password }}</p>
        </div>
        <NuxtLink to="/signup" class="signup-link">Need an account? Sign up</NuxtLink>
        <button type="submit" class="btn">Login</button>
        <p v-if="errors.general" class="invalid-feedback">{{ errors.general }}</p>
        <p class="forgot-password-link">Forgot your password? <NuxtLink to="/login/request-reset">Click here</NuxtLink></p>
      </form>
    </div>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../_components/AppHeader.vue';
import AppFooter from '../_components/AppFooter.vue';
const username = ref('');
const errors = ref({
  username: '',
  password: '',
  general: '',
});
const showPassword = ref(false);
const password = ref('');
const userStore = useUserStore();

function login() {
  if (!username.value) errors.value.username = 'Username is required';
  else errors.value.username = '';

  if (!password.value) errors.value.password = 'Password is required';
  else errors.value.password = '';

  if (username.value && password.value) {
    connect(username.value, password.value);
  }
}

async function connect(username: string, password: string) {
  const result = await userStore.login(username, password);
  if (result == true) useRouter().push('/dashboard');
  else errors.value.general = String(result);
}
</script>
<style scoped lang="scss">
/* ===== Structure générale ===== */
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 95%;
  margin: 0 auto;
  padding-top: 1.5rem;
  height: 100%;
}

.body-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 600px;
  width: 100%;
  margin: 0 auto 10%;
}

h1 {
  font-size: 2.5em;
}

/* ===== Formulaire ===== */
form {
  width: 100%;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

input {
  width: 100%;
  padding: 0.6rem;
  border-radius: 8px;
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 1000px var(--border-color) inset !important;
  -webkit-text-fill-color: var(--text-color) !important;
  transition: background-color 5000s ease-in-out 0s;
  background: var(--border-color);
}

/* ===== Mot de passe ===== */
.password-input {
  position: relative;
}

.password-toggle {
  position: absolute;
  top: 50%;
  right: 5px;
  transform: translateY(-50%);
  font-size: 0.8rem;
  padding: 0.2rem;
  background: transparent;
  border: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

/* ===== Liens ===== */
.signup-link {
  display: block;
  margin-bottom: 1rem;
  text-align: center;
  color: var(--primary);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.forgot-password-link {
  text-align: center;
  font-size: 16px;
  font-weight: 500;

  a {
    text-decoration: underline;

    &:hover {
      text-decoration: none;
    }
  }
}

/* ===== Boutons ===== */
.btn {
  font-size: 1.2rem;
  border-radius: 50px;
  width: 100%;
  background-color: var(--primary);
  color: white;

  &:hover {
    background: $primary-dark;
  }
}

/* ===== États et messages ===== */
.is-invalid {
  border-color: $red !important;
}

.invalid-feedback {
  font-size: 0.8rem;
  color: $red;
  text-align: center;
  margin: 0;
}
</style>
