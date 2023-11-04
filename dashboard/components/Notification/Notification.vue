<template>
	<TransitionGroup name="notification-slide" tag="div" class="notification-container"
		enter-from-class="notification-enter-from" enter-to-class="notification-enter-to"
		leave-from-class="notification-leave-from" leave-to-class="notification-leave-to">
		<div v-for="notification in notifications" :key="notification.id" class="notification" :class="notification.type">
			<div class="header">
				<p>{{ notification.title }}</p>
				<svg @click="close(notification.id)" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960"
					width="24" class="close-icon">
					<path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
				</svg>
			</div>
			<p>{{ notification.message }}</p>
		</div>
	</TransitionGroup>
</template>

<script setup lang="ts">
import { useNotifications } from '~/store';

const notifications = computed(() => useNotifications().getAll.reverse());
const close = (id: number) => useNotifications().remove(id);

</script>
<style scoped lang="scss">
.notification-container {
	position: fixed;
	bottom: 10px;
	right: 10px;
	z-index: 1000;
}

.notification {
	padding: 18px 15px;
	border-radius: 8px;
	color: white;
	margin-bottom: 10px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	width: 350px;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	font-weight: 500;
}

p {
	margin: 0;
	padding: 0 5px;
}

.close-icon {
	cursor: pointer;
	margin-left: 12px;
	transition: transform $transition-duration ease;
}

.close-icon:hover {
	transform: scale(1.1);
}

.info {
	background-color: $blue;
}

.error {
	background-color: $red;
}

.success {
	background-color: $green;
}

.warning {
	background-color: $yellow;
}

/* Transitions */
.notification-slide-enter-active,
.notification-slide-leave-active {
	transition: transform $transition-duration, opacity $transition-duration;
}

.notification-enter-from {
	opacity: 0;
	transform: translateX(100%);
}

.notification-enter-to {
	opacity: 1;
	transform: translateX(0%);
}

.notification-leave-from {
	opacity: 1;
	transform: translateX(0%);
}

.notification-leave-to {
	opacity: 0;
	transform: translateX(100%);
}
</style>
