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
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-color);
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--border-color-accent);
    box-shadow: 0 4px 12px rgb(0 0 0 / 6%);
  }

  &.current-session {
    border-color: var(--green);
    background: var(--green-bg-light);

    &:hover {
      border-color: var(--green);
    }
  }

  &.inactive {
    opacity: 0.7;
    background: var(--bg-contrast);
  }
}

.session-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.device-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: var(--bg-contrast-2);
  color: var(--font-color);
  flex-shrink: 0;

  svg {
    width: 22px;
    height: 22px;
  }

  &.mobile {
    background: var(--purple-bg);
    color: var(--purple);
  }

  &.desktop {
    background: var(--blue-bg);
    color: var(--blue);
  }
}

.session-info {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 1;
  min-width: 0;
}

.session-title {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.95rem;

  .browser {
    font-weight: 600;
    color: var(--font-color-dark);
  }

  .os {
    color: var(--font-color-light);
  }
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.15rem 0.5rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;

  &.current {
    background: var(--green-bg);
    color: var(--green-dark);
  }

  &.inactive {
    background: var(--grey-bg);
    color: var(--grey-dark);
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
  color: var(--font-color-light);

  svg {
    width: 14px;
    height: 14px;
    opacity: 0.7;
  }
}

.session-details {
  padding-top: 0.75rem;
  border-top: 1px solid var(--border-color-light);
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
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--font-color-light);
}

.detail-value {
  font-size: 0.85rem;
  color: var(--font-color);
}

.session-user-agent {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border-color-light);
}

.user-agent-label {
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--font-color-light);
}

.user-agent-value {
  font-family: var(--monospace-font, 'JetBrains Mono', monospace);
  font-size: 0.75rem;
  color: var(--font-color-light);
  background: var(--bg-contrast);
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  word-break: break-all;
  line-height: 1.4;
}
</style>
