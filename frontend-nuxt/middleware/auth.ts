export default defineNuxtRouteMiddleware(to => {
  const authenticated = getCookie('user_auth');
  if (!authenticated) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath },
    });
  }
  return navigateTo(to.path);
});

function getCookie(cname: string) {
  if (!process.client) return;
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
