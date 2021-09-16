layui.define(['LuUtilsTemplate'], function (exports) {
  const $ = layui.$
  const $form = layui.form
  const $table = layui.table
  const $util = layui.util
  const $element = layui.element
  const $laydate = layui.laydate

  const LuUtilsTemplate = layui.LuUtilsTemplate

  class LuInnerHeader {
    constructor(data, opts = {}) {
      this.data = data
      this.options = opts
      this.containerEl = opts.el || $('.luPageHeader')
      this.renderContentHeader()
      this.rightBtns = $('.contentHeaderRigthBtn')
    }

    renderContentHeader() {
      const data = this.data
      let h = ''
      const len = data.rightHtml?.length
      if (len) {
        for (let i = 0; i < len; i++) {
          const item = data.rightHtml[i]
          const isWeaken = item.isWeaken ? ' btn-weaken' : ''
          const icon = item.icon ? `<span class='iconfont ${item.icon}'></span>` : ''
          h += `<button class='layui-btn contentHeaderRigthBtn btn${isWeaken}'>
                  ${icon}
                  <span>${item.txt}</span>
                </button>`
        }
      }
      this.containerEl.html(`<div class='left'><div class='title'>${data.title}</div></div><div class='right'>${h}</div>`)
    }
  }

  class LuSearchForm {
    constructor(data, opts = {}) {
      this.data = data
      this.options = opts
      this.btnText = opts.btnText || '搜索'
      this.filterStr = opts.filterStr || 'search-form'
      this.submitFilter = opts.submitFilter || 'searchBtn'
      this.containerEl = opts.el || $('.luSearchBox')
      this.submit = opts.submit
      this.$form = null
      this.renderSearchForm()
    }

    renderSearchForm() {
      const data = this.data
      if (!Array.isArray(data)) return false

      let h = ``,
        i = 0,
        dateS,
        dateDOpts

      const len = data.length

      for (; i < len; i++) {
        const item = data[i]
        switch (item.type) {
          case 'text':
            h += _renderText(item)
            break
          case 'select':
            h += _renderSelect(item)
            break
          case 'date-s':
            const { html: ht, domTag: dt } = _renderDateS(item)
            h += ht
            dateS = { ...dt, ...item.options }
            break
          case 'date-d':
            const { html, domTag } = _renderDateD(item)
            h += html
            dateDOpts = { ...domTag, ...item.options }
            break
        }
      }

      this.containerEl.html(
        `<form class='layui-form' lay-filter='${this.filterStr}'>${h}<div class='layui-inline'><button type='button' class='layui-btn btn-weaken' lay-submit lay-filter='${this.submitFilter}'>${this.btnText}</button></div></form>`,
      )

      $form.render()
      this.$form = $form
      this.bindSubmit()
      dateDOpts && bindDateDMethod(dateDOpts)
      dateS && dateSMethod(dateS)
      return $form
    }

    bindSubmit() {
      this.$form.on(`submit(${this.submitFilter})`, () => this.submit && this.submit.call(this, this.$form.val(this.filterStr)))
    }
  }

  class LuTable {
    constructor(data, opts = {}) {
      if (!data) throw new Error('表格渲染需要传入数据')
      this.data = data
      this.$table = $table
      this.queue = []
      const index = layer.load(2)
      const options = {
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
        done() {
          layer.close(index)
        },
        data,
      }

      if (opts.hideHeadCheck) this.queue.push(hideHeadCheck)

      this.options = {
        ...options,
        ...opts,
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

      this.$table.render(this.options)
      this.queue.length && this.queue.forEach(fn => fn())
    }

    tableOn() {
      this.$table.on(`tool(${this.options.filter})`, this.tableEventBind.bind(this))
    }

    tableEventBind(obj) {
      const { methods } = this.options
      if (!methods) return false
      methods[obj.event] && methods[obj.event](obj.data, obj)
    }

    tableCtrlTpl() {
      return _renderTableCtrl(this.options.ctrlData)
    }

    reload(data) {
      this.options.data = data
      this.$table.reload(this.options.id, this.options)
    }

    checkStatus(id = this.options.id) {
      return this.$table.checkStatus(id)
    }
  }

  class LuUpload {
    constructor(opts) {
      this.options = opts
      this.el = typeof opts.el === 'string' ? $(opts.el) : opts.el
      this.elFile = typeof opts.elFile === 'string' ? $(opts.elFile) : opts.elFile
      this.max = opts.max || false
      this.limit = opts.limit || null
      this.multiple = !!opts.multiple
      this.label = opts.label || '选择文件'
      this.desc = opts.desc || ''
      this.success = opts.success
      this.remove = opts.remove
      this.timerWMap = new WeakMap()
      this.files = []
      this.accept = opts.accept || ''
      this.type = opts.type || 'file'
      this.init()
    }

    init() {
      const html = `<input type='file'
                           class='upload-input'
                           id='upload-input'
                           accept='${this.accept}'
                           ${this.multiple ? 'multiple' : ''}/>
                    <label class='layui-btn btn-weaken' for='upload-input'>${this.label}</label>
                    ${this.desc ? `<span class='desc-txt'>${this.desc}</span>` : ''}`
      this.el.html(html)
      this.bindMethod()
    }

    bindMethod() {
      this.el.on('change', '#upload-input', e => {
        const files = e.target.files
        const len = files.length
        for (let i = 0; i < len; i++) {
          const file = files[i]
          if (this.limit) {
            const size = file.size / 1024 / 1024
            if (size > this.limit) {
              layer.msg(file.name + '文件过大')
              return
            }
          }
        }

        if (this.max && (len > this.max || len + this.files.length > this.max)) {
          layer.msg('超过最大上传数')
          return
        }

        this.success && this.success(files)
        this.renderFileList(files)
        this.files = [...this.files, ...files]
      })

      const _this = this
      this.elFile.on('click', '.del-file-icon', function () {
        const pId = $(this).attr('id').replace('R-', 'P-')
        const filename = $(this).data('name')
        const $el = $(`#${pId}`)
        $el && $el.remove()
        _this.remove && _this.remove(filename)
        _this.files = _this.files.filter(f => f.name !== filename)
      })
    }

    async renderFileList(files, type = false) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileName = file.name
        const randomId = $lulib.randomStr(6)
        let h = ''
        let picClass = ''
        if (this.type === 'file') {
          h = `<div class='file-box'>
                  <div class='filename txt-overflow'>${fileName}</div>
                  <div class='del-file-icon'
                       data-name='${fileName}'
                       id='R-${randomId}'>×</div>
                </div>
                <div class='layui-progress' lay-filter='Pr-${randomId}'>
                  <div class='layui-progress-bar layui-bg-blue' lay-percent='0%'></div>
                </div>
              `
        }
        if (this.type === 'picture') {
          let src
          if (file.src && typeof file.src === 'string') {
            src = file.src
          } else {
            src = await $lulib.fileToBase64(file)
          }
          h = `<div class='file-box file-box-img'>
                  <div class='file-img' style='background-image:url(${src});'></div>
                  <div class='del-file-icon'
                       data-name='${fileName}'
                       id='R-${randomId}'>×</div>
                  <div class='layui-progress' lay-filter='Pr-${randomId}'>
                    <div class='layui-progress-bar layui-bg-blue' lay-percent='0%'></div>
                </div>
               </div>`
          picClass = 'pic-type'
        }
        const html = `<div class='upload-file-content ${picClass}' id='P-${randomId}'>
                        ${h}
                      </div>`
        this.elFile.append(html)
        !type && this._setProgressPercentTimer(randomId, file)
        type && removePro(files, this)

        function removePro(f, instance) {
          instance.files = [...f]
          $(`.layui-progress[lay-filter="Pr-${randomId}"]`).remove()
        }
      }
    }

    clearFin(file) {
      const obj = this.timerWMap.get(file)
      if (!obj) return
      $element.progress(`Pr-${obj.rId}`, '100%')
      obj.timer && clearInterval(obj.timer)
      this.timerWMap.delete(file)
      const currentEl = $(`.layui-progress[lay-filter="Pr-${obj.rId}"]`)
      if (currentEl) setTimeout(() => currentEl.remove(), 800)
    }

    _setProgressPercentTimer(rId, file) {
      if (this.timerWMap.get(file)) return false
      let n = 0
      const timer = setInterval(() => {
        n = (n + Math.random() * 27) | 0
        if (n > 98) {
          n = 98
          clearInterval(timer)
        }
        $element.progress(`Pr-${rId}`, `${n}%`)
      }, 1000)
      this.timerWMap.set(file, { timer, rId })
    }
  }

  class LuAreaSelect {
    constructor(options = {}) {
      this.config = {
        elem: options.elem || '',
        title: options.title || '区域选择',
        required: options.required,
        data: {
          province: '',
          city: '',
          county: '',
          provinceCode: 0,
          cityCode: 0,
          countyCode: 0,
        },
        type: options.type || 'normal',
        change: options.change || function (result) {},
      }
      this._id = $lulib.randomStr(6)
      this.areaData = null
      !(async () => {
        this.areaData = await $.getJSON('/htmls/data/china-area-list.json')
      })()
      return this
    }

    getData() {
      return this.config.data
    }

    resetData () {
      this.config.data = {
        city: '',
        cityCode: '',
        county: '',
        countyCode: '',
        province: '',
        provinceCode: '',
      }
    }

    getCode(type, name, parentCode = 0) {
      let code = ''
      if (!this.areaData) this.areaData = []
      let list = this.areaData[type + '_list'] || {}
      let result = {}
      Object.keys(list).map(_code => {
        if (parentCode) {
          if (_code.indexOf(parentCode) === 0) {
            result[_code] = list[_code]
          }
        } else {
          result[_code] = list[_code]
        }
      })
      layui.each(result, (_code, _name) => {
        if (_name === name) {
          code = _code
        }
      })
      return code
    }

    getList(type, code) {
      let result = []
      if (type !== 'province' && !code) return result
      if (!this.areaData) this.areaData = []
      let list = this.areaData[type + '_list'] || {}
      result = Object.keys(list).map(code => {
        return {
          code: code,
          name: list[code],
        }
      })

      if (code) {
        if (code[0] === '9' && type === 'city') {
          code = '9'
        }

        result = result.filter(item => item.code.indexOf(code) === 0)
      }

      return result
    }

    events(options) {
      let provinceFilter = 'province-' + this._id
      let cityFilter = 'city-' + this._id
      let countyFilter = 'county-' + this._id

      const provinceEl = $(`#${this._id}-province`)
      const cityEl = $(`#${this._id}-city`)
      const countyEl = $(`#${this._id}-county`)

      //filter
      if (provinceEl.attr('lay-filter')) {
        provinceFilter = provinceEl.attr('lay-filter')
      }
      if (cityEl.attr('lay-filter')) {
        cityFilter = cityEl.attr('lay-filter')
      }
      if (countyEl.attr('lay-filter')) {
        countyFilter = countyEl.attr('lay-filter')
      }
      provinceEl.attr('lay-filter', provinceFilter)
      cityEl.attr('lay-filter', cityFilter)
      countyEl.attr('lay-filter', countyFilter)
      //获取默认值
      if (provinceEl.data('value')) {
        options.data.province = provinceEl.data('value')
        options.data.provinceCode = this.getCode('province', options.data.province)
      }
      if (cityEl.data('value')) {
        options.data.city = cityEl.data('value')
        options.data.cityCode = this.getCode('city', options.data.city, options.data.provinceCode.slice(0, 2))
      }
      if (countyEl.data('value')) {
        options.data.county = countyEl.data('value')
        options.data.countyCode = this.getCode('county', options.data.county, options.data.cityCode.slice(0, 4))
      }
      provinceEl.attr('lay-filter', provinceFilter)
      cityEl.attr('lay-filter', cityFilter)
      countyEl.attr('lay-filter', countyFilter)

      //监听结果
      $form.on('select(' + provinceFilter + ')', async data => {
        options.data.province = data.value
        options.data.provinceCode = this.getCode('province', data.value)
        await renderCity(options.data.provinceCode)
        options.change(options.data)
      })

      $form.on('select(' + cityFilter + ')', async data => {
        options.data.city = data.value
        if (options.data.provinceCode) {
          options.data.cityCode = this.getCode('city', data.value, options.data.provinceCode.slice(0, 2))
          await renderCounty(options.data.cityCode)
        }
        options.change(options.data)
      })

      $form.on('select(' + countyFilter + ')', async data => {
        options.data.county = data.value
        if (options.data.cityCode) {
          options.data.countyCode = this.getCode('county', data.value, options.data.cityCode.slice(0, 4))
        }
        options.change(options.data)
      })

      const renderCounty = cityCode => {
        let tpl = '<option value="">请选择区</option>'
        let countyList = this.getList('county', cityCode.slice(0, 4))
        let currentCode = ''
        let currentName = ''
        countyList.forEach(_item => {
          if (_item.name === options.data.county) {
            currentCode = _item.code
            currentName = _item.name
          }
          tpl += '<option value="' + _item.name + '">' + _item.name + '</option>'
        })
        options.data.county = currentName
        countyEl.html(tpl)
        countyEl.val(options.data.county)
        $form.render('select')
      }

      const renderCity = provinceCode => {
        let tpl = '<option value="">请选择市</option>'
        let cityList = this.getList('city', provinceCode.slice(0, 2))
        let currentCode = ''
        let currentName = ''
        cityList.forEach(_item => {
          if (_item.name === options.data.city) {
            currentCode = _item.code
            currentName = _item.name
          }
          tpl += '<option value="' + _item.name + '">' + _item.name + '</option>'
        })
        options.data.city = currentName
        cityEl.html(tpl)
        cityEl.val(options.data.city)
        $form.render('select')
        renderCounty(currentCode)
      }

      const renderProvince = () => {
        let tpl = '<option value="">请选择省</option>'
        let provinceList = this.getList('province')
        let currentCode = ''
        let currentName = ''
        provinceList.forEach(_item => {
          if (_item.name === this.config.data.province) {
            currentCode = _item.code
            currentName = _item.name
          }
          tpl += '<option value="' + _item.name + '">' + _item.name + '</option>'
        })
        provinceEl.html(tpl)
        provinceEl.val(options.data.province)
        $form.render('select')
        renderCity(currentCode)
      }

      renderProvince()
    }

    render() {
      const options = {...this.config}
      this._renderContent()
      options.elem = $(options.elem)
      options.bindAction = $(options.bindAction)
      this.events(options)
    }

    _renderContent() {
      const { required = true, title, data, type } = this.config
      const isRequiredObj = {
        className: 'layui-form-label required',
        verify: 'lay-verify="required"',
      }
      if (!required) {
        isRequiredObj.className = 'layui-form-label'
        isRequiredObj.verify = ''
      }
      let typeHtml = `
        <div class='layui-input-inline w155'>
          <select name='county' data-value='${data.county}' id='${this._id}-county' ${isRequiredObj.verify} lay-filter>
            <option>请选择区</option>
          </select>
        </div>
      `
      if (type !== 'normal') {
        typeHtml = ''
      }
      const h = `
        <style>
          #areaPicker .layui-input,
          #areaPicker .layui-input-inline.w155 {
            width: 155px;
          }
        </style>
        <label class='${isRequiredObj.className}'>
          <span>${title}：</span>
        </label>
        <div class='layui-input-inline w155'>
        <select name='province'
                data-value='${data.province}' 
                id='${this._id}-province' ${isRequiredObj.verify} 
                lay-filter>
          <option>请选择省</option>
        </select>
        </div>
        <div class='layui-input-inline w155'>
          <select name='city' data-value='${data.city}' id='${this._id}-city' ${isRequiredObj.verify} lay-filter>
            <option>请选择市</option>
          </select>
        </div>
        ${typeHtml}
      `
      $(this.config.elem).html(h)
    }
  }

  exports('LuCommonTemplate')
  exports('LuInnerHeader', LuInnerHeader)
  exports('LuSearchForm', LuSearchForm)
  exports('LuTable', LuTable)
  exports('LuUpload', LuUpload)
  exports('LuAreaSelect', LuAreaSelect)

  function bindDateDMethod(opts) {
    const { dateEndBox, endInputId, startInputId, endEleStr, noMaxDate } = opts
    const dateEndBoxEle = $(`.${dateEndBox}`)
    const maxDate = $util.toDateString(new Date(), 'yyyy-MM-dd')
    const dateElemStr = {
      start: `#${startInputId}`,
      end: `#${endInputId}`,
    }

    function renderDateInput(elem, done, min = '') {
      const opts = {
        elem,
        theme: '#007fff',
        max: maxDate,
      }
      if (noMaxDate) delete opts.max
      if (done) opts.done = done
      if (min) opts.min = min
      $laydate.render(opts)
    }

    let endEle = $(dateElemStr.end)
    renderDateInput(dateElemStr.start, val => {
      endEle.remove()
      endEle = dateEndBoxEle.append(endEleStr).find(`#${endInputId}`)
      endEle.attr({ disabled: false })
      renderDateInput(dateElemStr.end, null, val)
    })

    dateEndBoxEle.on('click', function () {
      const input = $(this).find('#dateEndInput')
      const isDisable = input.attr('disabled')
      if (isDisable) {
        layer.msg('先选择开始时间')
      }
    })
  }

  function dateSMethod(data) {
    const opts = {
      elem: `#${data.selectDateId}`,
      theme: '#007fff',
    }
    $laydate.render(opts)
  }

  function _renderTableCtrl(list) {
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

  function _renderSelect(data) {
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

  function _renderText(data) {
    const placeholder = data.placeholder || '请输入'
    return `<div class='layui-inline'>
              <label class='layui-form-label'>${data.label}：</label>
              <div class='layui-input-inline inner-input-w155'>
                <input type='text' 
                       name='${data.name}'
                       autocomplete='off' 
                       class='layui-input' 
                       placeholder='${placeholder}'>
              </div>
            </div>`
  }

  function _renderDateS(opts) {
    return LuUtilsTemplate.selectDateTemplate(opts)
  }

  function _renderDateD(data) {
    const { html, domTag } = LuUtilsTemplate.selectDateDoubleTemplate(data.options)
    return { html, domTag }
  }

  function hideHeadCheck() {
    $('.layui-table-header .laytable-cell-checkbox').empty()
  }
})
