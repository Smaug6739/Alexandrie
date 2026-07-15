<template>
  <div class="session-card" :class="{ 'current-session': isCurrent, inactive: !session.active }">
    <div class="session-header">
      <div class="device-icon" :class="deviceType">
        <Icon v-if="deviceType == 'mobile'" name="mobile" fill="var(--purple)" />
        <Icon v-else name="computer" fill="var(--blue)" />
      </div>
      <div class="session-info-container">
        <div class="session-info">
          <div class="session-title">
            <span class="browser">{{ parsedUserAgent.browser }}</span>
            <span class="os">on {{ parsedUserAgent.os }}</span>
            <span v-if="isCurrent" class="badge current">{{ t('components.sessionCard.current') }}</span>
            <span v-else-if="!session.active" class="badge inactive">{{ t('components.sessionCard.inactive') }}</span>
          </div>
          <div class="session-meta">
            <span class="meta-item">
              <Icon name="location" display="xsm" />
              {{ session.location || t('components.sessionCard.unknownLocation') }}
            </span>
            <span class="meta-item">
              <Icon name="internet" display="xsm" />
              {{ session.ip_adress || t('components.sessionCard.unknownIP') }}
            </span>
          </div>
        </div>
        <AppBtnIcon icon="close" display="lg" @click="closeSession" />
      </div>
    </div>

    <div class="session-details">
      <div class="detail-row">
        <div class="detail-item">
          <span class="detail-label">{{ t('components.sessionCard.login') }}</span>
          <span class="detail-value">{{ numericDate(session.login_timestamp) }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">{{ t('components.sessionCard.lastActivity') }}</span>
          <span class="detail-value">{{ formatRelativeDate(session.last_refresh_timestamp) }}</span>
        </div>
        <div v-if="session.logout_timestamp" class="detail-item">
          <span class="detail-label">{{ t('components.sessionCard.loggedOut') }}</span>
          <span class="detail-value">{{ numericDate(session.logout_timestamp) }}</span>
        </div>
      </div>
    </div>

    <div v-if="showUserAgent && session.user_agent" class="session-user-agent">
      <span class="user-agent-label">{{ t('components.sessionCard.userAgent') }}</span>
      <code class="user-agent-value">{{ session.user_agent }}</code>
    </div>
  </div>
</template>

<script setup lang="ts">
import { parseUserAgent } from '~/helpers/utils';
import type { Session } from '~/stores';

const { t } = useI18nT();
const store = useUserStore();

const props = withDefaults(
  defineProps<{
    session: Session;
    isCurrent?: boolean;
    showUserAgent?: boolean;
  }>(),
  {
    isCurrent: false,
    showUserAgent: false,
  },
);

const { numericDate, formatRelativeDate } = useDateFormatters();

const parsedUserAgent = computed(() => parseUserAgent(props.session.user_agent || ''));

const deviceType = computed(() => {
  const ua = props.session.user_agent?.toLowerCase() || '';
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone') || ua.includes('ipad')) {
    return 'mobile';
  }
  return 'desktop';
});

const closeSession = async () => {
  try {
    await store.deleteSession(props.session.id);
  } catch (error) {
    console.error('Failed to delete session:', error);
  }
};
</script>

<style scoped lang="scss">
.session-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface-base);
  transition:
    border-color $transition-base ease,
    box-shadow $transition-base ease;

  &:hover {
    border-color: var(--border-strong);
    box-shadow: var(--shadow-md);
  }

  &.current-session {
    border-color: var(--green);
    background: var(--green-bg-light);

    &:hover {
      border-color: var(--green);
    }
  }

  &.inactive {
    background: var(--surface-raised);
    opacity: 0.7;
  }
}

.session-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.device-icon {
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-lg);
  color: var(--text-body);
  background: var(--surface-overlay);

  svg {
    width: 22px;
    height: 22px;
  }

  &.mobile {
    color: var(--purple);
    background: var(--purple-bg);
  }

  &.desktop {
    color: var(--blue);
    background: var(--blue-bg);
  }
}

.session-info-container {
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
  min-width: 0;
}

.session-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
}

.session-title {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;

  .browser {
    font-weight: 600;
    color: var(--text-primary);
  }

  .os {
    color: var(--text-secondary);
  }
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-xl);
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;

  &.current {
    color: var(--green-dark);
    background: var(--green-bg);
  }

  &.inactive {
    color: var(--grey-dark);
    background: var(--grey-bg);
  }
}

.session-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  color: var(--text-secondary);

  svg {
    width: 14px;
    height: 14px;
    opacity: 0.7;
  }
}

.session-details {
  padding-top: 0.75rem;
  border-top: 1px solid var(--border-subtle);
}

.detail-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.detail-label {
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.detail-value {
  font-size: 0.85rem;
  color: var(--text-body);
}

.session-user-agent {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border-subtle);
}

.user-agent-label {
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.user-agent-value {
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-sm);
  font-family: $font-mono;
  font-size: 0.75rem;
  line-height: 1.4;
  color: var(--text-secondary);
  word-break: break-all;
  background: var(--surface-raised);
}
</style>
