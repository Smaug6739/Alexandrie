<template>
  <section>
    <h3>{{ t('settings.security.activeSessions') }}</h3>
    <p class="section-description">{{ t('settings.security.activeSessionsDesc') }}</p>
    <div v-if="userStore.sessions.length" class="sessions-list">
      <SessionCard
        v-for="session in userStore.sessions"
        :key="session.id"
        :session="session"
        :is-current="currentSession?.id === session.id"
        :show-user-agent="true"
      />
    </div>
    <p v-else class="no-sessions">{{ t('settings.security.noSessions') }}</p>
    <div v-if="hasUnrecognizedSession" class="warning-box">
      <Icon name="warning" display="sm" />
      <div>
        <strong>{{ t('settings.security.unrecognizedSession') }}</strong>
        <p>{{ t('settings.security.unrecognizedSessionDesc') }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import SessionCard from './SessionCard.vue';

const userStore = useUserStore();

const { t } = useI18nT();

userStore.fetchSessions();

const currentSession = computed(() => {
  const currentUserAgent = navigator.userAgent;
  const matchingSessions = userStore.sessions.filter(session => session.user_agent === currentUserAgent);
  if (matchingSessions.length > 0) {
    return matchingSessions.reduce((latest, session) => (session.login_timestamp > (latest?.login_timestamp || 0) ? session : latest), matchingSessions[0]);
  }
  return userStore.sessions[0] || null;
});

// Check if there might be unrecognized sessions (sessions other than current)
const hasUnrecognizedSession = computed(() => userStore.sessions.length > 1);
</script>

<style lang="scss" scoped>
h3 {
  margin-top: 2.5rem;
}

.section-description {
  margin-bottom: 1rem;
  color: var(--text-secondary);
}

.sessions-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.no-sessions {
  padding: 1rem;
  border-radius: var(--radius-lg);
  font-style: italic;
  color: var(--text-secondary);
  text-align: center;
  background: var(--surface-raised);
}
</style>
