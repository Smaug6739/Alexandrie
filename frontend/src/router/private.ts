import { type RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/admin/dashboard.vue'),
  },

  {
    path: '/admin/articles',
    name: 'Articles',
    component: () => import('../views/admin/articles/main.vue'),
  },
  {
    path: '/admin/articles/edit/:id',
    name: 'Articles edit',
    component: () => import('../views/admin/articles/edit.vue'),
  },
  {
    path: '/admin/articles/new',
    name: 'Articles post',
    component: () => import('../views/admin/articles/new.vue'),
  },
  {
    path: '/admin/categories',
    name: 'Categories',
    component: () => import('../views/admin/categories/main.vue'),
  },
  {
    path: '/admin/categories/edit/:id',
    name: 'Category edit',
    component: () => import('../views/admin/categories/edit.vue'),
  },

  {
    path: '/admin/files',
    name: 'Files manager',
    component: () => import('../views/admin/files/files.vue'),
  },
];

export default routes.map(route => {
  const meta = {
    public: false,
  };
  return { ...route, meta };
});
