layui.define([], function (exports) {
  const $ = layui.$
  const $form = layui.form
  const $table = layui.table

  const $layer = layui.layer

  const areaSize = {
    b: '1000px',
    m: '800px',
    s: '600px',
  }

  class LuLayer {
    constructor(config) {
      this.config = config
      if (config?.areaSize) {
        config.area = Object.keys(areaSize).includes(config.areaSize) ? areaSize[config.areaSize] : areaSize.b
      }
      this.layerIdx = null
      this.open()
    }

    open() {
      const config = {
        type: 1,
        title: '标题',
        closeBtn: true,
        area: areaSize.b,
        shade: 0.6,
        id: 'layerId' + $lulib.randomStr(3),
        btnAlign: 'c',
        moveType: 1, //拖拽
        ...this.config,
      }
      this.layerIdx = $layer.open(config)
      // 修复框架显示bug
      $('.layui-layer-ico.layui-layer-close.layui-layer-closetrue')
        .css({
          background: 'none',
          fontSize: '16px',
        })
        .html('×')
    }

    close (idx = this.layerIdx) {
      $layer.close(idx)
    }

    static confirm(content, fn, title = '注意', icon = 7) {
      $layer.confirm(content, { icon, title }, function (index) {
        fn && fn()
        $layer.close(index)
      })
    }
  }

  class LuSearchForm {
    constructor (data, options = {}) {
      this.data = data
      if (!Array.isArray(data) && data.length) throw new Error('传入数据参数必须是一个数组，且有数据')
      this.options = options
      this.submitBtnText = options.submitBtnText || '搜索'
      this.clearBtnText = options.clearBtnText || '清除'
      this.filterStr = options.filterStr || 'search-form'
      this.container = options.el || $('.luSearchBox')
      this.submitFilter = options.submitFilter || 'searchBtn'
      this.clearFilter = options.clearFilter || 'clearBtn'
      this.submit = options.submit
      this.form = null
      this.renderSearchForm()
    }

    renderSearchForm () {
      const data = this.data
      let i = 0, len = data.length, h = ''

      for (; i < len; i++) {
        const item = data[i]
        switch (item.type) {
          case 'text':
            h += textTemplate(item)
            break
          case 'select':
            h += selectTemplate(item)
            break
        }
      }

      this.container.html(`
        <form class='layui-form' lay-filter='${this.filterStr}'>
          ${h}
          <div class='layui-inline'>
            <button type='button' class='layui-btn' lay-submit lay-filter='${this.submitFilter}'>${this.submitBtnText}</button>
            <button class='layui-btn btn-weaken' type="reset">${this.clearBtnText}</button>
          </div>
        </form>
      `)

      $form.render()
      this.form = $form
      this.bindSubmit()
      return this.form
    }

    bindSubmit() {
      this.form.on(`submit(${this.submitFilter})`, () => this.submit && this.submit.call(this, this.form.val(this.filterStr)))
    }
  }

  class LuTable {
    constructor (data, options = {}) {
      if (!data) throw new Error('表格渲染需要传入数据')
      this.data = data
      this.table = $table
      this.queue = []
      const index = $layer.load(1)
      const opts = {
        id: 'tb',
        elem: '#tb',
        even: true,
        filter: 'table',
        page: {
          layout: ['prev', 'page', 'next', 'count'],
        },
        loading: true,
        limit: 15,
        limits: [15, 30, 45, 60],
        async done () {
          await $lulib.delay(500)
          $layer.close(index)
        },
        data,
      }

      if (options.hideHeadCheck) this.queue.push(hideHeadCheck)
      this.options = {
        ...opts,
        ...options,
      }
      this.containerEl = this.options.el || $('.luTable')
      if (this.options.methods && this.options.ctrlData) {
        if (!Array.isArray(this.options.ctrlData) && this.options.ctrlData.data) this.options.ctrlData = this.options.ctrlData.data
        const html = this.tableCtrlTpl()
        this.options.cols[0].push({
          title: this.options.ctrlData.title || '操作',
          minWidth: this.options.ctrlData.minWidth || 220,
          toolbar: html,
          align: 'center',
        })
        this.tableOn()
      }
      this.containerEl.html(`<table class='layui-hide' id='${this.options.id}' lay-filter='${this.options.filter}'></table>`)
      this.table.render(this.options)
      this.queue.length && this.queue.forEach(fn => typeof fn === 'function' && fn())
    }

    on(queryStr, cb) {
      this.table.on(queryStr, cb)
    }

    tableOn() {
      this.table.on(`tool(${this.options.filter})`, this.tableEventBind.bind(this))
    }

    tableEventBind(obj) {
      const { methods } = this.options
      if (!methods) return false
      methods[obj.event] && methods[obj.event](obj.data, obj)
    }

    tableCtrlTpl() {
       const list = this.options.ctrlData
      let html = ''
      let i = 0
      let len = list.length
      for (; i < len; i++) {
        const { eventStr, iconStr, txtStr, title } = list[i]
        const t = title ? 'title=' + title : ''
        html += `<a href='javascript:void(0)' class='table-tool-link' lay-event='${eventStr}' ${t}>
                <span class='iconfont ${iconStr}'></span>
                <span>${txtStr || ''}</span>
              </a>`
      }
      return `<span>${html}</span>`
    }

    reload(data) {
      this.options.data = data
      this.table.reload(this.options.id, this.options)
    }

    checkStatus(id = this.options.id) {
      return this.table.checkStatus(id)
    }
  }

  exports('LuCommonTemplate')
  exports('LuLayer', LuLayer)
  exports('LuSearchForm', LuSearchForm)
  exports('LuTable', LuTable)

})

function textTemplate (data) {
  const placeholder = data.placeholder || '请输入'
  const w155 = data.w155 ? 'inner-input-w155' : ''
  return `<div class='layui-inline'>
              <label class='layui-form-label ${w155}'>${data.label}：</label>
              <div class='layui-input-inline'>
                <input type='text' 
                       name='${data.name}'
                       autocomplete='off' 
                       class='layui-input' 
                       placeholder='${placeholder}'>
              </div>
            </div>`
}

function selectTemplate (data) {
  let optionStr = "<option value=''>请选择</option>"
  const len = data.selectData.length
  let i = 0
  for (; i < len; i++) {
    const item = data.selectData[i]
    const s = item.selected ? 'selected' : ''
    optionStr += `<option value='${item.value}' ${s}>${item.key}</option>`
  }
  return `<div class='layui-inline'>
              <label class='layui-form-label'>${data.label}：</label>
              <div class='layui-input-inline inner-input-w155'>
                <select name='${data.name}'>
                  ${optionStr}
                </select>
              </div>
            </div>`
}
