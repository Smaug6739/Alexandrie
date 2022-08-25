import { type RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/admin/login.vue'),
  },
];

export default routes.map(route => {
  const meta = {
    public: true,
  };
  return { ...route, meta };
}) as RouteRecordRaw[];
