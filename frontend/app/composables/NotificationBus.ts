export interface Notification {
  id: number;
  title: string;
  message?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timeout?: number;
}

const notifications = ref<Notification[]>([]);

function add(notification: Omit<Notification, 'id'>) {
  const id = Math.floor(Math.random() * 100000);
  notifications.value.push({ id: id, ...notification });
  setTimeout(() => remove(id), notification.timeout || 3000);
}
function remove(id: number) {
  const index = notifications.value.findIndex(n => n.id == id);
  if (index == -1) return;
  notifications.value.splice(index, 1);
}

export function useNotifications() {
  return {
    add,
    remove,
    notifications,
  };
}
