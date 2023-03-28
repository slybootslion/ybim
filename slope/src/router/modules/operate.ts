import type { RouteRecordRaw } from 'vue-router'

const Layout = () => import('@/layouts/index.vue')

const Initiation: RouteRecordRaw = {
  path: '/project-initiation',
  component: Layout,
  redirect: '/project-initiation/project-list',
  name: 'project-initiation',
  meta: {
    title: '立项项目管理',
    icon: 'ep:document-add',
  },
  children: [
    {
      path: 'project-list',
      name: 'project-initiation-list',
      component: () => import('@/views/operate/project-list.vue'),
      meta: {
        title: '立项项目管理',
        sidebar: false,
        breadcrumb: false,
        activeMenu: '/project-initiation',
      },
    },
  ],
}

const Approval: RouteRecordRaw = {
  path: '/project-approval',
  component: Layout,
  redirect: '/project-approval/approval',
  name: 'project-approval',
  meta: {
    title: '项目备案立项申请',
    icon: 'ep:finished',
  },
  children: [
    {
      path: 'approval',
      name: 'project-approval-approval',
      component: () => import('@/views/operate/approval.vue'),
      meta: {
        title: '项目备案立项申请',
        sidebar: false,
        breadcrumb: false,
        activeMenu: '/project-approval',
      },
    },
  ],
}

const Tracking: RouteRecordRaw = {
  path: '/tracking-information',
  component: Layout,
  redirect: '/tracking-information/tracking',
  name: 'tracking-information',
  meta: {
    title: '跟踪信息录入',
    icon: 'ep:discount',
  },
  children: [
    {
      path: 'tracking',
      name: 'tracking-information-tracking',
      component: () => import('@/views/operate/tracking.vue'),
      meta: {
        title: '跟踪信息录入',
        sidebar: false,
        breadcrumb: false,
        activeMenu: '/tracking-information',
      },
    },
  ],
}

const Bidding: RouteRecordRaw = {
  path: '/project-bidding',
  component: Layout,
  redirect: '/project-bidding/bidding',
  name: 'project-bidding',
  meta: {
    title: '项目投标申请',
    icon: 'ep:edit-pen',
  },
  children: [
    {
      path: 'bidding',
      name: 'project-bidding-bidding',
      component: () => import('@/views/operate/bidding.vue'),
      meta: {
        title: '项目投标申请',
        sidebar: false,
        breadcrumb: false,
        activeMenu: '/project-bidding',
      },
    },
  ],
}

const Bid: RouteRecordRaw = {
  path: '/register-bid',
  component: Layout,
  redirect: '/register-bid/bid',
  name: 'register-bid',
  meta: {
    title: '登记投标结果',
    icon: 'ep:tickets',
  },
  children: [
    {
      path: 'bid',
      name: 'register-bid-bid',
      component: () => import('@/views/operate/bid.vue'),
      meta: {
        title: '登记投标结果',
        sidebar: false,
        breadcrumb: false,
        activeMenu: '/register-bid',
      },
    },
  ],
}

const ContractRating: RouteRecordRaw = {
  path: '/contract-rating',
  component: Layout,
  redirect: '/contract-rating/level',
  name: 'contract-rating',
  meta: {
    title: '合同评审',
    icon: 'ep:memo',
  },
  children: [
    {
      path: 'level',
      name: 'contract-rating-level',
      component: () => import('@/views/operate/contract.vue'),
      meta: {
        title: '合同评审',
        sidebar: false,
        breadcrumb: false,
        activeMenu: '/contract-rating',
      },
    },
  ],
}

const Customer: RouteRecordRaw = {
  path: '/customer-management',
  component: Layout,
  redirect: '/customer-management/customer',
  name: 'customer-management',
  meta: {
    title: '客户管理',
    icon: 'ep:user',
  },
  children: [
    {
      path: 'customer',
      name: 'customer-management-customer',
      component: () => import('@/views/operate/customer.vue'),
      meta: {
        title: '客户管理',
        sidebar: false,
        breadcrumb: false,
        activeMenu: '/customer-management',
      },
    },
  ],
}

const Record: RouteRecordRaw = {
  path: '/record-management',
  component: Layout,
  redirect: '/record-management/record',
  name: 'record-management',
  meta: {
    title: '备案管理',
    icon: 'ep:suitcase',
  },
  children: [
    {
      path: 'record',
      name: 'record-management-record',
      component: () => import('@/views/operate/record.vue'),
      meta: {
        title: '备案管理',
        sidebar: false,
        breadcrumb: false,
        activeMenu: '/record-management',
      },
    },
  ],
}

export { Initiation, Approval, Tracking, Bidding, Bid, ContractRating, Customer, Record }
