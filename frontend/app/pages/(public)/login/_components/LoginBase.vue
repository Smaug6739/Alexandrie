<template>
  <div class="ctn">
    <h1>{{ t('public.login.title') }}</h1>
    <form @submit.prevent="login">
      <div v-if="!hideLoginForm" class="form-group">
        <label for="username">{{ t('public.login.form.username') }}</label>
        <input id="username" v-model="username" type="username" :class="{ 'is-invalid': errors.username }" :disabled="loginDisabled" />
        <p v-if="errors.username" class="invalid-feedback">{{ errors.username }}</p>
      </div>
      <div v-if="!hideLoginForm" class="form-group">
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
      <button v-if="!hideLoginForm" class="btn" :disabled="loginDisabled">{{ t('public.login.form.submit') }}</button>
      <p v-if="loginDisabled" class="disabled">{{ t('public.login.disabled') }}</p>
      <OIDCProviders />

      <p class="forgot-password-link">
        {{ t('public.login.forgotPassword') }} <NuxtLinkLocale to="/login/request-reset">{{ t('public.login.clickHere') }}</NuxtLinkLocale>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18nT();

const username = ref('');
const password = ref('');

const emit = defineEmits<{ (e: 'login', payload: { username: string; password: string }): void }>();

const config = useRuntimeConfig();
const loginDisabled = config.public.configDisableNativeLogin;
const hideLoginForm = config.public.configHideLoginForm;

const errors = ref({ username: '', password: '', general: '' });
const { showPassword, togglePassword } = usePasswordField();

function login() {
  errors.value.username = !username.value ? 'Username is required' : '';
  errors.value.password = !password.value ? 'Password is required' : '';

  if (username.value && password.value) emit('login', { username: username.value, password: password.value });
}

watch([username, password], () => {
  errors.value.username = '';
  errors.value.password = '';
});
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
}
</style>
