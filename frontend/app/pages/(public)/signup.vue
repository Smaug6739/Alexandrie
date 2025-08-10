<template>
  <div class="container">
    <AppHeader />
    <div class="body-container">
      <IconApp style="width: 120px" />
      <h1>Account creation</h1>
      <form @submit.prevent="register">
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" id="username" v-model="username" :class="{ 'is-invalid': errors.username }" />
          <p v-if="errors.username" class="invalid-feedback">{{ errors.username }}</p>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" :class="{ 'is-invalid': errors.email }" />
          <p v-if="errors.email" class="invalid-feedback">{{ errors.email }}</p>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <div class="password-input">
            <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password" :class="{ 'is-invalid': errors.password }" />
            <button type="button" class="password-toggle" @click="showPassword = !showPassword">{{ showPassword ? 'Hide' : 'Show' }}</button>
          </div>
          <p v-if="errors.password" class="invalid-feedback">{{ errors.password }}</p>
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <div class="password-input">
            <input :type="showConfirmPassword ? 'text' : 'password'" id="confirmPassword" v-model="confirmPassword" :class="{ 'is-invalid': errors.confirmPassword }" />
            <button type="button" class="password-toggle" @click="showConfirmPassword = !showConfirmPassword">{{ showConfirmPassword ? 'Hide' : 'Show' }}</button>
          </div>
          <p v-if="errors.confirmPassword" class="invalid-feedback">{{ errors.confirmPassword }}</p>
        </div>
        <NuxtLink to="/login" class="login-link">Already have an account? Log in</NuxtLink>
        <button type="submit" class="btn">Sign Up</button>
        <p v-if="errors.general" class="invalid-feedback">{{ errors.general }}</p>
      </form>
    </div>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from './_components/AppHeader.vue';
import AppFooter from './_components/AppFooter.vue';

const router = useRouter();
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const errors = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  general: '',
});
const userStore = useUserStore();

function register() {
  let valid = true;

  if (!username.value) {
    errors.value.username = 'Username is required';
    valid = false;
  } else {
    errors.value.username = '';
  }

  if (!email.value) {
    errors.value.email = 'Email is required';
    valid = false;
  } else {
    errors.value.email = '';
  }

  if (!password.value) {
    errors.value.password = 'Password is required';
    valid = false;
  } else {
    errors.value.password = '';
  }

  if (!confirmPassword.value) {
    errors.value.confirmPassword = 'Password confirmation is required';
    valid = false;
  } else if (password.value !== confirmPassword.value) {
    errors.value.confirmPassword = 'Passwords do not match';
    valid = false;
  } else {
    errors.value.confirmPassword = '';
  }

  if (valid) createAccount(username.value, email.value, password.value);
}

async function createAccount(username: string, email: string, password: string) {
  userStore
    .register({ username, email, password, role: 1 })
    .then(() => {
      router.push('/login');
    })
    .catch(error => {
      errors.value.general = error;
    });
}
</script>

<style scoped lang="scss">
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
.login-link {
  display: block;
  margin-bottom: 1rem;
  text-align: center;
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
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
