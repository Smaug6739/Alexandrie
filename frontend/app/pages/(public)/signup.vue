<template>
  <div class="container">
    <AppHeader />
    <div class="body-container">
      <IconApp style="width: 120px" />
      <h1>Account creation</h1>
      <form @submit.prevent="register">
        <div class="form-group">
          <label for="username">Username</label>
          <input id="username" v-model="username" type="text" :class="{ 'is-invalid': errors.username }" />
          <p v-if="errors.username" class="invalid-feedback">{{ errors.username }}</p>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" v-model="email" type="email" :class="{ 'is-invalid': errors.email }" />
          <p v-if="errors.email" class="invalid-feedback">{{ errors.email }}</p>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <div class="password-input">
            <input
              id="password"
              :key="`password-${showPassword}`"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              :class="{ 'is-invalid': errors.password }"
            />
            <button type="button" class="password-toggle" @click="togglePassword">
              <div class="eye-icon" :class="{ show: showPassword }">
                <Icon v-if="showPassword" name="eye" />
                <Icon v-else name="eye_off" />
              </div>
            </button>
          </div>
          <p v-if="errors.password" class="invalid-feedback">{{ errors.password }}</p>
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <div class="password-input">
            <input
              id="confirmPassword"
              :key="`confirmPassword-${showConfirmPassword}`"
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              :class="{ 'is-invalid': errors.confirmPassword }"
            />
            <button type="button" class="password-toggle" @click="toggleConfirmPassword">
              <div class="eye-icon" :class="{ show: showConfirmPassword }">
                <Icon v-if="showConfirmPassword" name="eye" />
                <Icon v-else name="eye_off" />
              </div>
            </button>
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

function togglePassword() {
  showPassword.value = !showPassword.value;
}

function toggleConfirmPassword() {
  showConfirmPassword.value = !showConfirmPassword.value;
}

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
  width: 95%;
  height: 100%;
  margin: 0 auto;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 1.5rem;
}

.body-container {
  display: flex;
  width: 100%;
  max-width: 600px;
  margin: 0 auto 10%;
  align-items: center;
  flex-direction: column;
  justify-content: center;
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
  width: 100%;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 0.8rem;

  label {
    font-size: 0.95rem;
    font-weight: 600;
  }
}

input {
  width: 100%;
  padding: 0.6rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--bg-color);
  transition: all 0.2s ease;

  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgb(var(--primary-rgb), 0.1);
    outline: none;
  }
}

/* ===== Mot de passe ===== */
.password-input {
  position: relative;
}

.password-toggle {
  position: absolute;
  top: 50%;
  right: 8px;
  display: flex;
  padding: 8px;
  border: none;
  border-radius: 50%;
  background: transparent;
  transition: all 0.2s ease;
  align-items: center;
  cursor: pointer;
  justify-content: center;
  transform: translateY(-50%);

  &:hover {
    background: rgb(0 0 0 / 5%);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }
}

.eye-icon {
  display: flex;
  width: 20px;
  height: 20px;
  transition: all 0.3s ease;
  align-items: center;
  justify-content: center;

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
.login-link {
  display: block;
  margin: 1.5rem 0;
  font-weight: 500;
  color: var(--primary);
  text-align: center;
  transition: all 0.2s ease;
  text-decoration: none;

  &:hover {
    color: var(--primary-dark);
    text-decoration: underline;
  }
}

/* ===== Boutons ===== */
.btn {
  width: 100%;
  padding: 0.9rem;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  background-color: var(--primary);
  transition: all 0.2s ease;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    background: var(--primary-dark);
    box-shadow: 0 4px 12px rgb(var(--primary-rgb), 0.3);
    transform: translateY(-1px);
  }

  &:active {
    box-shadow: 0 2px 6px rgb(var(--primary-rgb), 0.3);
    transform: translateY(0);
  }
}

/* ===== États et messages ===== */
.is-invalid {
  border-color: var(--red) !important;
}

.invalid-feedback {
  margin: 0;
  font-size: 0.8rem;
  color: var(--red);
  text-align: center;
}
</style>
