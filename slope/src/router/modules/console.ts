import type { RouteRecordRaw } from 'vue-router'

const Layout = () => import('@/layouts/index.vue')

const routes: RouteRecordRaw = {
  path: '/',
  component: Layout,
  name: 'console',
  meta: {
    title: '控制台',
    icon: 'sidebar-breadcrumb',
  },
  children: [
    {
      path: '',
      name: 'console',
      component: () => import('@/views/index.vue'),
      meta: {
        title: '控制台',
        sidebar: false,
        breadcrumb: false,
        activeMenu: '/',
      },
    },
  ],
}

export default routes
