<template>
  <div>
    <h2 class="app-title">Security</h2>
    <p class="app-subtitle">Manage your security settings and monitor your account activity.</p>
    <h3>Active sessions</h3>
    <p class="section-description">These are the devices that are currently logged into your account.</p>
    <div class="sessions-list">
      <SessionCard v-for="(session, index) in store.sessions" :key="session.id" :session="session" :is-current="index === 0" :show-user-agent="true" />
    </div>
    <p v-if="store.sessions.length === 0" class="no-sessions">No active sessions found.</p>
    <div v-if="hasUnrecognizedSession" class="warning-box">
      <Icon name="warning" display="sm" />
      <div>
        <strong>Don't recognize a session?</strong>
        <p>If you see a session you don't recognize, change your password immediately and click "Log out from all devices" below.</p>
      </div>
    </div>

    <!-- OIDC Linked Accounts -->
    <template v-if="oidcEnabled">
      <h3>Connected accounts</h3>
      <p class="section-description">Link external accounts for easier sign-in.</p>
      <div class="oidc-accounts">
        <div v-if="loadingOIDC" class="oidc-loading">
          <LoaderSpinner :size="24" />
          <span>Loading connected accounts...</span>
        </div>
        <template v-else>
          <div v-for="provider in availableProviders" :key="provider.name" class="oidc-account">
            <div class="oidc-account-info">
              <!-- eslint-disable-next-line vue/no-v-html -->
              <span class="oidc-icon" v-html="getProviderIcon(provider.name)"></span>
              <span class="oidc-name">{{ getProviderLabel(provider.name) }}</span>
            </div>
            <div class="oidc-account-actions">
              <template v-if="isLinked(provider.name)">
                <span class="oidc-status linked">Connected</span>
                <AppButton type="danger" size="sm" @click="unlinkAccount(provider.name)">Unlink</AppButton>
              </template>
              <template v-else>
                <span class="oidc-status">Not connected</span>
                <AppButton type="secondary" size="sm" @click="linkAccount(provider.name)">Link</AppButton>
              </template>
            </div>
          </div>
          <p v-if="availableProviders.length === 0" class="no-providers">No SSO providers are configured for this application.</p>
        </template>
      </div>
    </template>

    <h3>Password</h3>
    <form @submit.prevent="changePassword">
      <div class="form-group">
        <label for="password">New password</label>
        <input id="password" v-model="passwordValue" type="password" required />
      </div>
      <div class="form-group">
        <span style="display: flex; align-items: center"
          ><label for="password_confirm">Confirm password</label> <span v-if="errPasswordNotMatch" class="err"> Password do not match !</span></span
        >
        <input id="password_confirm" v-model="passwordConfirmValue" type="password" required />
      </div>
      <AppButton type="primary">Change password</AppButton>
    </form>
    <h2>Danger zone</h2>
    <p class="app-subtitle">Irreversible actions. Please proceed with caution.</p>

    <div class="danger-section">
      <div class="danger-card">
        <div class="danger-card-content">
          <div class="danger-card-icon">
            <Icon name="logout" display="sm" />
          </div>
          <div class="danger-card-info">
            <h4>Log out</h4>
            <p>End your current session on this device. You will need to sign in again to access your account.</p>
          </div>
        </div>
        <AppButton type="secondary" @click="logout">Log out</AppButton>
      </div>

      <div class="danger-card">
        <div class="danger-card-content">
          <div class="danger-card-icon warning">
            <Icon name="devices" display="sm" />
          </div>
          <div class="danger-card-info">
            <h4>Log out from all devices</h4>
            <p>End all active sessions across all devices. You will be redirected to the login page. Make sure to save your work first.</p>
          </div>
        </div>
        <AppButton type="danger" @click="logoutAll">Log out from all devices</AppButton>
      </div>

      <div class="danger-card destructive">
        <div class="danger-card-content">
          <div class="danger-card-icon destructive">
            <Icon name="delete" display="sm" />
          </div>
          <div class="danger-card-info">
            <h4>Delete account</h4>
            <p>Permanently delete your account and all associated data. This action cannot be undone.</p>
            <details class="delete-details">
              <summary>What will be deleted?</summary>
              <ul>
                <li>All your files and folders</li>
                <li>All your uploads</li>
                <li>All your shares</li>
                <li>All your account data (preferences, profile...)</li>
              </ul>
              <p class="backup-hint"><NuxtLink to="/dashboard/settings?p=backup">Export your data</NuxtLink> before deleting your account.</p>
            </details>
          </div>
        </div>
        <AppButton type="danger" @click="openDeleteModal">Delete account</AppButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getProviderIcon, getProviderLabel } from '~/helpers/oidc-providers';
import DeleteAccountModal from '../_modals/DeleteAccountModal.vue';

const emit = defineEmits(['close']);

const store = useUserStore();
store.fetchSessions();

const {
  providers: availableProviders,
  isEnabled: oidcEnabled,
  fetchProviders,
  fetchLinkedProviders,
  linkProvider,
  unlinkProvider,
  isProviderLinked,
} = useOIDC();

const loadingOIDC = ref(true);

// Check if there might be unrecognized sessions (sessions other than current)
const hasUnrecognizedSession = computed(() => {
  return store.sessions.length > 1;
});

function isLinked(providerName: string): boolean {
  return isProviderLinked(providerName);
}

