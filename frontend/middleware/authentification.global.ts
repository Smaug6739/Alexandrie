export default defineNuxtRouteMiddleware((to, _) => {
  if (!import.meta.client) return;
  const user_auth = localStorage.getItem('isLoggedIn');
  if (to.fullPath.startsWith('/dashboard') && !user_auth) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath },
    });
  }
  if (to.fullPath.startsWith('/login') && user_auth) {
    return navigateTo({
      path: '/dashboard',
    });
  }
});
