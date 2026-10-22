<template>
  <div class="page-card">
    <h2 style="display: flex; justify-content: space-between; align-items: center">User Details <img v-if="user" class="avatar" :src="avatarURL(user)" /></h2>
    <div v-if="user" style="width: 100%">
      <div class="user-details">
        <div class="user-detail">
          <label for="username">Username</label>
          <input id="username" v-model="user.username" type="text" />
        </div>
        <div class="user-detail">
          <label for="firstname">Firstname</label>
          <input id="firstname" v-model="user.firstname" type="text" />
        </div>
        <div class="user-detail">
          <label for="lastname">Lastname</label>
          <input id="lastname" v-model="user.lastname" type="text" />
        </div>
        <div class="user-detail">
          <label for="email">Email</label>
          <input id="email" v-model="user.email" type="email" />
        </div>
        <div class="user-detail">
          <label for="role">Role</label>
          <select id="role" v-model="user.role">
            <option :value="1">User</option>
            <option :value="2">Admin</option>
          </select>
        </div>
        <div class="user-detail">
          <label for="role">Account Type</label>
          <select id="role" v-model="user.type">
            <option :value="0">Normal</option>
            <option :value="1">Supervised</option>
          </select>
        </div>
        <div class="actions-row">
          <label class="toggle-row">
            <span><strong>Require two-factor authentication</strong><small>The user will need to set up TOTP.</small></span>
          </label>
          <AppToggle v-model="user.totp_forced" />
        </div>
        <div class="actions-row">
          <label class="toggle-row">
            <span><strong>Suspend Account</strong><small>Block user from logging in and accessing the API.</small></span>
          </label>
          <AppToggle :model-value="user.suspended" @update:model-value="toggleSuspend" />
        </div>
        <div class="container">
          <div class="user-detail">
            <label>Created At</label>
            <div class="value">{{ numericDate(user.created_timestamp) }}</div>
          </div>
          <div class="user-detail">
            <label>Updated At</label>
            <div class="value">{{ numericDate(user.updated_timestamp) }}</div>
          </div>
        </div>
      </div>
      <div class="actions-row">
        <AppButton type="success" @click="saveChanges">Save Changes</AppButton>
        <AppButton type="primary" @click="router.push(`/dashboard/admin/users/${user.id}/documents`)">View nodes</AppButton>
        <AppButton type="primary" @click="changePassword">Change Password</AppButton>
        <AppButton type="primary" @click="viewSessions">View Sessions</AppButton>
      </div>
    </div>
    <div v-else>No user found.</div>

    <AppModal v-model="showSessionsModal" title="Active Sessions">
      <div v-if="sessions.length > 0" class="sessions-list">
        <div v-for="session in sessions" :key="session.id" class="session-item">
          <div>
            <strong>IP:</strong> {{ session.ip_addr || 'Unknown' }} <br />
            <strong>Location:</strong> {{ session.location || 'Unknown' }} <br />
            <strong>Browser:</strong> {{ session.user_agent || 'Unknown' }}
          </div>
          <AppButton type="danger" @click="revokeSession(session.id)">Revoke</AppButton>
        </div>
      </div>
      <div v-else>No active sessions found.</div>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/stores';
import type { Session } from '~/stores/admin.store';

definePageMeta({ breadcrumb: 'User Details' });

const store = useAdminStore();

const route = useRoute();
const router = useRouter();
const { avatarURL } = useApi();
const { numericDate } = useDateFormatters();
const { t } = useI18nT();
const notifications = useNotifications();

const user = ref<User | undefined>(undefined);
const showSessionsModal = ref(false);
const sessions = ref<Session[]>([]);

watchEffect(async () => {
  user.value = await store.fetchById(route.params.id as string);
});

const saveChanges = async () => {
  if (!user.value) return;
  store
    .update(user.value)
    .then(() => notifications.add({ type: 'success', title: t('admin.users.actions.userUpdated') }))
    .catch(e => notifications.add({ type: 'error', title: t('admin.users.actions.error'), message: e }));
};

const toggleSuspend = async (value: boolean) => {
  if (!user.value) return;
  try {
    await store.suspendUser(user.value.id, value);
    user.value.suspended = value;
    notifications.add({ type: 'success', title: value ? t('admin.users.actions.accountSuspended') : t('admin.users.actions.accountActivated') });
  } catch (e) {
    notifications.add({ type: 'error', title: t('admin.users.actions.error'), message: String(e) });
  }
};

const changePassword = async () => {
  if (!user.value) return;
  const newPassword = prompt(`Enter new password for ${user.value.username}:`);
  if (newPassword) {
    try {
      await store.adminUpdatePassword(user.value.id, newPassword);
      notifications.add({ type: 'success', title: t('admin.users.actions.passwordUpdated') });
    } catch (e) {
      notifications.add({ type: 'error', title: t('admin.users.actions.error'), message: String(e) });
    }
  }
};

const viewSessions = async () => {
  if (!user.value) return;
  try {
    const result = await store.fetchUserSessions(user.value.id);
    sessions.value = result || [];
    showSessionsModal.value = true;
  } catch (e) {
    notifications.add({ type: 'error', title: t('admin.users.actions.errorFetchingSessions'), message: String(e) });
  }
};

const revokeSession = async (sessionId: string) => {
  if (!user.value) return;
  try {
    await store.deleteUserSession(user.value.id, sessionId);
    sessions.value = sessions.value.filter(s => s.id !== sessionId);
    notifications.add({ type: 'success', title: t('admin.users.actions.sessionRevoked') });
  } catch (e) {
    notifications.add({ type: 'error', title: t('admin.users.actions.errorRevokingSession'), message: String(e) });
  }
};
</script>

<style scoped lang="scss">
.user-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  width: 100%;
}

.container {
  display: flex;
  width: 100%;
}

.user-detail {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  width: 100%;
}

.toggle-row {
  flex-direction: row;
  align-items: center;
}

.toggle-row span {
  display: flex;
  flex-direction: column;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.sessions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.session-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
}
</style>
