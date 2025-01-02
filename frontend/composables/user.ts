function logoutUser() {
  const store = useUserStore();
  store
    .logout()
    .then(() => {
      useNotifications().add({ title: 'Success:', message: 'Logged out', type: 'success', timeout: 3000 });
      store.post_logout();
      useRouter().push('/login');
    })
    .catch(e => {
      useNotifications().add({ title: 'Error:', message: e, type: 'error', timeout: 3000 });
    });
}

function logoutUserAll() {
  const store = useUserStore();
  store
    .logout_all()
    .then(() => {
      useNotifications().add({ title: 'Success:', message: 'Logged out', type: 'success', timeout: 3000 });
      setTimeout(() => {
        store.post_logout();
        useRouter().push('/login');
      }, 3000);
    })
    .catch(e => {
      useNotifications().add({ title: 'Error:', message: e, type: 'error', timeout: 3000 });
    });
}

export { logoutUser, logoutUserAll };
