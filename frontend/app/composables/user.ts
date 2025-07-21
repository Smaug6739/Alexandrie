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

function logoutUserAll() {
  const store = useUserStore();
  store
    .logout_all()
    .then(() => {
      useNotifications().add({ type: 'success', title: 'Logged out:' });
      setTimeout(() => {
        store.post_logout();
        useRouter().push('/login');
      }, 3000);
    })
    .catch(e => useNotifications().add({ type: 'error', title: 'Error', message: e }));
}

export { logoutUser, logoutUserAll };
