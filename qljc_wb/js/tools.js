;(function (global) {
  class LuLib {
    constructor () {
      this.methodProxy = new BindMethodProxy()
    }

    getAllUrlParams (urls) {
      const url = urls || location.href
      let queryString = url ? url.split('?')[1] : window.location.search.slice(1)
      const obj = {}
      if (!queryString) {
        return obj;
      }
      queryString = queryString.split('#')[0];
      const arr = queryString.split('&')
      for (let i = 0; i < arr.length; i++) {
        const a = arr[i].split('=')
        const paramName = a[0]
        const paramValue = typeof a[1] === 'undefined' ? true : a[1]
        if (paramName.match(/\[(\d+)?]$/)) {
          const key = paramName.replace(/\[(\d+)?]/, '')
          if (!obj[key]) obj[key] = []
          if (paramName.match(/\[\d+]$/)) {
            const index = /\[(\d+)]/.exec(paramName)[1]
            obj[key][index] = paramValue
          } else {
            obj[key].push(paramValue)
          }
        } else {
          if (!obj[paramName]) {
            obj[paramName] = paramValue
          } else if (obj[paramName] && typeof obj[paramName] === 'string') {
            obj[paramName] = [obj[paramName]]
            obj[paramName].push(paramValue)
          } else {
            obj[paramName].push(paramValue)
          }
        }
      }
      return obj;
    }

    domWidthHeight (dom) {
      if (typeof dom === 'string') dom = document.querySelector(dom)
      if (dom instanceof HTMLElement) {
        const r = dom.getBoundingClientRect()
        return { height: r.height, width: r.width }
      }
      return { height: 0, width: 0 }
    }
  }

  class BindMethodProxy {
    constructor () {
      this.bodyBindEventFn = []
    }

    bindMethodProxy (methods) {
      $(methods).each((_, item) => {
        if (typeof item.dom === 'string') item.dom = $(item.dom)
        if (!item.evStr) item.evStr = 'click'
        if (item.dom.selector === 'body') this.bodyBindEventFn.push({ m: item.method, s: item.evStr })
        item.dom.on(item.evStr, item.domStr, item.method)
      })
    }

    offBodyEventFn () {
      if (this.bodyBindEventFn.length) {
        this.bodyBindEventFn.forEach(item => $('body').off(item.s, item.m))
        this.bodyBindEventFn.length = 0
      }
    }
  }

  global.$lulib = new LuLib()
})(window);
