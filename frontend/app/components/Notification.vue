<template>
  <TransitionGroup name="notification-slide" tag="div" class="notification-container">
    <div v-for="notification in notifications" :key="notification.id" class="notification" :class="notification.type">
      <div class="icon-wrapper">
        <svg v-if="notification.type === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <svg v-else-if="notification.type === 'error'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
        <svg v-else-if="notification.type === 'warning'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="11" />
          <circle cx="12" cy="8" r="0.2" />
        </svg>
      </div>
      <div class="content">
        <p class="title">{{ notification.title }}</p>
        <p v-if="notification.message" class="message">{{ notification.message }}</p>
      </div>
      <button class="close-btn" aria-label="Close" @click="close(notification.id)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      <div class="progress-bar" :style="{ animationDuration: (notification.timeout || 3000) + 'ms' }" />
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
const notifications = computed(() => [...useNotifications().notifications.value].reverse());
const close = (id: number) => useNotifications().remove(id);
</script>

<style scoped lang="scss">
.notification-container {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notification {
  position: relative;
  display: flex;
  width: 380px;
  padding: 14px 16px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-color);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 10%), 0 2px 4px -2px rgb(0 0 0 / 10%);
  align-items: flex-start;
  gap: 12px;
  overflow: hidden;
}

.icon-wrapper {
  display: flex;
  width: 36px;
  min-width: 36px;
  height: 36px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;

  svg {
    width: 20px;
    height: 20px;
  }
}

.content {
  min-width: 0;
  text-align: left;
  flex: 1;
  padding-top: 2px;
}

.title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--font-color-dark);
}

.message {
  margin: 4px 0 0;
  font-size: 13px;
  line-height: 1.4;
  color: var(--font-color-light);
}

.close-btn {
  display: flex;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: 8px;
  color: var(--font-color-light);
  background: transparent;
  transition: all 0.15s ease;
  align-items: center;
  cursor: pointer;
  flex-shrink: 0;
  justify-content: center;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    color: var(--font-color);
    background: var(--bg-contrast);
  }
}

.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: currentcolor;
  opacity: 0.3;
  animation: shrink linear forwards;
  transform-origin: left;
}

@keyframes shrink {
  from {
    transform: scaleX(1);
  }

  to {
    transform: scaleX(0);
  }
}

/* Notification types */
.success {
  .icon-wrapper {
    color: var(--green);
    background: var(--green-bg);
  }

  .progress-bar {
    background: var(--green);
  }
}

.error {
  .icon-wrapper {
    color: var(--red);
    background: var(--red-bg);
  }

  .progress-bar {
    background: var(--red);
  }
}

.warning {
  .icon-wrapper {
    color: var(--yellow);
    background: var(--yellow-bg);
  }

  .progress-bar {
    background: var(--yellow);
  }
}

.info {
  .icon-wrapper {
    color: var(--blue);
    background: var(--blue-bg);
  }

  .progress-bar {
    background: var(--blue);
  }
}

/* Transitions */
.notification-slide-enter-active {
  transition: all 0.3s cubic-bezier(0.21, 1.02, 0.73, 1);
}

.notification-slide-leave-active {
  transition: all 0.2s cubic-bezier(0.06, 0.71, 0.55, 1);
}

.notification-slide-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-slide-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-slide-move {
  transition: transform 0.3s cubic-bezier(0.21, 1.02, 0.73, 1);
}

/* Dark mode adjustments */
:global(.dark-mode) .notification {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 30%), 0 2px 4px -2px rgb(0 0 0 / 20%);
}
</style>
