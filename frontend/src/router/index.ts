import { createRouter, createWebHistory } from 'vue-router'
import Marketing from '@/views/(marketing)/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Marketing
    },
    {
      path: '/docs', // next /docs/:cattegory_id/:doc_id
      name: 'docs',
      component: () => import('@/views/docs/index.vue'),
      children: [
        {
          path: ':category_id',
          name: 'doc_category',
          component: () => import('@/views/docs/[category]/index.vue')
        },
        {
          path: ':category_id/:doc_id',
          name: 'document',
          component: () => import('@/views/docs/[category]/[id].vue')
        }
      ]
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/dashboard/index.vue')
    }
  ]
})
router.beforeEach((to, from, resolve) => {
  // @ts-ignore
  if (!('startViewTransition' in document)) return resolve()
  // @ts-ignore
  document.startViewTransition(() => {
    resolve()
  })
})

export default router