async function linkAccount(providerName: string) {
  try {
    await linkProvider(providerName);
  } catch (error) {
    useNotifications().add({ type: 'error', title: (error as Error).message || 'Failed to initiate account linking' });
  }
}

async function unlinkAccount(providerName: string) {
  try {
    await unlinkProvider(providerName);
    useNotifications().add({ type: 'success', title: `${getProviderLabel(providerName)} account unlinked` });
  } catch (error) {
    useNotifications().add({ type: 'error', title: (error as Error).message || 'Failed to unlink account' });
  }
}

// Load OIDC data on mount
onMounted(async () => {
  await fetchProviders();
  if (oidcEnabled.value) await fetchLinkedProviders();
  loadingOIDC.value = false;
});

const passwordValue = ref('');
const passwordConfirmValue = ref('');
const errPasswordNotMatch = ref(false);

const changePassword = async () => {
  if (!store.user) return;
  if (passwordValue.value !== passwordConfirmValue.value) return (errPasswordNotMatch.value = true);
  store
    .updatePassword(passwordValue.value)
    .then(() => {
      passwordValue.value = '';
      passwordConfirmValue.value = '';
      errPasswordNotMatch.value = false;
      useNotifications().add({ type: 'success', title: 'Password changed successfully' });
    })
    .catch(e => useNotifications().add({ type: 'error', title: 'Error during password saving', message: e.message }));
};

const logout = () => {
  logoutUser();
  emit('close');
};
const logoutAll = () => {
  logoutUserAll();
  emit('close');
};

const openDeleteModal = () => useModal().add(new Modal(shallowRef(DeleteAccountModal)));
</script>

<style scoped lang="scss">
.sessions-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.no-sessions {
  padding: 1rem;
  border-radius: var(--radius-lg);
  color: var(--text-secondary);
  text-align: center;
  background: var(--surface-raised);
  font-style: italic;
}

p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.warning-box {
  display: flex;
  padding: 1rem 1.25rem;
  border: 1px solid var(--yellow-border);
  border-radius: var(--radius-lg);
  background: var(--yellow-bg);
  gap: 1rem;
  margin-bottom: 1.5rem;

  svg {
    width: 24px;
    height: 24px;
    color: var(--yellow);
    flex-shrink: 0;
    margin-top: 0.15rem;
  }

  strong {
    display: block;
    color: var(--yellow-dark);
    margin-bottom: 0.25rem;
  }

  p {
    margin: 0;
    font-size: 0.85rem;
    color: var(--text-body);
  }
}

.err {
  padding: 0.1rem 0.5rem;
  font-size: 0.8rem;
  color: var(--red);
}

/* OIDC Accounts Section */
.section-description {
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.oidc-accounts {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.oidc-loading {
  display: flex;
  padding: 1rem;
  color: var(--text-secondary);
  align-items: center;
  gap: 0.75rem;
}

.oidc-account {
  display: flex;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--bg-secondary);
  align-items: center;
  gap: 1rem;
  justify-content: space-between;
}

.oidc-account-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.oidc-icon {
  display: flex;
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;

  :deep(svg) {
    width: 100%;
    height: 100%;
  }
}

.oidc-name {
  font-weight: 500;
}

.oidc-account-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.oidc-status {
  font-size: 0.85rem;
  color: var(--text-secondary);

  &.linked {
    font-weight: 500;
    color: var(--green);
  }
}

/* Danger Section */
.danger-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
}

.danger-card {
  display: flex;
  padding: 1rem 1.25rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface-base);
  transition: all 0.2s ease;
  align-items: center;
  gap: 1rem;
  justify-content: space-between;

  &:hover {
    border-color: var(--border-strong);
  }

  &.destructive {
    border-color: var(--red-border);
    background: var(--red-bg-light);

    &:hover {
      border-color: var(--red);
    }
  }
}

.danger-card-content {
  display: flex;
  min-width: 0;
  align-items: flex-start;
  flex: 1;
  gap: 1rem;
}

.danger-card-icon {
  display: flex;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-lg);
  color: var(--text-body);
  background: var(--surface-overlay);
  align-items: center;
  flex-shrink: 0;
  justify-content: center;

  &.warning {
    color: var(--yellow-dark);
    background: var(--yellow-bg);
  }

  &.destructive {
    color: var(--red);
    background: var(--red-bg);
  }
}

.danger-card-info {
  min-width: 0;
  flex: 1;

  h4 {
    margin: 0 0 0.25rem;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  > p {
    margin: 0;
    font-size: 0.85rem;
    line-height: 1.4;
    color: var(--text-secondary);
  }
}

.delete-details {
  margin-top: 0.75rem;

  summary {
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--red-dark);
    cursor: pointer;
    user-select: none;

    &:hover {
      text-decoration: underline;
    }
  }

  ul {
    margin: 0.5rem 0;
    font-size: 0.8rem;
    color: var(--text-secondary);
    padding-left: 1.25rem;

    li {
      margin: 0.2rem 0;
    }
  }

  .backup-hint {
    font-size: 0.8rem;
    color: var(--text-secondary);

    a {
      font-weight: 500;
      color: var(--primary);
      text-decoration: underline;
    }
  }
}

@media (width <= 600px) {
  .danger-card {
    align-items: stretch;
    flex-direction: column;

    button {
      width: 100%;
      justify-content: center;
    }
  }
}
</style>
