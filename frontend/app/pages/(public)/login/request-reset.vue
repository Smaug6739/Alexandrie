<template>
  <div class="container">
    <AppHeader />
    <div class="body-container">
      <IconApp style="width: 120px" />
      <h1>Reset password</h1>
      <form @submit.prevent="reset">
        <div class="form-group">
          <label for="username">Username</label>
          <input id="username" v-model="username" type="username" :class="{ 'is-invalid': errors.username }" />
          <p v-if="errors.username" class="invalid-feedback">{{ errors.username }}</p>
        </div>
        <button type="submit" class="btn">Request Reset</button>
        <p v-if="errors.general" class="invalid-feedback">{{ errors.general }}</p>
        <p class="issue">Having issue ? <NuxtLink to="mailto:contact@alexandrie-hub.fr">Contact us !</NuxtLink></p>
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
  general: '',
});
const userStore = useUserStore();

async function reset() {
  if (!username.value) errors.value.username = 'Username is required';
  else errors.value.username = '';
  userStore
    .requestReset(username.value)
    .then(() => useRouter().push('/login/done'))
    .catch(err => (errors.value.general = err || 'An error occurred while requesting reset'));
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
  margin-bottom: 1rem;
}

.btn {
  width: 100%;
  border-radius: 50px;
  font-size: 1.2rem;
  color: white;
  background-color: var(--primary);

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
  font-size: 15px;
  color: $red;
  text-align: center;
  margin-top: 0.5rem;
}

.issue {
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
