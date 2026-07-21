<template>
  <section>
    <h3>{{ t('settings.security.password') }}</h3>
    <form @submit.prevent="changePassword">
      <div class="form-group">
        <label for="current_password">{{ t('settings.security.currentPassword') }}</label>
        <input id="current_password" v-model="currentPasswordValue" autocomplete="current-password" type="password" required />
      </div>
      <div class="form-group">
        <label for="password">{{ t('settings.security.newPassword') }}</label>
        <input id="password" v-model="passwordValue" autocomplete="new-password" type="password" required />
      </div>
      <div class="form-group">
        <span style="display: flex; align-items: center">
          <label for="password_confirm">{{ t('settings.security.confirmPassword') }}</label>
          <span v-if="errPasswordNotMatch" class="err"> {{ t('settings.security.passwordNotMatch') }}</span>
        </span>
        <input id="password_confirm" v-model="passwordConfirmValue" autocomplete="new-password" type="password" required />
      </div>
      <AppButton type="primary">{{ t('settings.security.changePassword') }}</AppButton>
    </form>
  </section>
</template>

<script setup lang="ts">
const userStore = useUserStore();

const { t } = useI18nT();
const notifications = useNotifications();

const passwordValue = ref('');
const currentPasswordValue = ref('');
const passwordConfirmValue = ref('');
const errPasswordNotMatch = ref(false);

const changePassword = async () => {
  if (!userStore.user) return;
  if (passwordValue.value !== passwordConfirmValue.value) return (errPasswordNotMatch.value = true);
  userStore
    .updatePassword(currentPasswordValue.value, passwordValue.value)
    .then(() => {
      currentPasswordValue.value = '';
      passwordValue.value = '';
      passwordConfirmValue.value = '';
      errPasswordNotMatch.value = false;
      notifications.add({ type: 'success', title: t('settings.security.notifications.passwordChanged') });
    })
    .catch(e => notifications.add({ type: 'error', title: t('settings.security.notifications.passwordError'), message: e.message }));
};
</script>
<style lang="scss" scoped>
h3 {
  margin-top: 2.5rem;
}

.err {
  padding: 0.1rem 0.5rem;
  font-size: 0.8rem;
  color: var(--red);
}
</style>
