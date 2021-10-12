layui.define([], function (exports) {
  const $ = layui.$
  const $form = layui.form

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

  exports('LuCommonTemplate')
  exports('LuSearchForm', LuSearchForm)
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
