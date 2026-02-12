<template>
  <div class="session-card" :class="{ 'current-session': isCurrent, inactive: !session.active }">
    <div class="session-header">
      <div class="device-icon" :class="deviceType">
        <Icon v-if="deviceType == 'mobile'" name="mobile" fill="var(--purple)" />
        <Icon v-else name="computer" fill="var(--blue)" />
      </div>
      <div class="session-info">
        <div class="session-title">
          <span class="browser">{{ parsedUserAgent.browser }}</span>
          <span class="os">on {{ parsedUserAgent.os }}</span>
          <span v-if="isCurrent" class="badge current">Current</span>
          <span v-else-if="!session.active" class="badge inactive">Inactive</span>
        </div>
        <div class="session-meta">
          <span class="meta-item">
            <Icon name="location" display="xsm" />
            {{ session.location || 'Unknown location' }}
          </span>
          <span class="meta-item">
            <Icon name="internet" display="xsm" />
            {{ session.ip_adress || 'Unknown IP' }}
          </span>
        </div>
      </div>
    </div>

    <div class="session-details">
      <div class="detail-row">
        <div class="detail-item">
          <span class="detail-label">Login</span>
          <span class="detail-value">{{ numericDate(session.login_timestamp) }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Last activity</span>
          <span class="detail-value">{{ formatRelativeDate(session.last_refresh_timestamp) }}</span>
        </div>
        <div v-if="session.logout_timestamp" class="detail-item">
          <span class="detail-label">Logged out</span>
          <span class="detail-value">{{ numericDate(session.logout_timestamp) }}</span>
        </div>
      </div>
    </div>

    <div v-if="showUserAgent && session.user_agent" class="session-user-agent">
      <span class="user-agent-label">User agent</span>
      <code class="user-agent-value">{{ session.user_agent }}</code>
    </div>
  </div>
</template>

<script setup lang="ts">
import { parseUserAgent } from '~/helpers/utils';

export interface Session {
  id: string;
  user_id: string;
  expire_token: number;
  last_refresh_timestamp: number;
  active: boolean;
  ip_adress?: string;
  user_agent?: string;
  location?: string;
  type: string;
  login_timestamp: number;
  logout_timestamp?: number;
}

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
</script>

<style scoped lang="scss">
.session-card {
  display: flex;
  padding: 1rem 1.25rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface-base);
  transition:
    border-color $transition-base ease,
    box-shadow $transition-base ease;
  flex-direction: column;
  gap: 1rem;

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
  width: 44px;
  height: 44px;
  border-radius: var(--radius-lg);
  color: var(--text-body);
  background: var(--surface-overlay);
  align-items: center;
  flex-shrink: 0;
  justify-content: center;

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

.session-info {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 0.35rem;
}

.session-title {
  display: flex;
  font-size: 0.95rem;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;

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
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-xl);
  font-size: 0.7rem;
  font-weight: 600;
  align-items: center;
  letter-spacing: 0.03em;
  text-transform: uppercase;

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
  font-size: 0.8rem;
  color: var(--text-secondary);
  align-items: center;
  gap: 0.35rem;

  svg {
    width: 14px;
    height: 14px;
    opacity: 0.7;
  }
}

.session-details {
  border-top: 1px solid var(--border-subtle);
  padding-top: 0.75rem;
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
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.detail-value {
  font-size: 0.85rem;
  color: var(--text-body);
}

.session-user-agent {
  display: flex;
  border-top: 1px solid var(--border-subtle);
  flex-direction: column;
  gap: 0.35rem;
  padding-top: 0.75rem;
}

.user-agent-label {
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--text-secondary);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.user-agent-value {
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-sm);
  font-family: $font-mono;
  font-size: 0.75rem;
  line-height: 1.4;
  color: var(--text-secondary);
  background: var(--surface-raised);
  word-break: break-all;
}
</style>
