<template>
  <div class="container">
    <AppHeader />
    <div class="body-container">
      <IconApp style="width: 120px" />
      <h1>Connection</h1>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="username">Username</label>
          <input id="username" v-model="username" type="username" :class="{ 'is-invalid': errors.username }" >
          <p v-if="errors.username" class="invalid-feedback">{{ errors.username }}</p>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <div class="password-input">
            <input id="password" :key="`password-${showPassword}`" v-model="password" :type="showPassword ? 'text' : 'password'" :class="{ 'is-invalid': errors.password }" >
            <button type="button" class="password-toggle" @click="togglePassword">
              <div class="eye-icon" :class="{ show: showPassword }">
                <Icon v-if="showPassword" name="eye" />
                <Icon v-else name="eye_off" />
              </div>
            </button>
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

function togglePassword() {
  showPassword.value = !showPassword.value;
}

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
  margin-bottom: 0.8rem;

  label {
    font-weight: 600;
    color: var(--text-color);
    font-size: 0.95rem;
  }
}

input {
  width: 100%;
  padding: 0.6rem;
}

input,
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 1000px var(--border-color) inset !important;
  -webkit-text-fill-color: var(--text-color) !important;
  background: var(--border-color);
}

/* ===== Mot de passe ===== */
.password-input {
  position: relative;
}

.password-toggle {
  position: absolute;
  top: 50%;
  right: 8px;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }
}

.eye-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &.show {
    transform: scale(1.1);
  }

  svg {
    width: 18px;
    height: 18px;
    transition: all 0.3s ease;
  }
}

/* ===== Liens ===== */
.signup-link {
  display: block;
  margin-bottom: 1rem;
  text-align: center;
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    color: $primary-dark;
    text-decoration: underline;
  }
}

.forgot-password-link {
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  margin-top: 1rem;
  color: var(--text-muted);

  a {
    color: var(--primary);
    text-decoration: none;
    font-weight: 600;
    transition: all 0.2s ease;

    &:hover {
      color: $primary-dark;
      text-decoration: underline;
    }
  }
}

/* ===== Boutons ===== */
.btn {
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 12px;
  width: 100%;
  background-color: var(--primary);
  color: white;
  border: none;
  padding: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1rem;

  &:hover {
    background: $primary-dark;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
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
