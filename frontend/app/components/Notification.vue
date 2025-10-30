<template>
  <TransitionGroup name="notification-slide" tag="div" class="notification-container">
    <div v-for="notification in notifications" :key="notification.id" class="notification" :class="notification.type">
      <div class="content">
        <div class="header">
          <p class="title">{{ notification.title }}</p>
          <span class="btn" aria-label="Close" @click="close(notification.id)">&times;</span>
        </div>
        <p v-if="notification.message" class="message">{{ notification.message }}</p>
      </div>
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
const notifications = computed(() => [...useNotifications().notifications.value].reverse()); // Create a copy before reversing
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
  gap: 15px;
}

.notification {
  position: relative;
  display: flex;
  width: 360px;
  padding: 16px 18px;
  border-radius: 8px;
  color: white;
  box-shadow: 0 2px 10px var(--shadow);
  align-items: flex-start;
  animation: fade-in 0.3s ease;
  backdrop-filter: blur(12px);
  gap: 12px;
}

.header {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
}

p {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
}

.title {
  font-weight: 500;
}

.message {
  opacity: 0.8;
  margin-top: 4px;
}

.btn {
  position: absolute;
  top: 5px;
  right: 15px;
  border: none;
  font-size: 25px;
  color: white;
  opacity: 0.6;
  cursor: pointer;
}

/* Notification types */
.success {
  background: var(--green);
}

.error {
  background: var(--red);
}

.warning {
  background: var(--yellow);
}

.info {
  background: var(--blue);
}

/* Transitions */
.notification-slide-enter-active,
.notification-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.notification-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
