layui.define(exports => {
  const $ = layui.$

  class LuUtils {
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
  }

  exports('LuUtils', new LuUtils)
})
