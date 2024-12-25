<template>
  <section :class="`header-${$colorMode.value}`">
    <div class="logo-header" style="display: flex; align-items: center; column-gap: 0.5rem">
      <img style="width: 50px" :src="`/Alexandrie-${$colorMode.value}.svg`" alt="Alexandrie" />
      <NuxtLink to="/" style="font-weight: 600">Alexandrie</NuxtLink>
    </div>
    <div class="theme-toggle-wrapper">
      <ThemeToggle class="theme-toggle" />
    </div>
  </section>

  <div :class="`container-${$colorMode.value}`">
    <form @submit.prevent="register" :class="`form-body-${$colorMode.value}`">
      <div :class="`form-group-${$colorMode.value}`">
        <label for="username">Username</label>
        <input type="text" id="username" v-model="username" :class="{ 'is-invalid': errors.username }" placeholder="Enter your username" />
        <p v-if="errors.username" class="invalid-feedback">{{ errors.username }}</p>
      </div>

      <div :class="`form-group-${$colorMode.value}`">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" :class="{ 'is-invalid': errors.email }" placeholder="Enter your email" />
        <p v-if="errors.email" class="invalid-feedback">{{ errors.email }}</p>
      </div>

      <div :class="`form-group-${$colorMode.value}`">
        <label for="password">Password</label>
        <div class="password-input">
          <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password" :class="{ 'is-invalid': errors.password }" placeholder="Enter your password" />
          <button type="button" class="password-toggle" @click="showPassword = !showPassword">{{ showPassword ? 'Hide' : 'Show' }}</button>
        </div>
        <p v-if="errors.password" class="invalid-feedback">{{ errors.password }}</p>
      </div>

      <div :class="`form-group-${$colorMode.value}`">
        <label for="confirmPassword">Confirm Password</label>
        <div class="password-input">
          <input :type="showConfirmPassword ? 'text' : 'password'" id="confirmPassword" v-model="confirmPassword" :class="{ 'is-invalid': errors.confirmPassword }" placeholder="Confirm your password" />
          <button type="button" class="password-toggle" @click="showConfirmPassword = !showConfirmPassword">{{ showConfirmPassword ? 'Hide' : 'Show' }}</button>
        </div>
        <p v-if="errors.confirmPassword" class="invalid-feedback">{{ errors.confirmPassword }}</p>
      </div>

      <button type="submit" class="btn">Sign Up</button>
      <p v-if="errors.general" class="invalid-feedback">{{ errors.general }}</p>
      <NuxtLink to="/login" class="signup-link">Already have an account? Log in</NuxtLink>
    </form>
  </div>

  <AppFooter :class="`footer-${$colorMode.value}`" />
</template>

<script setup lang="ts">
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

  if (valid) {
    createAccount(username.value, email.value, password.value);
  }
}

async function createAccount(username: string, email: string, password: string) {
  try {
    await userStore.register({ username, email, password });
    useRouter().push('/login');
  } catch (error) {
    errors.value.general = error.message || 'An error occurred';
  }
}
</script>

<style scoped lang="scss">
.container-light {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 2rem;
  background-color: #f7f8fa;
  width: 100%;
}

.container-dark {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 2rem;
  background-color: rgba(37, 42, 52, 1);
  width: 100%;
}

.header-light {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 1rem 2rem;
  top: 0;
  backdrop-filter: blur(10px);
  background: #f7f8fa;
}

.header-dark {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 1rem 2rem;
  top: 0;
  backdrop-filter: blur(10px);
  background: rgba(37, 42, 52, 1);
}
.logo-header {
  padding: 1.5rem 2rem;
  display: flex;
}

.logo-img {
  width: 120px;
  height: auto;
}

.theme-toggle-wrapper {
  display: flex;
  align-items: center;
  margin-left: auto; /* Place le toggle à droite */
}

.theme-toggle {
  margin-left: 0; /* Pas de marge supplémentaire */
}

.form-body-light {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 480px;
  padding: 2.5rem;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.form-body-dark {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 480px;
  padding: 2.5rem;
  background-color: rgba(37, 42, 52, 1);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgb(255, 255, 255);
}

.form-group-light {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 1.5rem;
}

.form-group-dark {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 1.5rem;
}

.form-group-dark label {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: #ffffff;
}

label {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.form-group-dark input {
  padding: 1rem;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  background-color: #ececec;
  margin-bottom: 0.5rem;
  transition: border 0.3s ease, box-shadow 0.3s ease;

  &::placeholder {
    color: #4d4d4d;
  }

  &:focus {
    border-color: #292929;
    box-shadow: 0 0 8px rgb(255, 255, 255);
  }

  &.is-invalid {
    border-color: #e74c3c;
    background-color: #f8d7da;
  }
}

input {
  padding: 1rem;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  margin-bottom: 0.5rem;
  transition: border 0.3s ease, box-shadow 0.3s ease;

  &::placeholder {
    color: #aaa;
  }

  &:focus {
    border-color: #3498db;
    box-shadow: 0 0 8px rgba(52, 152, 219, 0.2);
  }

  &.is-invalid {
    border-color: #e74c3c;
    background-color: #f8d7da;
  }
}

.password-input {
  position: relative;
}

.password-toggle {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  font-size: 0.9rem;
  color: #3498db;
  background: none;
  border: none;
  cursor: pointer;
  outline: none;
  transition: color 0.3s ease;

  &:hover {
    color: #2980b9;
  }
}

.signup-link {
  font-size: 0.9rem;
  margin-top: -0.5rem;
  text-align: right;
  color: #3498db;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #2980b9;
  }
}

.btn {
  padding: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 50px;
  width: 100%;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
}

.invalid-feedback {
  font-size: 0.85rem;
  color: #e74c3c;
}

.signup-link {
  margin-top: 10px;
}

.forgot-password-link {
  margin-top: 5px;
  text-align: center;
  font-size: 14px;

  a {
    text-decoration: underline;
    color: #3498db;
    transition: color 0.3s ease;
  }

  a:hover {
    color: #2980b9;
  }
}

.footer-dark {
  background: rgba(37, 42, 52, 1);
}

.footer-light {
  background: #f7f8fa;
}
</style>