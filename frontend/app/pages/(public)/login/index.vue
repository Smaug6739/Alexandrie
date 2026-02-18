<template>
  <div class="container">
    <AppHeader />
    <div class="body-container">
      <IconApp style="width: 120px" />
      <h1>Connection</h1>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="username">Username</label>
          <input id="username" v-model="username" type="username" :class="{ 'is-invalid': errors.username }" :disabled="loginDisabled" />
          <p v-if="errors.username" class="invalid-feedback">{{ errors.username }}</p>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
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
        <NuxtLink to="/signup" class="signup-link">Need an account? Sign up</NuxtLink>
        <button class="btn" :disabled="loginDisabled" @click="login">Login</button>
        <p v-if="loginDisabled" class="disabled">Native login is currently disabled. Please use one of the available authentication providers below.</p>
        <OIDCProviders />

        <p v-if="errors.general" class="invalid-feedback general">{{ errors.general }}</p>
        <p class="forgot-password-link">Forgot your password? <NuxtLink to="/login/request-reset">Click here</NuxtLink></p>
      </form>
    </div>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../_components/AppHeader.vue';
import AppFooter from '../_components/AppFooter.vue';

const userStore = useUserStore();

const router = useRouter();
const route = useRoute();
const config = useRuntimeConfig();

const username = ref('');
const password = ref('');
const errors = ref({ username: '', password: '', general: '' });
const { showPassword, togglePassword } = usePasswordField();

const loginDisabled = config.public.configDisableNativeLogin;

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
    connect(username.value, password.value);
  }
}

watch([username, password], () => {
  errors.value.general = '';
  errors.value.username = '';
  errors.value.password = '';
});

async function connect(username: string, password: string) {
  const result = await userStore.login(username, password);
  if (result === true) router.push('/dashboard');
  else errors.value.general = String(result);
}
</script>
<style scoped lang="scss">
.container {
  display: flex;
  width: 95%;
  margin: 0 auto;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 1.5rem;
}

.body-container {
  display: flex;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

h1 {
  font-size: 2.5em;
}

/* ===== Form ===== */
form {
  width: 100%;
}

.form-group {
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 0.8rem;

  label {
    font-size: 0.95rem;
    font-weight: 600;
  }
}

input {
  width: 100%;
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
  padding: 8px;
  border: none;
  border-radius: 50%;
  background: transparent;
  transition:
    background-color $transition-fast ease,
    transform $transition-fast ease;
  align-items: center;
  cursor: pointer;
  justify-content: center;
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
  width: 20px;
  height: 20px;
  transition: transform $transition-medium ease;
  align-items: center;
  justify-content: center;

  &.show {
    transform: scale(1.1);
  }
}

/* ===== Links ===== */
.signup-link {
  display: block;
  font-weight: 500;
  color: var(--primary);
  text-align: center;
  transition: color $transition-fast ease;
  margin-bottom: 1rem;
  text-decoration: none;

  &:hover {
    color: var(--primary-dark);
    text-decoration: underline;
  }
}

.forgot-password-link {
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  margin-top: 1rem;

  a {
    font-weight: 600;
    color: var(--primary);
    transition: color $transition-fast ease;
    text-decoration: none;

    &:hover {
      color: var(--primary-dark);
      text-decoration: underline;
    }
  }
}

/* ===== Buttons ===== */
.btn {
  width: 100%;
  padding: 0.9rem;
  border: none;
  border-radius: var(--radius-lg);
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  background-color: var(--primary);
  transition:
    background-color $transition-fast ease,
    transform $transition-fast ease;
  cursor: pointer;
  margin-top: 1rem;

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
