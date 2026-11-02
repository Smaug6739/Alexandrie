<template>
  <div>
    <h2 class="title"><img v-if="user" class="avatar" :src="avatarURL(user)" />Sessions ({{ user.username }})</h2>

    <div v-if="sessions.length > 0" class="sessions-list">
      <SessionCard v-for="session in sessions" :key="session.id" :session="session" :is-current="false" :show-user-agent="true" @close="revokeSession" />
    </div>
    <div v-else class="no-sessions">No active sessions found.</div>
  </div>
</template>

<script setup lang="ts">
import type { Session, User } from '~/stores/db_structures';

definePageMeta({ breadcrumb: 'User Details' });

const store = useAdminStore();

const { avatarURL } = useApi();
const { t } = useI18nT();
const notifications = useNotifications();

const showSessionsModal = ref(false);
const sessions = ref<Session[]>([]);

const props = defineProps<{
  user: User;
}>();

watchEffect(async () => {
  try {
    if (!props.user) return;
    const result = await store.fetchUserSessions(props.user.id);
    sessions.value = result || [];
    showSessionsModal.value = true;
  } catch (e) {
    notifications.add({ type: 'error', title: t('admin.users.actions.errorFetchingSessions'), message: String(e) });
  }
});

const revokeSession = async (sessionId: string) => {
  if (!props.user) return;
  try {
    await store.deleteUserSession(props.user.id, sessionId);
    sessions.value = sessions.value.filter(s => s.id !== sessionId);
    notifications.add({ type: 'success', title: t('admin.users.actions.sessionRevoked') });
  } catch (e) {
    notifications.add({ type: 'error', title: t('admin.users.actions.errorRevokingSession'), message: String(e) });
  }
};
</script>

<style scoped lang="scss">
.title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.avatar {
  width: 25px;
  height: 25px;
  border-radius: 50%;
}

.sessions-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.no-sessions {
  color: var(--text-secondary);
  text-align: center;
}
</style>
