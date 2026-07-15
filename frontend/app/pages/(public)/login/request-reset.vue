<template>
  <div class="body-container">
    <IconApp style="width: 120px" />
    <h1>{{ t('public.login.reset.title') }}</h1>
    <form @submit.prevent="reset">
      <div class="form-group">
        <label for="username">{{ t('public.login.form.username') }}</label>
        <input id="username" v-model="username" type="username" :class="{ 'is-invalid': errors.username }" />
        <p v-if="errors.username" class="invalid-feedback">{{ errors.username }}</p>
      </div>
      <button type="submit" class="btn">{{ t('public.login.reset.submit') }}</button>
      <p v-if="errors.general" class="invalid-feedback">{{ errors.general }}</p>
      <p class="issue">
        {{ t('public.login.reset.havingIssues') }}
        <NuxtLinkLocale to="mailto:contact@alexandrie-hub.fr">{{ t('public.login.reset.contactUs') }}</NuxtLinkLocale>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'public',
});

const { t } = useI18nT();
const router = useRouter();
const localeRoute = useLocaleRoute();

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
    .then(() => router.push(localeRoute('/login/done')))
    .catch(err => (errors.value.general = err || 'An error occurred while requesting reset'));
}
</script>
<style scoped lang="scss">
.body-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 600px;
  margin: 0 auto 10%;
}

h1 {
  font-size: 2.5em;
}

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
  background: var(--surface-overlay);
  outline: none;
}

.is-invalid {
  border-color: var(--red) !important;
}

.invalid-feedback {
  margin-top: 0.5rem;
  font-size: 15px;
  color: var(--red);
  text-align: center;
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
