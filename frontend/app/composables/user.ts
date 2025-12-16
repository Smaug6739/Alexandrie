/**
 * User authentication actions
 * Provides logout functions with notification feedback
 */

/** Logout current session */
function logoutUser() {
  const store = useUserStore();
  store
    .logout()
    .then(() => {
      useNotifications().add({ type: 'success', title: 'Logged out' });
      store.post_logout();
      useRouter().push('/login');
    })
    .catch(e => useNotifications().add({ type: 'error', title: 'Error', message: e }));
}

/** Logout all sessions (including other devices) */
function logoutUserAll() {
  const store = useUserStore();
  store
    .logout_all()
    .then(() => {
      useNotifications().add({ type: 'success', title: 'Logged out' });
      store.post_logout();
      useRouter().push('/login');
    })
    .catch(e => useNotifications().add({ type: 'error', title: 'Error', message: e }));
}

export { logoutUser, logoutUserAll };
