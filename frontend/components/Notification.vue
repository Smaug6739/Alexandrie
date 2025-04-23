<template>
  <TransitionGroup name="notification-slide" tag="div" class="notification-container">
    <div v-for="notification in notifications" :key="notification.id" class="notification" :class="notification.type">
      <div class="content">
        <p class="title">{{ notification.title }}</p>
        <p v-if="notification.message" class="message">{{ notification.message }}</p>
        <button @click="close(notification.id)" aria-label="Close">&times;</button>
      </div>
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
import { useNotifications } from '~/stores';

const notifications = computed(() => [...useNotifications().getAll].reverse()); // Create a copy before reversing
const close = (id: number) => useNotifications().remove(id);
</script>
<style scoped lang="scss">
.notification-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 1000;
}

.notification {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 360px;
  padding: 16px 18px;
  border-radius: 14px;
  backdrop-filter: blur(12px);
  background: rgba(30, 30, 30, 0.6);
  color: white;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
  animation: fadeIn 0.3s ease;
  position: relative;
}

p {
  font-size: 14px;
  margin: 0;
  line-height: 1.4;
}
.title {
  font-weight: 500;
}
.message {
  opacity: 0.8;
  margin-top: 4px;
}
button {
  font-size: 30px;
  color: white;
  border: none;
  cursor: pointer;
  opacity: 0.6;
  position: absolute;
  top: 10px;
  right: 15px;
}
/* Notification types */
.success {
  background: $green;
}

.error {
  background: $red;
}

.warning {
  background: $yellow;
}

.info {
  background: $blue;
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

@keyframes fadeIn {
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
