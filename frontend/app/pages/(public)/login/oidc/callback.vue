<template>
  <div class="body-container">
    <IconApp style="width: 120px" />

    <!-- Loading state -->
    <div v-if="isProcessing" class="status-container">
      <LoaderSpinner />
      <h1>{{ t('public.login.oidc.title') }}</h1>
      <p>{{ t('public.login.oidc.description') }}</p>
    </div>

    <!-- Success state -->
    <div v-else-if="isSuccess" class="status-container success">
      <h1>{{ isLinkFlow ? t('public.login.oidc.linked') : t('public.login.oidc.signIn') }}</h1>
      <p v-if="isLinkFlow">{{ t('public.login.oidc.linked') }}</p>
      <p v-else-if="isNewLink">{{ t('public.login.oidc.created') }}</p>
      <p v-else>{{ t('public.login.oidc.signIn') }}</p>
      <p class="redirect-notice">{{ isLinkFlow ? t('public.login.oidc.redirectSettings') : t('public.login.oidc.redirectDashboard') }}</p>
    </div>

    <!-- Error state -->
    <div v-else-if="errorMessage" class="status-container error">
      <h1>{{ t('public.login.oidc.error') }}</h1>
      <p class="error-message">{{ formatError(errorMessage) }}</p>
      <div class="actions-row">
        <NuxtLinkLocale to="/login"
          ><AppButton large type="primary">{{ t('public.login.oidc.tryAgain') }}</AppButton>
        </NuxtLinkLocale>
        <NuxtLinkLocale to="/signup">
          <AppButton large type="secondary">{{ t('public.login.oidc.createAccount') }}</AppButton>
        </NuxtLinkLocale>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'public',
});

const router = useRouter();
const { handleCallback } = useOIDC();
const { t } = useI18nT();

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
h1 {
  font-size: 2em;
}

.body-container {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.status-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

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
  margin-top: 1rem !important;
  opacity: 0.8;
}

.actions-row {
  margin-top: 1.5rem;
}
</style>
