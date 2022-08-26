import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/doc/:subject',
    name: 'Home documentation',
    component: () => import('../views/Data.vue'),
    children: [
      {
        path: ':category',
        name: 'Category (main)',
        component: () => import('../views/Data.vue'),
        children: [
          {
            path: ':doc_name',
            name: 'Subcategory',
            component: () => import('../views/Data.vue'),
          },
        ],
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
