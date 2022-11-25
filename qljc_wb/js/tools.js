;(function (global) {
  class LuLib {
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

  global.$lulib = new LuLib()
})(window);
