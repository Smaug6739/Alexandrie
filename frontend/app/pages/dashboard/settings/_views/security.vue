<template>
  <div>
    <h2 class="page-title">{{ t('settings.security.title') }}</h2>
    <p class="page-subtitle">{{ t('settings.security.subtitle') }}</p>

    <!-- Sessions -->
    <SecuritySectionSessions />

    <!-- Two-Factor Authentication (2FA) -->
    <SecuritySection2FA @close="emit('close')" />

    <!-- OIDC Linked Accounts -->
    <SecuritySectionOIDC v-if="oidcEnabled" @close="emit('close')" />

    <!-- Password Change -->
    <SecuritySectionPassword @close="emit('close')" />

    <!-- Danger Zone -->
    <SecuritySectionDanger @close="emit('close')" />
  </div>
</template>

<script setup lang="ts">
import SecuritySectionSessions from './_components/SecuritySectionSessions.vue';
import SecuritySection2FA from './_components/SecuritySection2FA.vue';
import SecuritySectionOIDC from './_components/SecuritySectionOIDC.vue';
import SecuritySectionPassword from './_components/SecuritySectionPassword.vue';
import SecuritySectionDanger from './_components/SecuritySectionDanger.vue';

const emit = defineEmits(['close']);

const userStore = useUserStore();

const { t } = useI18nT();

userStore.fetchSessions();

// Load OIDC data on mount
const { isEnabled: oidcEnabled, fetchProviders, fetchLinkedProviders } = useOIDC();

onMounted(async () => {
  await fetchProviders();
  if (oidcEnabled.value) await fetchLinkedProviders();
});
</script>
