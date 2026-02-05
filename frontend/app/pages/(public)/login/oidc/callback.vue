<template>
  <div class="container">
    <AppHeader />
    <div class="body-container">
      <IconApp style="width: 120px" />

      <!-- Loading state -->
      <div v-if="isProcessing" class="status-container">
        <LoaderSpinner />
        <h1>Authenticating...</h1>
        <p>Please wait while we complete your sign-in.</p>
      </div>

      <!-- Success state -->
      <div v-else-if="isSuccess" class="status-container success">
        <h1>{{ isLinkFlow ? 'Provider Linked!' : 'Welcome!' }}</h1>
        <p v-if="isLinkFlow">Your {{ providerName }} account has been linked successfully.</p>
        <p v-else-if="isNewLink">Your account has been created and linked successfully.</p>
        <p v-else>You have been signed in successfully.</p>
        <p class="redirect-notice">{{ isLinkFlow ? 'Redirecting to settings...' : 'Redirecting to dashboard...' }}</p>
      </div>

      <!-- Error state -->
      <div v-else-if="errorMessage" class="status-container error">
        <h1>Authentication Failed</h1>
        <p class="error-message">{{ formatError(errorMessage) }}</p>
        <div class="actions-row">
          <NuxtLink to="/login"><AppButton large type="primary">Try Again</AppButton></NuxtLink>
          <NuxtLink to="/signup"><AppButton large type="secondary">Create Account</AppButton></NuxtLink>
        </div>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../../_components/AppHeader.vue';
import AppFooter from '../../_components/AppFooter.vue';

const router = useRouter();
const { handleCallback } = useOIDC();

const isProcessing = ref(true);
const isSuccess = ref(false);
const isNewLink = ref(false);
const isLinkFlow = ref(false);
const providerName = ref('');
const errorMessage = ref<string | null>(null);

// Error message formatting
function formatError(error: string): string {
  const errorMessages: Record<string, string> = {
    'Invalid state - possible CSRF attack': 'Invalid or expired session. Please try again.',
    'No authorization code received': 'No authorization code received. Please try again.',
    'No state parameter received': 'Invalid callback. Please try again.',
    access_denied: 'Access was denied. Please try again or use a different account.',
    'OIDC provider did not return email - cannot auto-link': 'Your account does not have an email address. Please use a different login method.',
  };

  // Check for partial matches
  for (const [key, value] of Object.entries(errorMessages)) {
    if (error.includes(key)) {
      return value;
    }
  }
  return error;
}
onMounted(async () => {
  try {
    // Handle the OIDC callback - exchange code for session
    const result = await handleCallback();

    isProcessing.value = false;
    isSuccess.value = true;
    providerName.value = result.provider;

    // Login flow
    isNewLink.value = result.is_new || false;
    setTimeout(() => router.push('/dashboard'), 1500);
  } catch (e) {
    isProcessing.value = false;
    errorMessage.value = e instanceof Error ? e.message : String(e);
  }
});
</script>

<style scoped lang="scss">
.container {
  display: flex;
  width: 95%;
  margin: 0 auto;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 1.2rem;
}

h1 {
  font-size: 2em;
}

.body-container {
  display: flex;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  align-items: center;
  flex: 1;
  flex-direction: column;
  justify-content: center;
}

.status-container {
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;

  p {
    margin: 0.25rem 0;
    font-size: 1rem;
  }
}

.error-message {
  max-width: 400px;
  font-weight: 500;
  color: var(--red) !important;
}

.redirect-notice {
  opacity: 0.8;
  margin-top: 1rem !important;
}

.actions-row {
  margin-top: 1.5rem;
}
</style>
