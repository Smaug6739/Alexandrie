<template>
  <div class="container">
    <AppHeader />
    <form @submit.prevent="register" class="body">
      <h2>Account Creation</h2>
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
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
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
h2 {
  margin-top: 0;
  padding-top: 0;
}
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  padding-top: 1.5rem;
  width: 95%;
  margin: 0 auto;
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
  margin: 0 auto;
}

.form-group {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 1rem;
}

.login-link {
  font-size: 0.8rem;
  margin-top: -0.5rem;
  margin-bottom: 1rem;
  text-align: right;
  text-decoration: none;
  color: $primary-color;
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
  background-color: $primary-light;
  color: white;

  &:hover {
    background: $primary-dark;
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
</style>
