export default defineNuxtRouteMiddleware(to => {
  /* if (process.client) {
    const authenticated = getCookie('user_auth');
    console.log(`Path: ${to.path} Authenticated: ${authenticated}`);

    if (!authenticated) {
      console.log('Redirecting to login');

      return navigateTo({
        path: '/login',
        query: { redirect: to.fullPath },
      });
    }
  }*/
  return;
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
