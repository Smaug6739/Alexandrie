<template>
  <div class="container">
    <AppHeader />
    <div class="body-container">
      <IconApp style="width: 120px" />
      <h1>Password Reset</h1>
      <form class="body" @submit.prevent="reset">
        <div class="form-group">
          <label for="password">Password</label>
          <div class="password-input">
            <input id="password" v-model="password" :type="showPassword ? 'text' : 'password'" :class="{ 'is-invalid': errors.password }" />
            <button type="button" class="password-toggle" @click="showPassword = !showPassword">{{ showPassword ? 'Hide' : 'Show' }}</button>
          </div>
          <p v-if="errors.password" class="invalid-feedback">{{ errors.password }}</p>
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <div class="password-input">
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              :class="{ 'is-invalid': errors.confirmPassword }"
            />
            <button type="button" class="password-toggle" @click="showConfirmPassword = !showConfirmPassword">
              {{ showConfirmPassword ? 'Hide' : 'Show' }}
            </button>
          </div>
          <p v-if="errors.confirmPassword" class="invalid-feedback">{{ errors.confirmPassword }}</p>
        </div>
        <button type="submit" class="btn">Change password</button>
        <p v-if="errors.general" class="invalid-feedback">{{ errors.general }}</p>
        <p class="sub"><NuxtLink to="/login">Return to login</NuxtLink></p>
      </form>
    </div>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../_components/AppHeader.vue';
import AppFooter from '../_components/AppFooter.vue';
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const errors = ref({
  password: '',
  confirmPassword: '',
  general: '',
});
const userStore = useUserStore();

async function reset() {
  if (!password.value) errors.value.password = 'Password is required';
  else if (password.value.length < 8) errors.value.password = 'Password must be at least 8 characters long';
  else errors.value.password = '';

  if (confirmPassword.value !== password.value) errors.value.confirmPassword = 'Passwords do not match';
  else errors.value.confirmPassword = '';

  if (errors.value.password || errors.value.confirmPassword) return;

  userStore
    .resetPassword((useRoute().query?.token as string) || '', confirmPassword.value)
    .then(() => {
      useRouter().push('/login');
      useNotifications().add({
        type: 'success',
        title: 'Password changed successfully. You can now log in with your new password.',
      });
    })
    .catch(err => (errors.value.general = err || 'An error occurred while resetting the password'));
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

.password-input {
  position: relative;
}

.password-toggle {
  position: absolute;
  top: 50%;
  right: 5px;
  padding: 0.2rem;
  border: none;
  font-size: 0.8rem;
  background-color: transparent;
  cursor: pointer;
  outline: none;
  transform: translateY(-50%);

  &:hover {
    text-decoration: underline;
  }
}

.form-group {
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-bottom: 1rem;
}

.btn {
  width: 100%;
  border-radius: 50px;
  font-size: 1.2rem;
  color: white;
  background-color: var(--primary);

  &:hover {
    background: var(--primary-dark);
    transform: none;
  }
}

input {
  background: var(--bg-contrast-2);
  outline: none;
}

.is-invalid {
  border-color: var(--red) !important;
}

.invalid-feedback {
  font-size: 0.8rem;
  color: var(--red);
}

.sub {
  font-size: 14px;
  text-align: center;

  a {
    text-decoration: underline;
  }

  a:hover {
    text-decoration: none;
  }
}
</style>
