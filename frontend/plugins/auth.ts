export default defineNuxtPlugin(_ => {
  const router = useRouter();

  // Every time the route changes (fired on initialization too)
  router.beforeEach((to, _, next) => {
    if (to.fullPath.startsWith('/admin')) {
      if (process.server) {
        return next({ name: 'login', query: { redirect: to.fullPath } });
      }
      const authenticated = getCookie('user_auth');
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

function getCookie(cname: string) {
  var name = cname + '=';
  var decodedCookie = decodeURIComponent(document.cookie);
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
