import useRouteStore from './route'
import useMenuStore from './menu'
import api from '@/api'

const useUserStore = defineStore(
  // 唯一ID
  'user',
  () => {
    const routeStore = useRouteStore()
    const menuStore = useMenuStore()
    const account = ref(sessionStorage.getItem('account') ?? '')
    const token = ref(sessionStorage.getItem('token') ?? '')
    const user_rights = ref(sessionStorage.getItem('user_rights') ?? '')
    // const failure_time = ref(localStorage.failure_time ?? '')
    const permissions = ref<string[]>([])
    const isLogin = computed(() => {
      let retn = false
      if (token.value) {
        // if (new Date().getTime() < parseInt(failure_time.value) * 1000) {
        //   retn = true
        // }
        retn = true
      }
      return retn
    })

    const timerIns = ref(null)

    async function setTimer (ins: any) {
      timerIns.value = ins
    }
    async function clearTimer () {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      (timerIns.value!.simulateClearInterval as Function)()
    }

    // 登录
    async function login(data: {
      account: string
      password: string
    }) {
      // 通过 mock 进行登录
      // const res = await api.post('member/login', data, {
      //   baseURL: '/mock/',
      // })
      // localStorage.setItem('account', res.data.account)
      // localStorage.setItem('token', res.data.token)
      // localStorage.setItem('failure_time', res.data.failure_time)
      // account.value = res.data.account
      // token.value = res.data.token
      // failure_time.value = res.data.failure_time
      const res = await api.post('/index/login', { user_name: data.account, user_password: data.password })
      // localStorage.setItem('account', res.data.user_name)
      // localStorage.setItem('token', res.data.token)
      sessionStorage.setItem('account', res.data.user_name)
      sessionStorage.setItem('token', res.data.token)
      sessionStorage.setItem('user_rights', res.data.user_rights)
      account.value = res.data.user_name
      token.value = res.data.token
    }

    // 登出
    async function logout() {
      // localStorage.removeItem('account')
      // localStorage.removeItem('token')
      sessionStorage.removeItem('account')
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('user_rights')
      // // localStorage.removeItem('failure_time')
      account.value = ''
      token.value = ''
      // failure_time.value = ''
      routeStore.removeRoutes()
      menuStore.setActived(0)
    }

    // 获取我的权限
    async function getPermissions() {
      // 通过 mock 获取权限
      /* const res = await api.get('member/permission', {
        baseURL: '/mock/',
        params: {
          account: account.value,
        },
      })
      permissions.value = res.data.permissions
      return permissions.value */
      permissions.value = user_rights.value.split(',')
      return user_rights.value.split(',')
    }

    // 修改密码
    async function editPassword(data: {
      password: string
      newpassword: string
    }) {
      await api.post('member/edit/password', {
        account: account.value,
        password: data.password,
        newpassword: data.newpassword,
      }, {
        baseURL: '/mock/',
      })
    }

    return {
      account,
      token,
      user_rights,
      permissions,
      isLogin,
      timerIns,
      setTimer,
      clearTimer,
      login,
      logout,
      getPermissions,
      editPassword,
    }
  },
)

export default useUserStore
