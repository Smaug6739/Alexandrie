export default defineNuxtRouteMiddleware((to, from) => {
  const user_auth = useCookie('user_auth');
  if (to.fullPath.startsWith('/dashboard') && !user_auth?.value) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath },
    });
  } else if (to.fullPath.startsWith('/login') && user_auth?.value) return navigateTo({ path: '/dashboard' });
});
