<template>
  <section>
    <h2>{{ t('settings.security.password') }}</h2>
    <form @submit.prevent="changePassword">
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
const props = defineProps<{ userId: string }>();

const store = useAdminStore();

const { t } = useI18nT();
const notifications = useNotifications();

const passwordValue = ref('');
const passwordConfirmValue = ref('');
const errPasswordNotMatch = ref(false);

const changePassword = async () => {
  if (passwordValue.value !== passwordConfirmValue.value) return (errPasswordNotMatch.value = true);
  store
    .adminUpdatePassword(props.userId, passwordValue.value)
    .then(() => {
      passwordValue.value = '';
      passwordConfirmValue.value = '';
      errPasswordNotMatch.value = false;
      notifications.add({ type: 'success', title: t('settings.security.notifications.passwordChanged') });
    })
    .catch(e => notifications.add({ type: 'error', title: t('settings.security.notifications.passwordError'), message: e }));
};
</script>
<style lang="scss" scoped>
.err {
  padding: 0.1rem 0.5rem;
  font-size: 0.8rem;
  color: var(--red);
}
</style>
