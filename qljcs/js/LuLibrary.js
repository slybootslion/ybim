;(function (factory) {
  factory(window, layui)
})(function (global, layui) {
  const $ = layui.$

  class LuLib {
    constructor () {
      this.eventBus = new EventBus()
      this.methodProxy = new BindMethodProxy()
    }

    /* get mock method */
    async getMockData (url, count = 40, randomStr = '', idRandom = true) {
      let mock = Array.isArray(url) ? url : await $.getJSON(url)
      let data = []
      let c = 0
      for (let i = 0; i < count; i++) {
        mock.forEach(item => {
          item = { ...item }
          item.id = idRandom ? this.randomStr(6) : ++c
          randomStr = randomStr ? randomStr : 'name'
          if (item[randomStr]) item[randomStr] = item[randomStr] + this.randomStr(3)
          data.push(item)
        })
      }
      return data
    }

    delay (interval = 0) {
      return new Promise(resolve => {
        let timer = setTimeout(_ => {
          clearTimeout(timer)
          resolve()
        }, interval)
      })
    }

    pageReplace (url) {
      window.location.replace(url)
    }

    pagePush (url) {
      window.location.assign(url)
    }

    pageOpen (url) {
      window.open(url)
    }

    randomStr (len) {
      let str = Math.random().toString(36).substr(2)
      if (str.length >= len) return str.substr(0, len)
      str += this.randomStr(0, len)
      return str
    }

    randomInt (maxNum = 100, minNum = 1) {
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
    }

    contentLoad (el = 'body.inner-body') {
      const html = `
        <div class='content-load'>
          <img src='/htmls/images/public/loading.gif' alt='' class='loader-pic'>
        </div>
      `
      if (el === 'body.inner-body') {
        $(el).after(html)
      } else {
        $(el).append(html)
      }
    }

    contentLoadRemove (el = '.content-load') {
      parent.layui.$(el).remove()
    }

    ajax (url, dataType = 'html', type = 'get') {
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

    tableSetCenter (arr, opts = {}) {
      return arr.map((item, idx) => {
        if (opts.filter) {
          !opts.filter.includes(idx) && (item.align = 'center')
        } else {
          item.align = 'center'
        }
        return item
      })
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

    rootEleFontSize () {
      const $html = $('html')
      const d = 750 / 100
      let clientW = $html.width() || 375
      clientW > 750 && (clientW = 750)
      $html.css({ fontSize: clientW / d })
      const $wrapper = $('.wrap-container')
      $lulib.isMobile() ? $wrapper.addClass('mobile-wrapper') : $wrapper.removeClass('mobile-wrapper')
    }

    getAllUrlParams (urls) {
      const url = urls || location.href
      // 用JS拿到URL，如果函数接收了URL，那就用函数的参数。如果没传参，就使用当前页面的URL
      let queryString = url ? url.split('?')[1] : window.location.search.slice(1)
      // 用来存储我们所有的参数
      const obj = {}
      // 如果没有传参，返回一个空对象
      if (!queryString) {
        return obj;
      }
      // stuff after # is not part of query string, so get rid of it
      queryString = queryString.split('#')[0];
      // 将参数分成数组
      const arr = queryString.split('&')
      for (let i = 0; i < arr.length; i++) {
        // 分离成key:value的形式
        const a = arr[i].split('=')
        // 将undefined标记为true
        const paramName = a[0]
        const paramValue = typeof a[1] === 'undefined' ? true : a[1]
        if (paramName.match(/\[(\d+)?\]$/)) {
          // 如果paramName不存在，则创建key
          const key = paramName.replace(/\[(\d+)?\]/, '')
          if (!obj[key]) obj[key] = []
          // 如果是索引数组 e.g. colors[2]
          if (paramName.match(/\[\d+\]$/)) {
            // 获取索引值并在对应的位置添加值
            const index = /\[(\d+)\]/.exec(paramName)[1]
            obj[key][index] = paramValue
          } else {
            // 如果是其它的类型，也放到数组中
            obj[key].push(paramValue)
          }
        } else {
          // 处理字符串类型
          if (!obj[paramName]) {
            // 如果如果paramName不存在，则创建对象的属性
            obj[paramName] = paramValue
          } else if (obj[paramName] && typeof obj[paramName] === 'string') {
            // 如果属性存在，并且是个字符串，那么就转换为数组
            obj[paramName] = [obj[paramName]]
            obj[paramName].push(paramValue)
          } else {
            // 如果是其它的类型，还是往数组里丢
            obj[paramName].push(paramValue)
          }
        }
      }
      return obj;
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

    bindMethod (...args) {
      if (args.length === 1) {
        if (!Array.isArray(args[0])) throw new TypeError('参数类型错误')
        const methods = args[0]
        for (let i = 0; i < methods.length; i++) {
          const el = methods[i].dom
          const fn = methods[i].method
          const evStr = methods[i].evStr
          const bindTarget = methods[i].bindTarget
          onHandle(el, fn, evStr, bindTarget)
        }
        return
      }

      if (args.length <= 3) {
        const el = args[0]
        const fn = args[1]
        const evStr = args[2]
        const bindTarget = args[3]
        onHandle(el, fn, evStr, bindTarget)
      }

      function onHandle (el, fn, evStr = 'click', bindTarget = el) {
        if (el instanceof $) {
          el.on(evStr, fn.bind(bindTarget))
          return
        }
        if (el instanceof HTMLElement) {
          el.addEventListener(evStr, fn.bind(bindTarget))
        }
      }
    }

    pageGoBack () {
      window.history.go(-1)
    }

    fileToBase64 (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise(resolve => {
        reader.onload = function (e) {
          resolve(e.target.result)
        };
      })
    }

    checkSelected (table) {
      const statusData = table.checkStatus().data
      if (!statusData.length) {
        layer.msg('需选中列表复选框')
        return false
      }
      return true
    }

    // icon: 1成功 2错误 3询问
    // anim: -1关闭 6 抖动
    quickMessage (msg, icon = 2, anim = 6) {
      layer.msg(msg, { icon, anim })
    }

    quickPrompt (cb, options = {}) {
      layer.prompt({
        formType: 0,
        value: '',
        maxlength: 500,
        ...options,
      }, (value, index, elem) => {
        cb(value, elem)
        layer.close(index)
      })
    }

    // 是否移动端浏览器
    isMobile () {
      const MOBILE_WIDTH_EDGE = 992
      const rect = document.body.getBoundingClientRect()
      return rect.width - 1 < MOBILE_WIDTH_EDGE
    }

    screenWidthHeight () {
      const sH = screen.availHeight
      const sW = screen.availWidth
      return { sH, sW }
    }

    getFormatTime (formatStr = 'YYYY年MM月DD日 HH:mm:ss', date = new Date()) {
      return dayjs(date).format(formatStr)
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

  class EventBus {
    constructor (events = new Map()) {
      this.events = events
    }

    on (eventKey, fn, force = true) {
      let fnArr = this.events.get(eventKey)
      if (!fnArr) {
        this.events.set(eventKey, [fn])
      } else if (fnArr && force) {
        fnArr = []
        fnArr.push(fn)
      } else {
        fnArr.push(fn)
      }
    }

    emit (eventKey, ...args) {
      const fnArr = this.events.get(eventKey)
      fnArr && fnArr.length && fnArr.forEach(fn => fn.call(this, ...args))
      return true
    }

    remove (eventKey, fn) {
      const fnArr = this.events.get(eventKey)
      if (fnArr && fnArr.length) {
        if (fn && typeof fn === 'function') {
          for (let i = 0; i < fnArr.length; i++) {
            if (fn && fnArr[i] === fn) {
              fnArr.splice(i, 1)
            }
          }
          !fnArr.length && this.events.delete(eventKey)
        } else {
          this.events.delete(eventKey)
        }
      } else {
        return this
      }
    }

    once (eventKey, fn) {
      const once = (...args) => {
        fn(...args)
        this.remove(eventKey)
      }
      this.on(eventKey, once)
    }
  }

  global.LuLib = global.$lulib = new LuLib()
})

!function (t, e) {
  "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (t = "undefined" != typeof globalThis ? globalThis : t || self).dayjs = e();
  t.$lulib.dayjs = dayjs
}(this, (function () {
  "use strict";
  var t = 1e3, e = 6e4, n = 36e5, r = "millisecond", i = "second", s = "minute", u = "hour", a = "day", o = "week",
    f = "month", h = "quarter", c = "year", d = "date", $ = "Invalid Date",
    l = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,
    y = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, M = {
      name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
      months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_")
    }, m = function (t, e, n) {
      var r = String(t);
      return !r || r.length >= e ? t : "" + Array(e + 1 - r.length).join(n) + t
    }, g = {
      s: m, z: function (t) {
        var e = -t.utcOffset(), n = Math.abs(e), r = Math.floor(n / 60), i = n % 60;
        return (e <= 0 ? "+" : "-") + m(r, 2, "0") + ":" + m(i, 2, "0")
      }, m: function t (e, n) {
        if (e.date() < n.date()) return -t(n, e);
        var r = 12 * (n.year() - e.year()) + (n.month() - e.month()), i = e.clone().add(r, f), s = n - i < 0,
          u = e.clone().add(r + (s ? -1 : 1), f);
        return +(-(r + (n - i) / (s ? i - u : u - i)) || 0)
      }, a: function (t) {
        return t < 0 ? Math.ceil(t) || 0 : Math.floor(t)
      }, p: function (t) {
        return {
          M: f, y: c, w: o, d: a, D: d, h: u, m: s, s: i, ms: r, Q: h
        }[t] || String(t || "").toLowerCase().replace(/s$/, "")
      }, u: function (t) {
        return void 0 === t
      }
    }, D = "en", v = {};
  v[D] = M;
  var p = function (t) {
    return t instanceof _
  }, S = function (t, e, n) {
    var r;
    if (!t) return D;
    if ("string" == typeof t) v[t] && (r = t), e && (v[t] = e, r = t); else {
      var i = t.name;
      v[i] = t, r = i
    }
    return !n && r && (D = r), r || !n && D
  }, w = function (t, e) {
    if (p(t)) return t.clone();
    var n = "object" == typeof e ? e : {};
    return n.date = t, n.args = arguments, new _(n)
  }, O = g;
  O.l = S, O.i = p, O.w = function (t, e) {
    return w(t, { locale: e.$L, utc: e.$u, x: e.$x, $offset: e.$offset })
  };
  var _ = function () {
    function M (t) {
      this.$L = S(t.locale, null, !0), this.parse(t)
    }

    var m = M.prototype;
    return m.parse = function (t) {
      this.$d = function (t) {
        var e = t.date, n = t.utc;
        if (null === e) return new Date(NaN);
        if (O.u(e)) return new Date;
        if (e instanceof Date) return new Date(e);
        if ("string" == typeof e && !/Z$/i.test(e)) {
          var r = e.match(l);
          if (r) {
            var i = r[2] - 1 || 0, s = (r[7] || "0").substring(0, 3);
            return n ? new Date(Date.UTC(r[1], i, r[3] || 1, r[4] || 0, r[5] || 0, r[6] || 0, s)) : new Date(r[1], i, r[3] || 1, r[4] || 0, r[5] || 0, r[6] || 0, s)
          }
        }
        return new Date(e)
      }(t), this.$x = t.x || {}, this.init()
    }, m.init = function () {
      var t = this.$d;
      this.$y = t.getFullYear(), this.$M = t.getMonth(), this.$D = t.getDate(), this.$W = t.getDay(), this.$H = t.getHours(), this.$m = t.getMinutes(), this.$s = t.getSeconds(), this.$ms = t.getMilliseconds()
    }, m.$utils = function () {
      return O
    }, m.isValid = function () {
      return !(this.$d.toString() === $)
    }, m.isSame = function (t, e) {
      var n = w(t);
      return this.startOf(e) <= n && n <= this.endOf(e)
    }, m.isAfter = function (t, e) {
      return w(t) < this.startOf(e)
    }, m.isBefore = function (t, e) {
      return this.endOf(e) < w(t)
    }, m.$g = function (t, e, n) {
      return O.u(t) ? this[e] : this.set(n, t)
    }, m.unix = function () {
      return Math.floor(this.valueOf() / 1e3)
    }, m.valueOf = function () {
      return this.$d.getTime()
    }, m.startOf = function (t, e) {
      var n = this, r = !!O.u(e) || e, h = O.p(t), $ = function (t, e) {
        var i = O.w(n.$u ? Date.UTC(n.$y, e, t) : new Date(n.$y, e, t), n);
        return r ? i : i.endOf(a)
      }, l = function (t, e) {
        return O.w(n.toDate()[t].apply(n.toDate("s"), (r ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(e)), n)
      }, y = this.$W, M = this.$M, m = this.$D, g = "set" + (this.$u ? "UTC" : "");
      switch (h) {
        case c:
          return r ? $(1, 0) : $(31, 11);
        case f:
          return r ? $(1, M) : $(0, M + 1);
        case o:
          var D = this.$locale().weekStart || 0, v = (y < D ? y + 7 : y) - D;
          return $(r ? m - v : m + (6 - v), M);
        case a:
        case d:
          return l(g + "Hours", 0);
        case u:
          return l(g + "Minutes", 1);
        case s:
          return l(g + "Seconds", 2);
        case i:
          return l(g + "Milliseconds", 3);
        default:
          return this.clone()
      }
    }, m.endOf = function (t) {
      return this.startOf(t, !1)
    }, m.$set = function (t, e) {
      var n, o = O.p(t), h = "set" + (this.$u ? "UTC" : ""),
        $ = (n = {}, n[a] = h + "Date", n[d] = h + "Date", n[f] = h + "Month", n[c] = h + "FullYear", n[u] = h + "Hours", n[s] = h + "Minutes", n[i] = h + "Seconds", n[r] = h + "Milliseconds", n)[o],
        l = o === a ? this.$D + (e - this.$W) : e;
      if (o === f || o === c) {
        var y = this.clone().set(d, 1);
        y.$d[$](l), y.init(), this.$d = y.set(d, Math.min(this.$D, y.daysInMonth())).$d
      } else $ && this.$d[$](l);
      return this.init(), this
    }, m.set = function (t, e) {
      return this.clone().$set(t, e)
    }, m.get = function (t) {
      return this[O.p(t)]()
    }, m.add = function (r, h) {
      var d, $ = this;
      r = Number(r);
      var l = O.p(h), y = function (t) {
        var e = w($);
        return O.w(e.date(e.date() + Math.round(t * r)), $)
      };
      if (l === f) return this.set(f, this.$M + r);
      if (l === c) return this.set(c, this.$y + r);
      if (l === a) return y(1);
      if (l === o) return y(7);
      var M = (d = {}, d[s] = e, d[u] = n, d[i] = t, d)[l] || 1, m = this.$d.getTime() + r * M;
      return O.w(m, this)
    }, m.subtract = function (t, e) {
      return this.add(-1 * t, e)
    }, m.format = function (t) {
      var e = this;
      if (!this.isValid()) return $;
      var n = t || "YYYY-MM-DDTHH:mm:ssZ", r = O.z(this), i = this.$locale(), s = this.$H, u = this.$m, a = this.$M,
        o = i.weekdays, f = i.months, h = function (t, r, i, s) {
          return t && (t[r] || t(e, n)) || i[r].substr(0, s)
        }, c = function (t) {
          return O.s(s % 12 || 12, t, "0")
        }, d = i.meridiem || function (t, e, n) {
          var r = t < 12 ? "AM" : "PM";
          return n ? r.toLowerCase() : r
        }, l = {
          YY: String(this.$y).slice(-2), YYYY: this.$y, M: a + 1, MM: O.s(a + 1, 2, "0"), MMM: h(i.monthsShort, a, f, 3),
          MMMM: h(f, a), D: this.$D, DD: O.s(this.$D, 2, "0"), d: String(this.$W), dd: h(i.weekdaysMin, this.$W, o, 2),
          ddd: h(i.weekdaysShort, this.$W, o, 3), dddd: o[this.$W], H: String(s), HH: O.s(s, 2, "0"), h: c(1), hh: c(2),
          a: d(s, u, !0), A: d(s, u, !1), m: String(u), mm: O.s(u, 2, "0"), s: String(this.$s), ss: O.s(this.$s, 2, "0"),
          SSS: O.s(this.$ms, 3, "0"), Z: r
        };
      return n.replace(y, (function (t, e) {
        return e || l[t] || r.replace(":", "")
      }))
    }, m.utcOffset = function () {
      return 15 * -Math.round(this.$d.getTimezoneOffset() / 15)
    }, m.diff = function (r, d, $) {
      var l, y = O.p(d), M = w(r), m = (M.utcOffset() - this.utcOffset()) * e, g = this - M, D = O.m(this, M);
      return D = (l = {}, l[c] = D / 12, l[f] = D, l[h] = D / 3, l[o] = (g - m) / 6048e5, l[a] = (g - m) / 864e5, l[u] = g / n, l[s] = g / e, l[i] = g / t, l)[y] || g, $ ? D : O.a(D)
    }, m.daysInMonth = function () {
      return this.endOf(f).$D
    }, m.$locale = function () {
      return v[this.$L]
    }, m.locale = function (t, e) {
      if (!t) return this.$L;
      var n = this.clone(), r = S(t, e, !0);
      return r && (n.$L = r), n
    }, m.clone = function () {
      return O.w(this.$d, this)
    }, m.toDate = function () {
      return new Date(this.valueOf())
    }, m.toJSON = function () {
      return this.isValid() ? this.toISOString() : null
    }, m.toISOString = function () {
      return this.$d.toISOString()
    }, m.toString = function () {
      return this.$d.toUTCString()
    }, M
  }(), b = _.prototype;
  return w.prototype = b, [["$ms", r], ["$s", i], ["$m", s], ["$H", u], ["$W", a], ["$M", f], ["$y", c], ["$D", d]].forEach((function (t) {
    b[t[1]] = function (e) {
      return this.$g(e, t[0], t[1])
    }
  })), w.extend = function (t, e) {
    return t.$i || (t(e, _, w), t.$i = !0), w
  }, w.locale = S, w.isDayjs = p, w.unix = function (t) {
    return w(1e3 * t)
  }, w.en = v[D], w.Ls = v, w.p = {}, w
}));

!function (_, e) {
  "object" == typeof exports && "undefined" != typeof module ? module.exports = e(require("dayjs")) : "function" == typeof define && define.amd ? define(["dayjs"], e) : _.dayjs_locale_zh_cn = e(_.dayjs);
  $lulib.dayjs.locale('zh-cn');
}(this, function (_) {
  "use strict";
  _ = _ && _.hasOwnProperty("default") ? _.default : _;
  var e = {
    name: "zh-cn", weekdays: "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"), weekdaysShort: "周日_周一_周二_周三_周四_周五_周六".split("_"),
    weekdaysMin: "日_一_二_三_四_五_六".split("_"), months: "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),
    monthsShort: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"), ordinal: function (_, e) {
      switch (e) {
        case"W":
          return _ + "周";
        default:
          return _ + "日"
      }
    }, weekStart: 1, yearStart: 4, formats: {
      LT: "HH:mm", LTS: "HH:mm:ss", L: "YYYY/MM/DD", LL: "YYYY年M月D日", LLL: "YYYY年M月D日Ah点mm分",
      LLLL: "YYYY年M月D日ddddAh点mm分", l: "YYYY/M/D", ll: "YYYY年M月D日", lll: "YYYY年M月D日 HH:mm", llll: "YYYY年M月D日dddd HH:mm"
    }, relativeTime: {
      future: "%s内", past: "%s前", s: "几秒", m: "1 分钟", mm: "%d 分钟", h: "1 小时", hh: "%d 小时", d: "1 天", dd: "%d 天",
      M: "1 个月", MM: "%d 个月", y: "1 年", yy: "%d 年"
    }, meridiem: function (_, e) {
      var t = 100 * _ + e;
      return t < 600 ? "凌晨" : t < 900 ? "早上" : t < 1130 ? "上午" : t < 1230 ? "中午" : t < 1800 ? "下午" : "晚上"
    }
  };
  return _.locale(e, null, !0), e
});
