import type { RouteRecordRaw } from 'vue-router'

const Layout = () => import('@/layouts/index.vue')

const routes: RouteRecordRaw = {
  path: '/scientific-research',
  component: Layout,
  redirect: '/scientific-research/project',
  name: 'scientificResearch',
  meta: {
    title: '科研项目',
    icon: 'ep:data-analysis',
  },
  children: [
    {
      path: 'project',
      name: 'scientificResearchProject',
      component: () => import('@/views/scientific_research/project.vue'),
      meta: {
        title: '科研项目',
        sidebar: false,
        breadcrumb: false,
        activeMenu: '/scientific-research',
      },
    },
  ],
}

export default routes
