layui.define(exports => {
  const $ = layui.$

  class LuUtils {
    constructor () {
      this.global = {}
    }

    pageReplace (url) {
      location.replace(url)
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
          url,
          type,
          ...opts,
          success (data) {
            resolve(data)
          },
          error (xhr) {
            console.log(xhr)
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

    _checkDom (dom) {
      if (typeof dom === 'string') dom = document.querySelector(dom)
      if (dom instanceof HTMLElement) return dom
    }

    domWidthHeight (dom) {
      dom = this._checkDom(dom)
      if (dom) {
        const r = dom.getBoundingClientRect()
        return { height: r.height, width: r.width }
      }
      return { height: 0, width: 0 }
    }

    domTopLeft (dom) {
      dom = this._checkDom(dom)
      if (dom) {
        const { top, left } = dom.getBoundingClientRect()
        return { top, left }
      }
      return { top: 0, left: 0 }
    }
  }

  exports('LuUtils', new LuUtils)
})
