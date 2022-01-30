import { promisic } from '../lu-ui/utils/util'
import StorageCache from '../tools/storage-cache'
import config from '../config/index'
import tips from './error-code'

class Http {
  url = ''
  data = null
  method = 'GET'

  async request({ url, data, method = 'GET' }) {
    const token = await StorageCache.getToken()
    let header = {
      'content-type': 'application/x-www-form-urlencoded'
    }

    if (token) header.Authorization = `Bearer ${token}`
    else header.Authorization = `Bearer cHN3X4JhypcZuM3MiTJf96Uze2PC+bayWDnxVHwRR18xNjExODAzMzU31`

    const res = await promisic(wx.request)({
      url: `${config.apiBaseUrl}${url}`,
      method,
      data,
      header,
    })

    const statusCode = res.statusCode.toString()

    if (statusCode.startsWith('2')) {
      const { code, msg } = res.data

      // 处理token过期，返回登录页面
      if (code && code === '10010') {
        await StorageCache.clearStorage()
        wx.reLaunch({
          url: '/pages/login/login',
        })
      }
      // 错误码为"0"
      const { data } = res
      if (data.code === '0') return data.data
      else this._showError(data.code)
      return false
    } else {
      // 状态码非2开头
      this._showError()
      return false
    }
  }

  _showError(code) {
    if (!code) {
      code = '8'
    }

    let tip = tips[code]
    
    if (!tip) tip = tips['8']
    wx.showToast({
      title: tip,
      icon: 'none',
      duration: 2000,
    })
  }
}

export default new Http()
