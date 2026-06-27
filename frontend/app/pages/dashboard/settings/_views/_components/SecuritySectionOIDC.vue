<template>
  <section>
    <h3>{{ t('settings.security.connectedAccounts') }}</h3>
    <p class="section-description">{{ t('settings.security.connectedAccountsDesc') }}</p>
    <div class="accounts">
      <div v-if="isLoading" class="loading">
        <LoaderSpinner />
        <span>{{ t('settings.security.loadingAccounts') }}</span>
      </div>
      <template v-else>
        <div v-for="provider in availableProviders" :key="provider.name" class="account">
          <div class="account-info">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span class="icon" v-html="getProviderIcon(provider.name)"></span>
            <span class="name">{{ getProviderLabel(provider.name) }}</span>
          </div>
          <div class="account-actions">
            <template v-if="isLinked(provider.name)">
              <span class="status linked">{{ t('settings.security.connected') }}</span>
              <AppButton type="danger" size="sm" @click="unlinkAccount(provider.name)">{{ t('settings.security.unlink') }}</AppButton>
            </template>
            <template v-else>
              <span class="status">{{ t('settings.security.notConnected') }}</span>
              <AppButton type="secondary" size="sm" @click="linkAccount(provider.name)">{{ t('settings.security.link') }}</AppButton>
            </template>
          </div>
        </div>
        <p v-if="availableProviders.length === 0" class="no-providers">{{ t('settings.security.noProviders') }}</p>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { getProviderIcon, getProviderLabel } from '~/helpers/oidc-providers';

const userStore = useUserStore();

const { t } = useI18nT();
const notifications = useNotifications();
const { providers: availableProviders, isLoading, linkProvider, unlinkProvider, isProviderLinked } = useOIDC();

userStore.fetchSessions();

function isLinked(providerName: string): boolean {
  return isProviderLinked(providerName);
}

async function linkAccount(providerName: string) {
  try {
    await linkProvider(providerName);
  } catch (error) {
    notifications.add({ type: 'error', title: (error as Error).message || t('settings.security.notifications.linkError') });
  }
}

async function unlinkAccount(providerName: string) {
  try {
    await unlinkProvider(providerName);
    notifications.add({ type: 'success', title: t('settings.security.notifications.accountUnlinked', { provider: getProviderLabel(providerName) }) });
  } catch (error) {
    notifications.add({ type: 'error', title: (error as Error).message || t('settings.security.notifications.unlinkError') });
  }
}
</script>
<style lang="scss" scoped>
h3 {
  margin-top: 2.5rem;
}
.section-description {
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.accounts {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.loading {
  display: flex;
  padding: 1rem;
  color: var(--text-secondary);
  align-items: center;
  gap: 0.75rem;
}

.account {
  display: flex;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--bg-secondary);
  align-items: center;
  gap: 1rem;
  justify-content: space-between;
}

.account-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.icon {
  display: flex;
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
}

.name {
  font-weight: 500;
}

.account-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.status {
  font-size: 0.85rem;
  color: var(--text-secondary);

  &.linked {
    font-weight: 500;
    color: var(--green);
  }
}
</style>
