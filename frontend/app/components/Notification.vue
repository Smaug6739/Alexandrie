<template>
  <TransitionGroup name="notification-slide" tag="div" class="notification-container">
    <div v-for="notification in notifications" :key="notification.id" class="notification" :class="notification.type">
      <div class="content">
        <div class="header">
          <p class="title">{{ notification.title }}</p>
          <span class="btn" @click="close(notification.id)" aria-label="Close">&times;</span>
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
  border-radius: 8px;
  backdrop-filter: blur(12px);
  color: white;
  box-shadow: 0 2px 10px var(--shadow);
  animation: fadeIn 0.3s ease;
  position: relative;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
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
.btn {
  font-size: 25px;
  color: white;
  border: none;
  cursor: pointer;
  opacity: 0.6;
  position: absolute;
  top: 5px;
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
