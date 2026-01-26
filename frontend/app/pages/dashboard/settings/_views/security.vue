<template>
  <div>
    <h2 class="app-title">Security</h2>
    <p class="app-subtitle">Manage your security settings and monitor your account activity.</p>
    <h3>Last connection</h3>
    <div v-if="store.last_connection" class="last-connection">
      <div style="display: flex">
        <img src="/svg/computer.svg" alt="Device icon" />
        <div>
          <p><strong>Last connection:</strong> {{ numericDate(store.last_connection.timestamp) }}</p>
          <p><strong>IP:</strong> {{ store.last_connection.ip_adress }} ({{ store.last_connection.location }})</p>
          <p><strong>Browser:</strong> {{ parseUserAgent(store.last_connection.user_agent).browser }}</p>
          <p><strong>OS:</strong> {{ parseUserAgent(store.last_connection.user_agent).os }}</p>
        </div>
      </div>
      <p>{{ store.last_connection.user_agent }}</p>
    </div>
    <p class="warning">If you don't recognize this connection, please change your password and click on "Log out from all devices".</p>

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
    <h3>Danger</h3>
    <div>
      You can log out from all devices or log out from this device. <br />
      Be careful, if you log out from all devices, you will be redirected to the login page. Please save your work before.
    </div>
    <div class="actions-row">
      <AppButton type="danger" @click="logout">Log out</AppButton>
      <AppButton type="danger" @click="logoutAll">Log out from all devices</AppButton>
    </div>
    <h2>Delete account</h2>
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
    <AppButton type="danger" @click="openDeleteModal">Delete account</AppButton>
  </div>
</template>

<script setup lang="ts">
import DeleteAccountModal from '../_modals/DeleteAccountModal.vue';
import { parseUserAgent } from '~/helpers/utils';

const emit = defineEmits(['close']);

const store = useUserStore();
const {
  providers: availableProviders,
  isEnabled: oidcEnabled,
  fetchProviders,
  fetchLinkedProviders,
  linkProvider,
  unlinkProvider,
  isProviderLinked,
} = useOIDC();

const { numericDate } = useDateFormatters();

const loadingOIDC = ref(true);

// OIDC provider icons (same as in OIDCProviders component)
const providerIcons: Record<string, { icon: string; label: string }> = {
  google: {
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>`,
    label: 'Google',
  },
  discord: {
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" fill="#5865F2"/></svg>`,
    label: 'Discord',
  },
  github: {
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`,
    label: 'GitHub',
  },
  microsoft: {
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M0 0h11.377v11.372H0zm12.623 0H24v11.372H12.623zM0 12.623h11.377V24H0zm12.623 0H24V24H12.623" fill="#00a4ef"/></svg>`,
    label: 'Microsoft',
  },
  default: {
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.65 10A5.99 5.99 0 006 6c-3.31 0-6 2.69-6 6s2.69 6 6 6a5.99 5.99 0 006.65-4H17v4h4v-4h3v-4H12.65zM6 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>`,
    label: 'SSO',
  },
};

function getProviderIcon(name: string): string {
  const key = name.toLowerCase();
  return providerIcons[key]?.icon ?? providerIcons['default']!.icon;
}

function getProviderLabel(name: string): string {
  const key = name.toLowerCase();
  return providerIcons[key]?.label || name;
}

function isLinked(providerName: string): boolean {
  return isProviderLinked(providerName);
}

async function linkAccount(providerName: string) {
  try {
    await linkProvider(providerName);
    // linkProvider handles the redirect automatically
  } catch {
    useNotifications().add({ type: 'error', title: 'Failed to initiate account linking' });
  }
}

async function unlinkAccount(providerName: string) {
  const error = await unlinkProvider(providerName);
  if (!error) {
    useNotifications().add({ type: 'success', title: `${getProviderLabel(providerName)} account unlinked` });
  } else {
    useNotifications().add({ type: 'error', title: error.message || 'Failed to unlink account' });
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
.last-connection {
  padding: 0.3rem 0.5rem;
  border-radius: 10px;
  background-color: var(--bg-contrast-2);
  align-items: center;
}

p {
  margin: 0.5rem;
  font-size: 0.9rem;
}

.warning {
  font-size: 0.9rem;
  color: var(--red);
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

.no-providers {
  color: var(--text-secondary);
  font-style: italic;
}
</style>
