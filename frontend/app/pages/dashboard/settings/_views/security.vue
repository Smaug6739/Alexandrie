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
    <h2>Danger</h2>
    <div>
      You can log out from all devices or log out from this device. <br />
      Be careful, if you log out from all devices, you will be redirected to the login page. Please save your work before.
    </div>
    <div class="actions-row">
      <AppButton type="danger" @click="logout">Log out</AppButton>
      <AppButton type="danger" @click="logoutAll">Log out from all devices</AppButton>
    </div>
    <h3>Delete account</h3>
    <div>
      You can delete your account. <br />
      Be careful, if you delete your account, you will lose all your data and you will not be able to recover it.
      <br />
      <strong>By deleting your account you will remove:</strong>
      <ul>
        <li>All your files and folders</li>
        <li>All your uploads</li>
        <li>All your shares</li>
        <li>All your account data (preferences, profile...)</li>
      </ul>
      <p>
        You can <NuxtLink to="/dashboard/settings?p=backup" style="color: var(--primary); text-decoration: underline">export your data</NuxtLink> before
        deleting your account.
      </p>
    </div>
    <div class="actions-row">
      <AppButton type="danger" @click="openDeleteModal">Delete account</AppButton>
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
  if (oidcEnabled.value) {
    await fetchLinkedProviders();
  }
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
  color: var(--font-color-light);
  font-style: italic;
  padding: 1rem;
  text-align: center;
  background: var(--bg-contrast);
  border-radius: 10px;
}

p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.warning-box {
  display: flex;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: 10px;
  background: var(--yellow-bg);
  border: 1px solid var(--yellow-border);
  margin-bottom: 1.5rem;

  svg {
    width: 24px;
    height: 24px;
    color: var(--yellow);
    flex-shrink: 0;
    margin-top: 0.15rem;
  }

  strong {
    color: var(--yellow-dark);
    display: block;
    margin-bottom: 0.25rem;
  }

  p {
    margin: 0;
    font-size: 0.85rem;
    color: var(--font-color);
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
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  color: var(--text-secondary);
}

.oidc-account {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: var(--bg-secondary);
  gap: 1rem;
}

.oidc-account-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.oidc-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;

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
    color: var(--green);
    font-weight: 500;
  }
}

.actions-row {
  margin: 0.7rem 0;
}
</style>
