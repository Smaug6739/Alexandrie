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
export default router;
