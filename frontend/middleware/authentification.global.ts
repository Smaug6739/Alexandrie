export default defineNuxtRouteMiddleware((to, from) => {
  if (!import.meta.client) return;
  const user_auth = localStorage.getItem('isLoggedIn');
  console.log(user_auth);

  if (to.fullPath.startsWith('/dashboard') && !user_auth) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath },
    });
  }
  //else if (to.fullPath.startsWith('/login') && user_auth?.value) return navigateTo({ path: '/dashboard' });
});
