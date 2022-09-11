import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/doc',
    name: 'Documentation',
    component: () => import('../views/docs/Index.vue'),
    children: [
      {
        path: ':subject',
        name: 'Home documentation',
        components: {
          doc: () => import('../views/docs/Subject.vue'),
        },
      },
      {
        path: ':subject/:category/:doc_name',
        name: 'Page content',
        components: {
          doc: () => import('../views/docs/PageContent.vue'),
        },
      },
    ],
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
