export interface Notification {
  id: number;
  title: string;
  message?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timeout: number;
}

export const useNotifications = defineStore('notifications', {
  state: () => ({
    notifications: ref<Notification[]>([]),
  }),

  getters: {
    getAll: state => state.notifications,
  },

  actions: {
    // Add a notification
    add: function (notification: Omit<Notification, 'id'>) {
      const id = Math.floor(Math.random() * 100000);
      this.notifications.push({ id: id, ...notification });
      setTimeout(() => this.remove(id), notification.timeout);
    },

    // Remove a notification
    remove: function (id: number) {
      const index = this.notifications.findIndex(n => n.id == id);
      if (index == -1) return;
      this.notifications.splice(index, 1);
    },
  },
});
