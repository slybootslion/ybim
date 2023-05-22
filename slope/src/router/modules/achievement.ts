import type { RouteRecordRaw } from 'vue-router'

const Layout = () => import('@/layouts/index.vue')

const Contract: RouteRecordRaw = {
  path: '/achievement-contract',
  component: Layout,
  redirect: '/achievement-contract/contract',
  name: 'achievementContract',
  meta: {
    title: '合同管理',
    icon: 'ep:notebook',
  },
  children: [
    {
      path: 'contract',
      name: 'achievementManageContract',
      component: () => import('@/views/achievement/contract.vue'),
      meta: {
        title: '合同管理',
        sidebar: false,
        breadcrumb: false,
        activeMenu: '/achievement-contract',
      },
    },
    {
      path: 'contract-form',
      name: 'achievementManageContractForm',
      component: () => import('@/views/achievement/contract-form.vue'),
      meta: {
        title: '合同存档登记',
        sidebar: false,
        breadcrumb: false,
        activeMenu: '/achievement-contract',
      },
    },
    {
      path: 'contract-detail',
      name: 'achievementManageContractDetail',
      component: () => import('@/views/achievement/contract-detail.vue'),
      meta: {
        title: '合同登记',
        sidebar: false,
        breadcrumb: false,
        activeMenu: '/achievement-contract',
      },
    },
  ],
}

const Knowledge: RouteRecordRaw = {
  path: '/achievement-knowledge',
  component: Layout,
  redirect: '/achievement-knowledge/knowledge',
  name: 'achievementKnowledge',
  meta: {
    title: '知识管理',
    icon: 'ep:star',
  },
  children: [
    {
      path: 'knowledge',
      name: 'achievementKnowledgeKnowledge',
      component: () => import('@/views/achievement/knowledge.vue'),
      meta: {
        title: '知识管理',
        sidebar: false,
        breadcrumb: false,
        activeMenu: '/achievement-knowledge',
      },
    },
  ],
}

const Qualification: RouteRecordRaw = {
  path: '/achievement-qualification',
  component: Layout,
  redirect: '/achievement-qualification/qualification',
  name: 'achievementQualification',
  meta: {
    title: '资质管理',
    icon: 'ep:message-box',
  },
  children: [
    {
      path: 'qualification',
      name: 'achievementQualificationQualification',
      component: () => import('@/views/achievement/qualification.vue'),
      meta: {
        title: '资质管理',
        sidebar: false,
        breadcrumb: false,
        activeMenu: '/achievement-qualification',
      },
    },
    {
      path: 'qualification-form',
      name: 'achievementQualificationQualificationForm',
      component: () => import('@/views/achievement/qualification-form.vue'),
      meta: {
        title: '资质建立',
        sidebar: false,
        breadcrumb: false,
        activeMenu: '/achievement-qualification',
      },
    },
    {
      path: 'qualification-detail',
      name: 'achievementQualificationQualificationDetail',
      component: () => import('@/views/achievement/qualification-detail.vue'),
      meta: {
        title: '资质详情',
        sidebar: false,
        breadcrumb: false,
        activeMenu: '/achievement-qualification',
      },
    },
  ],
}

export { Contract, Knowledge, Qualification }
