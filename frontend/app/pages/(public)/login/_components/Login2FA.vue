<template>
  <div class="ctn">
    <h1>{{ t('public.login.OTP_2FA.title') }}</h1>
    <p class="section-description">{{ t('public.login.OTP_2FA.description') }}</p>
    <form @submit.prevent="handleVerify2FA">
      <div class="form-group">
        <label for="totpCode">{{ t('public.login.OTP_2FA.code') }}</label>
        <input
          id="totpCode"
          v-model="totpCode"
          type="text"
          placeholder="000000 or 8-digit backup code"
          maxlength="8"
          pattern="[0-9]*"
          inputmode="numeric"
          autocomplete="one-time-code"
        />
      </div>
      <tag v-if="error" red class="error">{{ error }}</tag>
      <button class="btn" type="submit">{{ t('public.login.OTP_2FA.submit') }}</button>
    </form>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  preAuthToken: string;
}>();

const userStore = useUserStore();

const router = useRouter();
const { t } = useI18nT();

const totpCode = ref('');

const error = ref('');

async function handleVerify2FA() {
  const res = await userStore.verify2FA(props.preAuthToken, totpCode.value);
  if (res.success) router.push('/dashboard');
  else error.value = (res.error as string) || 'Invalid 2FA code';
}
</script>

<style scoped lang="scss">
h1 {
  font-size: 2.5em;
}

.ctn {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.btn {
  width: 100%;
  margin-top: 1rem;
  padding: 0.9rem;
  border: none;
  border-radius: var(--radius-lg);
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  background-color: var(--primary);
  cursor: pointer;
  transition:
    background-color $transition-fast ease,
    transform $transition-fast ease;

  &:hover {
    background: var(--primary-dark);
    transform: translateY(-1px);
  }
}

form {
  width: 100%;
}

.error {
  text-align: center;
  margin-top: 0.4rem;
  font-size: 0.8rem;
  padding: 0.5rem;
}
</style>
