<template>
  <div class="body-container">
    <IconApp style="width: 120px" />

    <template v-if="!step2FA">
      <h1>{{ t('public.login.title') }}</h1>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="username">{{ t('public.login.form.username') }}</label>
          <input id="username" v-model="username" type="username" :class="{ 'is-invalid': errors.username }" :disabled="loginDisabled" />
          <p v-if="errors.username" class="invalid-feedback">{{ errors.username }}</p>
        </div>
        <div class="form-group">
          <label for="password">{{ t('public.login.form.password') }}</label>
          <div class="password-input">
            <input
              id="password"
              :key="`password-${showPassword}`"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              :class="{ 'is-invalid': errors.password }"
              :disabled="loginDisabled"
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
        <NuxtLinkLocale to="/signup" class="signup-link">{{ t('public.login.needAccount') }}</NuxtLinkLocale>
        <button class="btn" :disabled="loginDisabled">{{ t('public.login.form.submit') }}</button>
        <p v-if="loginDisabled" class="disabled">{{ t('public.login.disabled') }}</p>
        <OIDCProviders />

        <p v-if="errors.general" class="invalid-feedback general">{{ errors.general }}</p>
        <p class="forgot-password-link">
          {{ t('public.login.forgotPassword') }} <NuxtLinkLocale to="/login/request-reset">{{ t('public.login.clickHere') }}</NuxtLinkLocale>
        </p>
      </form>
    </template>

    <template v-else>
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
            :disabled="loginDisabled"
          />
        </div>
        <p v-if="errors.general" class="invalid-feedback">{{ errors.general }}</p>
        <button class="btn" :disabled="loginDisabled" type="submit">{{ t('public.login.OTP_2FA.submit') }}</button>
        <button class="btn-secondary" type="button" @click="step2FA = false">{{ t('public.login.OTP_2FA.back') }}</button>
      </form>
    </template>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore();
const router = useRouter();
const { t } = useI18nT();

const username = ref('');
const password = ref('');
const totpCode = ref('');

const step2FA = ref(false);
const pendingPreAuthToken = ref('');

definePageMeta({
  layout: 'public',
});

const route = useRoute();
const config = useRuntimeConfig();
const loginDisabled = config.public.configDisableNativeLogin;

const errors = ref({ username: '', password: '', general: '' });
const { showPassword, togglePassword } = usePasswordField();

// Check for OIDC error redirect
onMounted(() => {
  const errorParam = route.query.error as string | undefined;
  if (errorParam) {
    errors.value.general = formatOIDCError(errorParam);
  }
});

function formatOIDCError(error: string): string {
  const errorMessages: Record<string, string> = {
    invalid_state: 'Invalid or expired session. Please try again.',
    expired_state: 'Your session has expired. Please try again.',
    exchange_failed: 'Authentication failed. Please try again.',
    token_failed: 'Session creation failed. Please try again.',
    access_denied: 'Access denied.',
    user_not_found: 'No account associated with this email.',
    email_not_verified: 'Email is not verified.',
    email_conflict: 'An account already exists with this email.',
    provider_error: 'Authentication provider error.',
  };
  return errorMessages[error] || `Error: ${error}`;
}

function login() {
  errors.value.username = !username.value ? 'Username is required' : '';
  errors.value.password = !password.value ? 'Password is required' : '';

  if (username.value && password.value) {
    connect();
  }
}

watch([username, password, totpCode], () => {
  errors.value.general = '';
  errors.value.username = '';
  errors.value.password = '';
});

async function connect() {
  const res = await userStore.login(username.value, password.value);
  if (res.success) {
    if (res.require2FA) {
      pendingPreAuthToken.value = res.preAuthToken!;
      step2FA.value = true;
    } else {
      router.push('/dashboard');
    }
  } else {
    errors.value.general = (res.error as string) || 'Invalid credentials';
  }
}

async function handleVerify2FA() {
  const res = await userStore.verify2FA(pendingPreAuthToken.value, totpCode.value);
  if (res.success) {
    router.push('/dashboard');
  } else {
    errors.value.general = (res.error as string) || 'Invalid 2FA code';
  }
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
  margin: 0 auto;
}

h1 {
  font-size: 2.5em;
}

/* ===== Form ===== */
form {
  width: 100%;
}

.form-group {
  margin-bottom: 0.8rem;
}

input {
  padding: 0.6rem;

  &:disabled {
    background: var(--surface-transparent);
    cursor: not-allowed;
  }
}

/* ===== Password ===== */
.password-input {
  position: relative;
}

.password-toggle {
  position: absolute;
  top: 50%;
  right: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  border: none;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  transition:
    background-color $transition-fast ease,
    transform $transition-fast ease;
  transform: translateY(-50%);

  &:hover {
    background: var(--surface-transparent);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }
}

.disabled {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-muted);
  text-align: center;
}

.eye-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  transition: transform $transition-medium ease;

  &.show {
    transform: scale(1.1);
  }
}

/* ===== Links ===== */
.signup-link {
  display: block;
  margin-bottom: 1rem;
  font-weight: 500;
  color: var(--primary);
  text-align: center;
  text-decoration: none;
  transition: color $transition-fast ease;

  &:hover {
    color: var(--primary-dark);
    text-decoration: underline;
  }
}

.forgot-password-link {
  margin-top: 1rem;
  font-size: 16px;
  font-weight: 500;
  text-align: center;

  a {
    font-weight: 600;
    color: var(--primary);
    transition: color $transition-fast ease;

    &:hover {
      color: var(--primary-dark);
      text-decoration: underline;
    }
  }
}

/* ===== Buttons ===== */
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

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    cursor: not-allowed;
    transform: none;
  }
}

/* ===== States and messages ===== */
.is-invalid {
  border-color: var(--red) !important;
}

.invalid-feedback {
  margin: 0;
  font-size: 0.8rem;
  color: var(--red);
  text-align: center;

  &.general {
    margin-top: 1rem;
    font-size: 0.9rem;
  }
}
</style>
