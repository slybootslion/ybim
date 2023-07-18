import type { RouteRecordRaw } from 'vue-router'

const Layout = () => import('@/layouts/index.vue')

const ProductionProject: RouteRecordRaw = {
  path: '/production-management',
  component: Layout,
  redirect: '/production-management/production-list',
  name: 'productionManagement',
  meta: {
    title: '生产项目管理',
    icon: 'ep:brush',
    auth: ['PM00201000'],
  },
  children: [
    {
      path: 'production-list',
      name: 'productionManagementProjectProductionList',
      component: () => import('@/views/production/project.vue'),
      meta: {
        title: '生产项目管理',
        sidebar: false,
        breadcrumb: false,
        activeMenu: '/production-management',
      },
    },
    {
      path: 'task-detail',
      name: 'productionManagementProjectTaskDetail',
      component: () => import('@/views/production/task-detail.vue'),
      meta: {
        title: '生产任务下单',
        sidebar: false,
        breadcrumb: false,
        activeMenu: '/production-management',
      },
    },
  ],
}

const TaskOrder: RouteRecordRaw = {
  path: '/task-order',
  component: Layout,
  redirect: '/task-order/task',
  name: 'taskOrder',
  meta: {
    title: '任务下单',
    icon: 'ep:folder-add',
    auth: ['PM00201001'],
  },
  children: [
    {
      path: 'task',
      name: 'taskOrderTask',
      component: () => import('@/views/production/task-order.vue'),
      meta: {
        title: '任务下单',
        sidebar: false,
        breadcrumb: false,
        activeMenu: '/task-order',
      },
    },
  ],
}

const Supplier: RouteRecordRaw = {
  path: '/supplier-management',
  component: Layout,
  redirect: '/supplier-management/supplier-list',
  name: 'supplierManagement',
  meta: {
    title: '供应商管理',
    icon: 'ep:box',
    auth: ['PM00202000'],
  },
  children: [
    {
      path: 'supplier-list',
      name: 'supplierManagementProject',
      component: () => import('@/views/production/supplier.vue'),
      meta: {
        title: '供应商管理',
        sidebar: false,
        breadcrumb: false,
        activeMenu: '/supplier-management',
      },
    },
    {
      path: 'supplier-form',
      name: 'supplierManagementProjectSupplierForm',
      component: () => import('@/views/production/supplier-form.vue'),
      meta: {
        title: '供应商登记',
        sidebar: false,
        breadcrumb: false,
        activeMenu: '/supplier-management',
      },
    },
    {
      path: 'supplier-detail',
      name: 'supplierManagementProjectSupplierDetail',
      component: () => import('@/views/production/supplier-detail.vue'),
      meta: {
        title: '供应商详情',
        sidebar: false,
        breadcrumb: false,
        activeMenu: '/supplier-management',
      },
    },
  ],
}

export { ProductionProject, TaskOrder, Supplier }
