jordanstone.define('utils',exports => {
  const dayjs = jordanstone.dayjs
  const $ = jordanstone.$
  console.log(jordanstone.status)
  console.log(jordanstone.jquery,'-----------')

  class Utils {
    constructor () {
    }

    getFormatTime (formatStr = 'YYYY年MM月DD日 HH:mm:ss', date = new Date()) {
      return dayjs(date).format(formatStr)
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

    ajax (url, dataType = 'json', type = 'get') {
      return new Promise(resolve => {
        $.ajax({
          url,
          type,
          dataType,
          success (data) {
            resolve(data)
          },
          error (xhr) {
            layer.msg('功能页面不存在，稍后再试！')
          },
        })
      })
    }
  }

  const utils = new Utils()
  exports('utils', utils)
})
