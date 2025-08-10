<template>
  <div class="container">
    <AppHeader />
    <div class="body-container">
      <IconApp style="width: 120px" />
      <h1>Reset password</h1>
      <form @submit.prevent="reset">
        <div class="form-group">
          <label for="username">Username</label>
          <input type="username" id="username" v-model="username" :class="{ 'is-invalid': errors.username }" />
          <p v-if="errors.username" class="invalid-feedback">{{ errors.username }}</p>
        </div>
        <button type="submit" class="btn">Request Reset</button>
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
  await userStore.requestReset(username.value);
  useRouter().push('/login/done');
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
  width: 100%;
  margin-bottom: 1rem;
}

.btn {
  font-size: 1.2rem;
  border-radius: 50px;
  width: 100%;
  background-color: var(--primary);
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

.issue {
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
