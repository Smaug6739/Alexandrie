import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import publicRoutes from './public';
import privateRoutes from './private';

let routes: RouteRecordRaw[] = [];

routes = routes.concat(publicRoutes);
routes = routes.concat(privateRoutes);

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
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
  const authenticated = getCookie('user_auth');
  const isPublic = to.matched.some(record => record.meta.public);
  if (!isPublic && !authenticated) {
    return next({
      path: '/login',
      query: { redirect: to.fullPath },
    });
  }
  if (authenticated && !isPublic) {
    return next();
  }
  next();
});

export default router;
