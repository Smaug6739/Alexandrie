import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import publicRoutes from './public';
import privateRoutes from './private';

let routes: RouteRecordRaw[] = [
  {
    path: '/doc/:subject',
    name: 'Home',
    component: () => import('../views/Data.vue'),
  },
  {
    path: '/doc/:subject/:category',
    name: 'Home',
    component: () => import('../views/Data.vue'),
  },
  {
    path: '/doc/:subject/:category/:doc_name',
    name: 'Home',
    component: () => import('../views/Data.vue'),
  },
];

routes = routes.concat(publicRoutes);
routes = routes.concat(privateRoutes);

const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
