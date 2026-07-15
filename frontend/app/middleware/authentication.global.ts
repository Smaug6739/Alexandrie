import localForage from 'localforage';

export default defineNuxtRouteMiddleware(async (to, _) => {
  if (!import.meta.client) return;
  const user_auth = await localForage.getItem('isLoggedIn');

  if (to.fullPath.startsWith('/dashboard') && !user_auth) {
    const localeRoute = useLocaleRoute();
    const route = localeRoute({ name: 'login', query: { redirect: to.fullPath } });

    return navigateTo(route);
  }

  if (to.fullPath.startsWith('/dashboard/admin')) {
    const user = await useUserStore().fetch();
    if (user && user.role === 2) return;
    return navigateTo({
      path: '/dashboard',
    });
  }

  // Allow OIDC callback page to work regardless of auth state
  // This is needed for the link flow when user is already logged in
  if (to.fullPath.startsWith('/login/oidc/callback')) {
    return;
  }

  if (to.fullPath.startsWith('/login') || to.fullPath.startsWith('/signup')) {
    if (user_auth)
      return navigateTo({
        path: '/dashboard',
      });
  }
});
