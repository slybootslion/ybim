import type { RouteRecordRaw } from 'vue-router'

const Layout = () => import('@/layouts/index.vue')

const Person: RouteRecordRaw = {
  path: '/system-person',
  component: Layout,
  redirect: '/system-person/institution-personnel',
  name: 'system-person',
  meta: {
    title: '机构人员',
    icon: 'ep:user',
    auth: ['PM00501000'],
  },
  children: [
    {
      path: 'institution-personnel',
      name: 'systemInstitutionPersonnel',
      component: () => import('@/views/system/institution-personnel.vue'),
      meta: {
        title: '机构人员',
        sidebar: false,
        breadcrumb: false,
        activeMenu: '/system-person',
      },
    },
  ],
}

const Role: RouteRecordRaw = {
  path: '/system-role',
  component: Layout,
  redirect: '/system-role/role-permissions',
  name: 'system-role',
  meta: {
    title: '角色权限',
    icon: 'ep:lock',
    auth: ['PM00502000'],
  },
  children: [
    {
      path: 'role-permissions',
      name: 'systemRolePermissions',
      component: () => import('@/views/system/role-permissions.vue'),
      meta: {
        title: '角色权限',
        sidebar: false,
        breadcrumb: false,
        activeMenu: '/system-role',
      },
    },
  ],
}

export { Person, Role }
