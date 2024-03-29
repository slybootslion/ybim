import axios from 'axios'
// import qs from 'qs'
import { ElMessage } from 'element-plus'
import router from '@/router/index'
import useUserStore from '@/store/modules/user'
import { filterMoreField } from '@/utils/tools'

const toLogin = () => {
  useUserStore().logout().then(() => {
    router.push({
      path: '/login',
      query: {
        redirect: router.currentRoute.value.path !== '/login' ? router.currentRoute.value.fullPath : undefined,
      },
    })
  })
}
export const baseURL = (import.meta.env.DEV && import.meta.env.VITE_OPEN_PROXY === 'true') ? '/proxy/' : import.meta.env.VITE_APP_API_BASEURL
const api = axios.create({
  baseURL,
  timeout: 1000 * 60,
})

api.interceptors.request.use(
  (request) => {
    const userStore = useUserStore()
    /**
     * 全局拦截请求发送前提交的参数
     * 以下代码为示例，在请求头里带上 token 信息
     */
    // if (request.method === 'post') {
    //   request.headers.setContentType('application/x-www-form-urlencoded')
    // }
    request.headers.setContentType('application/x-www-form-urlencoded')
    if (userStore.isLogin && request.headers) {
      // request.headers.Token = userStore.token
      // request.headers.Authorization = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJCSjAwMDE1QzY4OTQiLCJpYXQiOjE2Nzk4OTkzMDksImV4cCI6MTY3OTk0MjUwOX0.BqjSXntLUb98ziP6pYCx5PCZTkZeZfcZpkYqwQXPl9o'
      request.headers.Authorization = userStore.token
      // request.headers.FJOASIJFOAIJSDF = 'aaaaa'
    }
    if (request.method === 'post' && request.data) {
      let hasFile = false
      Object.keys(request.data).forEach((key) => {
        if (typeof request.data[key] === 'object') {
          const item = request.data[key]
          if (item instanceof FileList
            || item instanceof File
            || item instanceof Blob) {
            hasFile = true
          }
        }
      })
      // 检测到存在文件使用FormData提交数据
      if (hasFile) {
        const formData = new FormData()
        Reflect.ownKeys(request.data).forEach(key => formData.append(key as string, request.data[key]))
        request.data = formData
      }
    }
    if (request.method === 'post' && !(request.data instanceof FormData)) request.data = filterMoreField(request.data)
    // 是否将 POST 请求参数进行字符串化处理
    // if (request.method === 'post') {
    // request.data = qs.stringify(request.data, {
    //   arrayFormat: 'brackets',
    // })
    // }
    return request
  },
)

api.interceptors.response.use(
  (response) => {
    /**
     * 全局拦截请求发送后返回的数据，如果数据有报错则在这做全局的错误提示
     * 假设返回数据格式为：{ status: 1, error: '', data: '' }
     * 规则是当 status 为 1 时表示请求成功，为 0 时表示接口需要登录或者登录状态失效，需要重新登录
     * 请求出错时 error 会返回错误信息
     */
    // if (response.data.status === 1) {
    //   if (response.data.error !== '') {
    //     // 这里做错误提示，如果使用了 element plus 则可以使用 Message 进行提示
    //     // ElMessage.error(options)
    //     return Promise.reject(response.data)
    //   }
    // }
    // else {
    //   toLogin()
    // }
    if (response.data.code !== 0) {
      ElMessage.error(response.data.msg)
      if (response.data.code === 1000) {
        window.open('https://manage.baijiagroup.com/api/weixin/', '_self')
      }
    }
    return Promise.resolve(response.data)
  },
  (error) => {
    if (error.config.url === '/down/toDo') {
      console.log('--error--')
      return Promise.reject(error)
    }
    let message = error.message
    if (message === 'Network Error') {
      message = '后端网络故障'
    } else if (message.includes('timeout')) {
      message = '接口请求超时'
    } else if (message.includes('Request failed with status code')) {
      message = `接口${message.substr(message.length - 3)}异常`
    }
    ElMessage({
      message,
      type: 'error',
    })
    return Promise.reject(error)
  },
)

export default api
