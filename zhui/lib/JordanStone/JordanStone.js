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
      this.doc = global.document
      this.config = {
        modules: {}, // 模块路径
        builtin: {
          utils: 'utils',
          jquery: 'jquery',
          all: 'all',
        }
      }
      global.JORDAN_GLOBAL = {}
      this.path = this.getPath()
      if (!this.config.host) this.config.host = (this.path.match(/\/\/([\s\S]+?)\//) || ['//' + location.host + '/'])[0]
    }

    // 获取所在目录
    getPath () {
      const doc = this.doc
      const jsPath = doc.currentScript ? doc.currentScript.src : (() => {
        const js = doc.scripts
        const last = js.length - 1
        let src
        for (let i = 0; i < last; i++) {
          if (js[i].readyState === 'interactive') {
            src = js[i].src
            break
          }
          return src || js[last].src
        }
      })()

      return this.config.dir = JORDAN_GLOBAL.dir || jsPath.substring(0, jsPath.lastIndexOf('/') + 1)
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


    // 使用模块
    use (modelNames, callback, from, exports = [],) {
      const doc = this.doc
      const dir = this.config.dir ? this.config.dir : this.path
      const headTag = doc.querySelector('head')
      const host = this.config.host

      // 判断所要加载的模块
      modelNames = (() => {
        if (typeof modelNames === 'string') return [modelNames]
        if (Array.isArray(modelNames) && !modelNames.length) return ['all']
        else if (typeof modelNames === 'function') {
          callback = modelNames
          return ['all']
        }
        return modelNames
      })()

      // 如果全局已经有jQuery，不加载模块内置jQuery
      if (global.jQuery && jQuery.fn.on) {
        this.each(global, (idx, module) => {
          if (module === 'jquery') modelNames.split(idx, 1)
        })
        global.jordanstone.jquery = global.jordanstone.$ = jQuery
      }

      let item = modelNames[0]
      const modules = this.config.builtin
      const urls = (modules[item] ? (dir + 'modules/') : (/^\{\/\}/.test(modules[item]) ? '' : (this.config.base || ''))) + (modules[item] || item) + '.js'
      const url = urls.replace(/^\{\/\}/, '')
      if (!this.config.modules[item] && jordanstone[item]) this.config.modules[item] = url

      if (!this.config.modules[item]) {
        const node = doc.createElement('script')
        node.async = true
        node.src = url + (() => `?v=${(new Date()).getTime()}`)()
        headTag.appendChild(node)
        node.addEventListener('load', (e) => onScriptLoad(e, url, node), false)
      }


      function onScriptLoad (e, url, node) {
        if (e.type === 'load') {
          this.config.modules[item] = url
          headTag.removeChild(node)
          // todo use轮询
        }
      }
    }

    // 定义模块
    define (modelName, callback) {
      if (typeof modelName === 'function') {
        callback = modelName
        modelName = []
      }

    }
  }

  global.jordanstone = new JordanStone()
}(window)
