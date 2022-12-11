export default defineNuxtPlugin(({ ssrContext }) => {
  const router = useRouter();

  // Every time the route changes (fired on initialization too)
  router.beforeEach((to, _, next) => {
    if (to.fullPath.startsWith('/admin')) {
      if (process.server) {
        const hasCookie = getCookie('user_auth', ssrContext?.event.req.headers.cookie);
        if (!hasCookie) {
          return next({
            path: '/login',
            query: { redirect: to.fullPath },
          });
        } else {
          return next();
        }
      }
      const authenticated = getCookie('user_auth', document.cookie);
      if (!authenticated) {
        return next({
          path: '/login',
          query: { redirect: to.fullPath },
        });
      }
      return next();
    }
    return next();
  });
});

function getCookie(cname: string, cookies?: string) {
  if (!cookies) return '';
  var name = cname + '=';
  var decodedCookie = decodeURIComponent(cookies);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c: string = ca[i]!;
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}
