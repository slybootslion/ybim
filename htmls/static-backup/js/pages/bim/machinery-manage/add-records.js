layui.use(['LuCommonTemplate', 'LuLayer'], function () {
  const $ = layui.$
  const laydate = layui.laydate
  const form = layui.form

  const LuInnerHeader = layui.LuInnerHeader
  const LuUpload = layui.LuUpload
  let URL = 'bim/machinery-manage/equipment-ledger'

  let params, luInnerHeader, luUpload

  class PageTemplate {
    renderTop(info) {
      const { type } = params
      let title = type === 'm' ? '添加检修记录' : '添加使用记录'
      const dict = {
        d2: '设备编号',
        d3: '规格型号',
        d4: '进场日期',
      }
      let h = ''
      Object.keys(dict).forEach(item => {
        const i = info[item]
        h += `<div class='layui-form-item'>
                <label class='layui-form-label'>${dict[item]}：</label>
                <div class='layui-input-block'>
                  <span class='info'>${i}</span>
                </div>
               </div>`
      })
      const html = `<h3 class='top-header'>${title}</h3>
                    <div class='content-head'>
                      <span>设备信息</span>
                    </div>
                    <div class='content-body content-form'>
                      <div class='layui-form-item layui-form-text textarea-box'>
                        <label class='layui-form-label'>设备名称：</label>
                        <div class='layui-input-block'>
                           <span class='info'>${info.d1}</span>
                           <button class='layui-btn layui-btn-sm btn-weaken'>选择设备</button>
                        </div>
                      </div>
                      ${h}
                    </div>`
      $('.page-container .top').html(html)
    }

    renderMaintenanceBottomForm(data) {
      const dict = [
        { label: '故障时间', type: 'date', id: 'f1', name: 'f1' },
        { label: '检修时间', type: 'date', id: 'f2', name: 'f2' },
        { label: '故障现象', type: 'textarea', name: 'f3' },
        { label: '检修内容', type: 'textarea', name: 'f4' },
        { label: '试运情况', type: 'text', name: 'f5' },
        { label: '修后状态', type: 'text', name: 'f6' },
      ]
      let isEdit = false
      if (data) {
        isEdit = true
        dict.forEach(item => {
          switch (item.label) {
            case '故障时间':
              item.editData = data.t1
              break
            case '检修时间':
              item.editData = data.d1
              break
            case '故障现象':
              item.editData = data.d2
              break
            case '检修内容':
              item.editData = data.d3
              break
            case '试运情况':
              item.editData = data.d4
              break
            case '修后状态':
              item.editData = data.d5
              break
          }
        })
      }
      let h = ''
      const dateIds = []
      for (let i = 0; i < dict.length; i++) {
        const item = dict[i]
        switch (item.type) {
          case 'date':
            const { html, id } = this._formDate(item)
            h += html
            dateIds.push(id)
            break
          case 'textarea':
            h += this._formTextarea(item)
            break
          case 'text':
            h += this._formInput(item)
            break
        }
      }

      h += `<div class='layui-form-item'>
              <label class='layui-form-label'>附件上传：</label>
              <div class='add-records-upload-box'>
                <div class='file-box' id='fileBox'></div>
                <div class='upload-file-placeholder'></div>
              </div>
            </div>`

      const html = `<div class='content-head'>
                      <span>检修信息</span>
                    </div>
                    <div class='content-body content-form layui-form'
                         lay-filter='bottomForm'>
                      ${h}
                    </div>
                    <div class='btn-content'>
                      <button class='layui-btn submit'>保存</button>
                    </div>`
      $('.page-container .bottom-form').html(html)
      dateIds.length &&
        dateIds.forEach(id =>
          laydate.render({
            elem: `#${id}`,
            theme: '#007fff',
            done: this.dataChange,
          }),
        )

      const opts = {
        el: '#fileBox',
        elFile: '.upload-file-placeholder',
        success(files) {
          for (let i = 0; i < files.length; i++) {
            const file = files[i]
            // mock
            setTimeout(() => luUpload.clearFin(file), $lulib.randomInt(10, 3) * 750)
          }
        },
      }
      luUpload = new LuUpload(opts)
      isEdit && luUpload.renderFileList([{ name: data.d6.name }], true)
    }

    renderUsageBottomForm(sel, data) {
      const dict = [
        { label: '使用部门', type: 'select', name: 'f1', selectData: sel },
        { label: '使用人', type: 'text', name: 'f2' },
        { label: '使用时间', type: 'date', id: 'f1', name: 'f3' },
        { label: '归还时间', type: 'date', id: 'f2', name: 'f4' },
      ]
      if (data) {
        dict.forEach(item => {
          switch (item.label) {
            case '使用部门':
              item.editData = data.d1
              break
            case '使用人':
              item.editData = data.d2
              break
            case '使用时间':
              item.editData = data.d3
              break
            case '归还时间':
              item.editData = data.d4
              break
          }
        })
      }
      let h = ''
      const dateIds = []
      let i = 0
      for (; i < dict.length; i++) {
        const item = dict[i]
        switch (item.type) {
          case 'text':
            h += this._formInput(item)
            break
          case 'select':
            h += this._formSelect(item)
            break
          case 'date':
            const { html, id } = this._formDate(item)
            h += html
            dateIds.push(id)
            break
        }
      }
      const html = `<div class='content-head'>
                      <span>检修信息</span>
                    </div>
                    <div class='content-body content-form layui-form'
                         lay-filter='bottomForm'>
                      ${h}
                    </div>
                    <div class='btn-content'>
                      <button class='layui-btn submit'>保存</button>
                    </div>`
      $('.page-container .bottom-form').html(html)
      dateIds.length &&
        dateIds.forEach(id =>
          laydate.render({
            elem: `#${id}`,
            theme: '#007fff',
            done: this.dataChange,
          }),
        )
      form.render()
    }

    dataChange(value, date) {
      console.log(value)
      console.log(date)
    }

    _formDate(item) {
      return {
        html: `<div class='layui-form-item'>
                <label class='layui-form-label'>${item.label}：</label>
                <div class='layui-input-block'>
                  <input id='${item.id}' 
                         name='${item.name}' 
                         placeholder='请输入' 
                         autocomplete='off'
                         value='${item.editData || ''}'
                         class='layui-input'>
                </div>
              </div>`,
        id: item.id,
      }
    }

    _formTextarea(item) {
      return `<div class='layui-form-item'>
                <label class='layui-form-label'>${item.label}：</label>
                <div class='layui-input-block'>
                  <textarea name='${item.name}'
                            placeholder='请输入'
                            class='layui-textarea'>${item.editData || ''}</textarea>
                </div>
              </div>`
    }

    _formInput(item) {
      return `<div class='layui-form-item'>
                <label class='layui-form-label'>${item.label}：</label>
                <div class='layui-input-block'>
                  <input name='${item.name}' 
                         placeholder='请输入' 
                         autocomplete='off'
                         value='${item.editData || ''}' 
                         class='layui-input'>
                </div>
              </div>`
    }

    _formSelect(data) {
      let optionStr = "<option value=''>请选择</option>"
      const len = data.selectData.length
      let i = 0
      for (; i < len; i++) {
        const item = data.selectData[i]
        const selected = item.key === data.editData ? 'selected' : ''
        optionStr += `<option ${selected} value='${item.value}'>${item.key}</option>`
      }
      return `<div class='layui-form-item select-w90'>
                <label class='layui-form-label'>${data.label}：</label>
                <div class='layui-input-block'>
                  <select name='${data.name}'>
                    ${optionStr}
                  </select>
                </div>
              </div>`
    }
  }

  const pt = new PageTemplate()

  ;(async () => {
    innerHeaderRender()
    await initParams()
    await initBody()
  })()

  async function initParams() {
    params = $lulib.getHashParams()
    if (params.from && params.from === 'rental')
      URL = 'bim/machinery-manage/rental-equipment'
  }

  function innerHeaderRender() {
    luInnerHeader = new LuInnerHeader({
      title: '设备台账',
      rightHtml: [{ txt: '返回', isWeaken: true }],
    })
  }

  // mock data
  async function machineryInfo(id) {
    return new Promise(resolve => {
      resolve({
        d1: 'BJ2021-02150015高压起重机',
        d2: 'BJ2021-02150015',
        d3: 'HD-YCC',
        d4: '2021-05-01',
      })
    })
  }

  async function initBody() {
    const { type, id } = params
    const info = await machineryInfo(id)
    type === 'm' ? renderMaintenance(info) : renderUsage(info)
  }

  // mock
  async function formMaintenanceData() {
    return new Promise(resolve => resolve({
      "t1": "2021-04-12",
      "d1": "2019-03-12",
      "d2": "故障现象表面有裂痕，剐蹭等显现，故障现象表面有裂痕，剐蹭等显现，需要重新清理。",
      "d3": "表面裂痕已修复，并且进行养护，表面裂痕已修复，并且进行维护，表面裂痕已修复，并且进行养护，表面裂痕已修复，并且进行维护。",
      "d4": "良好",
      "d5": "可以正常使用",
      "d6": {
        "name": "检修正常画面.jpg",
        "link": "http://img5.cehome.com/170724/9149b5c7146b50d44af8a61c57b97b21_1.jpg"
      }
    }))
  }

  async function formUsageData() {
    return new Promise(resolve => resolve({
      "t1": "2021-04-12",
      "d1": "部门1",
      "d2": "张工",
      "d3": "2021-04-15",
      "d4": "2021-05-12"
    }))
  }

  async function renderMaintenance(info) {
    pt.renderTop(info)
    const { itemId } = params
    let data
    if (itemId) data = await formMaintenanceData()
    pt.renderMaintenanceBottomForm(data)
  }

  async function renderUsage(info) {
    const sel = await new Promise(resolve =>
      resolve([
        { value: 1, key: '部门1' },
        { value: 2, key: '部门2' },
      ]),
    )
    pt.renderTop(info)
    const { itemId } = params
    let data
    if (itemId) data = await formUsageData()
    pt.renderUsageBottomForm(sel, data)
  }

  $lulib.bindMethod([{ dom: luInnerHeader.rightBtns[0], method: back }])

  $lulib.methodProxy.bindMethodProxy([{ dom: 'body', domStr: '.submit', method: submit }])

  function submit() {
    const data = form.val('bottomForm')
    console.log(data)
  }

  function back() {
    $lulib.pagePushHash(URL, true)
  }
})
