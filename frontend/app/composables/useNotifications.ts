/**
 * Notification system composable
 * Manages toast-style notifications with auto-dismiss
 */

export interface Notification {
  id: number;
  title: string;
  message?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timeout?: number;
}

const notifications = ref<Notification[]>([]);

/** Add a notification (auto-dismisses after timeout, default 3s) */
function add(notification: Omit<Notification, 'id'>) {
  const id = Math.floor(Math.random() * 100000);
  notifications.value.push({ id, ...notification });
  setTimeout(() => remove(id), notification.timeout || 3000);
}

/** Remove a notification by ID */
function remove(id: number) {
  const index = notifications.value.findIndex(n => n.id === id);
  if (index !== -1) notifications.value.splice(index, 1);
}

export function useNotifications() {
  return { add, remove, notifications };
}
