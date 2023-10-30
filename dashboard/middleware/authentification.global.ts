export default defineNuxtRouteMiddleware(to => {
  const user_auth = useCookie('user_auth');
  if (to.fullPath.startsWith('/dashboard')) {
    if (!user_auth.value) {
      return navigateTo({
        path: '/login',
        query: { redirect: to.fullPath },
      });
    }
  }
  if (to.fullPath.startsWith('/login')) {
    if (user_auth.value) {
      return navigateTo({ path: '/dashboard' });
    }
  }
});
