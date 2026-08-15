<template>
  <div class="body-container">
    <IconApp style="width: 120px" />

    <LoginBase v-if="step === 0" @login="connect" />

    <Login2FA v-else-if="step === 1" :pre-auth-token="pendingPreAuthToken" />

    <Login2FAEnable v-else-if="step === 2" :pre-auth-token="pendingPreAuthToken" @2fa-enabled="() => (step = 0)" />

    <tag v-if="error" red class="error">{{ error }}</tag>
  </div>
</template>

<script setup lang="ts">
import LoginBase from './_components/LoginBase.vue';
import Login2FA from './_components/Login2FA.vue';
import Login2FAEnable from './_components/Login2FAEnable.vue';

const userStore = useUserStore();
const router = useRouter();

const step = ref(0); // 0 = login, 1 = 2FA, 2 = enable 2FA

const pendingPreAuthToken = ref('');

definePageMeta({
  layout: 'public',
});

const route = useRoute();

const error = ref('');

// Check for OIDC error redirect
onMounted(() => {
  const errorParam = route.query.error as string | undefined;
  if (errorParam) {
    error.value = formatOIDCError(errorParam);
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

async function connect(payload: { username: string; password: string }) {
  error.value = '';
  const res = await userStore.login(payload.username, payload.password);
  if (!res.success) {
    error.value = (res.error as string) || 'Invalid credentials';
    return;
  }
  if (res.require2FA) {
    pendingPreAuthToken.value = res.preAuthToken!;
    step.value = 1;
  } else if (res.require2FAEnable) {
    step.value = 2;
    pendingPreAuthToken.value = res.preAuthToken!;
  } else {
    router.push('/dashboard');
  }
}

watch(step, () => (error.value = ''));
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

.error {
  text-align: center;
  margin-top: 0.4rem;
  font-size: 0.8rem;
  padding: 0.5rem;
  width: 100%;
}
</style>
