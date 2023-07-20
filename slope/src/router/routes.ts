import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'
import type { RouteRecordRaw } from 'vue-router'
import Console from './modules/console'
import Research from './modules/research'
import { Person, Role } from './modules/system'
import { Contract, Knowledge, Qualification } from './modules/achievement'
import { ProductionProject, Supplier, TaskOrder } from '@/router/modules/production'
import {
  Approval, Bid, Bidding, ContractRating, Customer, Initiation, Record, Tracking,
} from '@/router/modules/operate'
import type { Route } from '#/global'
import useSettingsStore from '@/store/modules/settings'

// 固定路由（默认路由）
const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login.vue'),
    meta: {
      title: '登录',
    },
  },
  {
    path: '/:all(.*)*',
    name: 'notFound',
    component: () => import('@/views/[...all].vue'),
    meta: {
      title: '找不到页面',
    },
  },
]

// 系统路由
const systemRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/index.vue'),
    meta: {
      title: () => useSettingsStore().settings.home.title,
      breadcrumb: false,
    },
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/index.vue'),
        meta: {
          title: () => useSettingsStore().settings.home.title,
          breadcrumb: false,
        },
      },
      {
        path: 'reload',
        name: 'reload',
        component: () => import('@/views/reload.vue'),
        meta: {
          title: '重新加载',
          breadcrumb: false,
        },
      },
      {
        path: 'setting',
        name: 'personalSetting',
        component: () => import('@/views/personal/setting.vue'),
        meta: {
          title: '个人设置',
          cache: 'personalEditPassword',
        },
      },
      {
        path: 'edit/password',
        name: 'personalEditPassword',
        component: () => import('@/views/personal/edit.password.vue'),
        meta: {
          title: '修改密码',
        },
      },
    ],
  },
]

// 动态路由（异步路由、导航栏路由）
const asyncRoutes: Route.recordMainRaw[] = [
  {
    meta: {
      title: '控制台',
      icon: 'sidebar-default',
    },
    children: [
      Console,
    ],
  },
  {
    meta: {
      title: '经营管理',
      icon: 'ep:document-copy',
      auth: ['PM00100000'],
    },
    children: [
      Initiation,
      Approval,
      Tracking,
      Bidding,
      Bid,
      ContractRating,
      Customer,
      Record,
    ],
  },
  {
    meta: {
      title: '生产管理',
      icon: 'ep:list',
      auth: ['PM00200000'],
    },
    children: [
      ProductionProject,
      TaskOrder,
      Supplier,
    ],
  },
  {
    meta: {
      title: '成果管理',
      icon: 'ep:files',
      auth: ['PM00300000'],
    },
    children: [
      Contract,
      Knowledge,
      Qualification,
    ],
  },
  {
    meta: {
      title: '科研管理',
      icon: 'ep:collection',
      auth: ['PM00400000'],
    },
    children: [
      Research,
    ],
  },
  {
    meta: {
      title: '系统设置',
      icon: 'ep:monitor',
      auth: ['PM00500000'],
    },
    children: [
      Person,
      Role,
    ],
  },
  // {
  //   meta: {
  //     title: '演示',
  //     icon: 'sidebar-default',
  //   },
  //   children: [
  //     MultilevelMenuExample,
  //     BreadcrumbExample,
  //   ],
  // },
]

const constantRoutesByFilesystem = generatedRoutes.filter((item) => {
  return item.meta?.enabled !== false && item.meta?.constant === true
})

const asyncRoutesByFilesystem = setupLayouts(generatedRoutes.filter((item) => {
  return item.meta?.enabled !== false && item.meta?.constant !== true && item.meta?.layout !== false
}))

export {
  constantRoutes,
  systemRoutes,
  asyncRoutes,
  constantRoutesByFilesystem,
  asyncRoutesByFilesystem,
}
