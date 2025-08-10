<template>
  <div class="container">
    <AppHeader />
    <form @submit.prevent="reset" class="body">
      <h2>Password Reset</h2>
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
      <button type="submit" class="btn">Change password</button>
      <p v-if="errors.general" class="invalid-feedback">{{ errors.general }}</p>
      <p class="sub"><NuxtLink to="/login">Return to login</NuxtLink></p>
    </form>
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
  margin: 0 auto;
  width: 100%;
  max-width: 620px;
  padding: 3rem;
  background-color: var(--bg-contrast);
  border-radius: 15px;
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

.form-group {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 1rem;
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

.sub {
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
