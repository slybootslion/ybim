layui.define(exports => {
  const $ = layui.$

  class LuUtils {
    constructor () {
      this.global = {}
    }

    pagePushHash (url, data = null, type = false) {
      let paramStr = ''
      if (data) {
        paramStr = '?'
        for (const key in data) {
          paramStr += `${key}=${data[key]}&`
        }
      }
      paramStr = paramStr.substring(0, paramStr.length - 1)
      if (!type) window.location.hash = `/${url}${paramStr}`
      else {
        window.location.replace(`#/${url}${paramStr}`)
      }
    }

    getHash (hash = '') {
      const reg = /^#\//
      if (!hash) {
        return location.hash.replace(reg, '')
      } else {
        return hash.replace(reg, '')
      }
    }

    getHashNoParams () {
      return location.hash.replace(/^#\//, '').split('?')[0]
    }

    getHashParams () {
      const hash = parent.location.hash
      if (!hash) return
      const paramsStr = hash.split('?')[1]
      if (!paramsStr) return {}
      const paramArr = paramsStr.split('&')
      const params = {}
      paramArr.forEach(str => {
        const arr = str.split('=')
        params[arr[0]] = arr[1]
      })
      return params
    }

    getFormatTime (formatStr = 'YYYY年MM月DD日 HH:mm:ss', date = new Date()) {
      return dayjs(date).format(formatStr)
    }

    ajax (url, opts = {}, type = 'get') {
      return new Promise(resolve => {
        $.ajax({
          url, type,
          ...opts,
          success (data) {
            resolve(data)
          },
          error (xhr) {
            layer.msg('请求错误或功能页面不存在，稍后再试')
          }
        })
      })
    }

    delay (interval = 0) {
      return new Promise(resolve => {
        let timer = setTimeout(_ => {
          clearTimeout(timer)
          resolve()
        }, interval)
      })
    }
  }

  exports('LuUtils', new LuUtils)
})
