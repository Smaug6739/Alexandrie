import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/doc/:subject',
    name: 'Home documentation',
    component: () => import('../views/docs/Subject.vue'),
  },
  {
    path: '/doc/:subject/:category/:doc_name',
    name: 'Category (main)',
    component: () => import('../views/docs/PageContent.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/admin/login.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404 not found',
    component: () => import('../views/404.vue'),
  },
];

export default routes.map(route => {
  const meta = {
    public: true,
  };
  return { ...route, meta };
}) as RouteRecordRaw[];
