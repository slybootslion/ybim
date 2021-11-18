/*
* JordanStone
* Modular development scheme based on traditional JavaScript
* by Lu Gang
* MIT Licensed
* 基于传统JavaScript的模块化开发方案
* */
"use strict";
;!function (global) {
  class JordanStone {
    constructor () {
      this.v = '0.0.1'
      this.doc = global.document
      this.config = {
        modules: {}, // 模块路径
        timeout: 10,
        callback: {},
      }
      this.status = {}
      this.modules = {
        jquery: 'jquery',
        utils: 'utils',
        echarts: 'echarts.min'
      }
      global.GLOBAL = {}
      this.path = this.getPath()
      this.config.host = (this.path.match(/\/\/([\s\S]+?)\//) || ['//' + location.host + '/'])[0]
    }

    config (opts) {
      this.config = {
        ...this.config,
        ...opts
      }
      this.init()
    }

    bindScript (name, src) {
      const { modules, doc } = this
      const headTag = doc.querySelector('head')
      const onScriptLoad = (e, node, name) => {
        headTag.removeChild(node)
        this.status[name] = true
      }

      this.config.modules[name] = src
      const node = doc.createElement('script')
      node.async = true
      node.src = src
      headTag.appendChild(node)
      node.addEventListener('load', function (e) {
        onScriptLoad(e, node, name);
      }, false);
    }

    init () {
      const { modules } = this
      const moduleKeys = Object.keys(modules)
      moduleKeys.forEach(key => this.status[key] = false)
      const baseModulePath = this.path + 'modules'
      moduleKeys.forEach(key => this.bindScript(key, `${baseModulePath}/${modules[key]}.js`))
    }

    define (method) {
      method && method(this.exports.bind(this))
      return this
    }

    use (callback) {
      let timeout = 0
      const poll = () => {
        if (++timeout > this.config.timeout * 1000 / 4) {
          this.handlerError('模块加载失败')
          return
        }
        Object.values(this.status).every(state => state) ? callback && callback() : setTimeout(poll, 4)
      }
      poll()
    }

    extend (obj) {
      const keys = Object.keys(obj)
      this.status[keys] = false
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        const path = `${this.path}/${obj[key]}.js`
        this.bindScript(key, path)
      }
    }

    exports (moduleName, module) {
      if (!this) return
      this[moduleName] = module
    }

    // 获取所在目录
    getPath () {
      return (() => {
        const jsPath = this.doc.currentScript.src
        return this.config.dir = GLOBAL.dir || jsPath.substring(0, jsPath.lastIndexOf('/') + 1);
      })()
    }

    // 异常错误处理
    handlerError (msg, type = 'log') {
      console && console[type]('JORDAN STONE ERROR:' + msg)
    }

    // 内置each方法
    each (obj, callback) {
      if (typeof obj !== 'object' || obj === null) return
      if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
          const item = obj[i]
          callback && callback.call(callback, i, item)
        }
      } else {
        const keys = Object.keys(obj)
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i]
          callback && callback.call(callback, key, obj[key])
        }
      }
      return this
    }
  }

  global.jordanstone = new JordanStone()
  global.jordanstone.init()
}(window)
