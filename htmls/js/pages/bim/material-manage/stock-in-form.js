layui.use(['LuCommonTemplate', 'LuLayer'], function () {
  const $ = layui.$
  const form = layui.form
  const table = layui.table
  const laydate = layui.laydate

  const LuInnerHeader = layui.LuInnerHeader
  const LuUpload = layui.LuUpload
  const LuLayer = layui.LuLayer

  let pageId,
    luInnerHeader,
    luLayer,
    innerTable,
    innerTableCurrentId,
    innerTableData,
    currents = [],
    luUpload,
    tableOpts = {
      elem: '#innerTableBox',
      page: true,
      limit: 15,
      cols: [
        $lulib.tableSetCenter([
          { type: 'checkbox', width: 50 },
          { field: 't1', title: '材料名称', width: 200 },
          { field: 't2', title: '规格型号', width: 200 },
          { field: 't3', title: '单位', width: 100 },
          { field: 't4', title: '当前库存', width: 110 },
          {
            title: '入库数量',
            toolbar: `<span><input type='number'
                                   lay-event='input'
                                   class='layui-input input1' 
                                   placeholder='请输入'></span>`,
            width: 180,
          },
          {
            title: '单价（元）',
            toolbar: `<span><input type='number' 
                                   lay-event='input'
                                   class='layui-input input2'
                                   placeholder='请输入'></span>`,
            width: 180,
          },
          {
            title: '金额',
            templet: `<span><input disabled
                                   class='layui-input disabled input3'></span>`,
            width: 180,
          },
        ]),
      ],
    },
    outerTable,
    outerTableOpts,
    innerLayerOpts = {
      id: 'innerAddForm',
      area: ['1260px', '680px'],
      content: `
            <div class='inner-table-box'>
              <table class='inner-table layui-hide'
                     lay-filter='innerTable' 
                     id='innerTableBox'></table>
            </div>
            <div class='layui-layer-btn btn-box'>
              <button type='button' class='layui-btn inner-box-btn'>确认</button>
            </div>`,
    },
    isEdit = false

  class PageTemplate {
    renderTop (selectData) {
      let h = '<option value=""></option>'
      $(selectData).each((_, item) => {
        h += `<option value='${item.id}'>${item.name}</option>`
      })
      let selectHtml = `<select name='f3'>${h}</select>`

      const html = `
        <div class='content-head'>
          <span>基本信息</span>
        </div>
        <div class='content-body content-form layui-form' lay-filter='outForm'>
           <div class='layui-form-item'>
              <label class='layui-form-label'>入库编号：</label>
              <div class='layui-input-block'>
                <input type='text'
                       name='f1' 
                       placeholder='请输入' 
                       autocomplete='off' 
                       class='layui-input'>
              </div>
            </div>
           <div class='layui-form-item'>
              <label class='layui-form-label'>合同订单编号：</label>
              <div class='layui-input-block'>
                <input type='text'
                       name='f2' 
                       placeholder='请输入' 
                       autocomplete='off' 
                       class='layui-input'>
              </div>
            </div>
           <div class='layui-form-item'>
              <label class='layui-form-label'>供应商：</label>
              <div class='layui-input-block'>
                ${selectHtml}
              </div>
            </div>
           <div class='layui-form-item'>
              <label class='layui-form-label'>交货人：</label>
              <div class='layui-input-block'>
                <input type='text'
                       name='f4' 
                       placeholder='请输入' 
                       autocomplete='off' 
                       class='layui-input'>
              </div>
           </div>
           <div class='layui-form-item'>
              <label class='layui-form-label'>入库人：</label>
              <div class='layui-input-block'>
                <input type='text'
                       name='f5' 
                       placeholder='请输入' autocomplete='off' class='layui-input'>
              </div>
           </div>
           <div class='layui-form-item'>
              <label class='layui-form-label'>验收人：</label>
              <div class='layui-input-block'>
                <input type='text' name='f6' placeholder='请输入' autocomplete='off' class='layui-input'>
              </div>
           </div>
           <div class='layui-form-item'>
              <label class='layui-form-label'>入库时间：</label>
              <div class='layui-input-block'>
                <input type='text'
                       id='inDate'
                       name='f7'
                       placeholder='请输入' 
                       autocomplete='off' 
                       class='layui-input'>
              </div>
           </div>
           <div class='layui-form-item layui-form-text textarea-box'>
              <label class='layui-form-label'>备注：</label>
              <div class='layui-input-block'>
                <textarea maxlength='200'
                          placeholder='请输入200字以内的备注信息' 
                          class='layui-textarea'/>
              </div>
           </div>    
        </div>
      `
      $('.inner-top').html(html)
      form.render()
      laydate.render({ elem: '#inDate', theme: '#007fff' })
    }

    async renderMid () {
      const html = `<div class='content-head'>
                      <span>入库明细</span>
                      <span>
                        <button type='button' class='layui-btn layui-btn-primary layui-btn-xs' id='addNew'>新增</button>
                        <button type='button' class='layui-btn layui-btn-primary layui-btn-xs'>原单引入</button>
                      </span>
                    </div>
                    <table id='tb' lay-filter='outerTable'></table>
                    <div class='freight-box'>
                      <div class='layui-form-item'>
                        <label class='layui-form-label'>运杂费：</label>
                        <div class='layui-input-block'>
                          <input type='text' 
                                 placeholder='请输入运杂费' 
                                 autocomplete='off' 
                                 class='layui-input'>
                        </div>
                      </div>
                    </div>`

      $('.inner-mid').html(html)
      await this.renderOuterTable()
    }

    renderBot () {
      const html = `<div class='content-head'>
                      <span>附件</span>
                    </div>
                    <div class='content-body content-upload layui-form'>
                      <div class='upload-box'>
                        <div class='label'>附件上传：</div>
                        <div class='file-box' id='fileBox'></div>
                      </div>
                      <div class='upload-file-placeholder'></div>
                    </div>`
      $('.inner-bot').html(html)

      const opts = {
        el: '#fileBox',
        elFile: '.upload-file-placeholder',
        multiple: true,
        max: 8,
        success (files) {
          for (let i = 0; i < files.length; i++) {
            const file = files[i]
            // mock
            setTimeout(() => luUpload.clearFin(file), $lulib.randomInt(10, 3) * 750)
          }
        },
      }
      luUpload = new LuUpload(opts)
    }

    async renderOuterTable () {
      outerTableOpts = {
        elem: '#tb',
        page: false,
        cols: [
          $lulib.tableSetCenter([
            { field: 'id', title: '序号', width: 60 },
            { field: 't1', title: '材料名称', width: 320 },
            { field: 't2', title: '规格型号', width: 320 },
            { field: 't3', title: '单位', width: 110 },
            { field: 't4', title: '当前库存', width: 140 },
            { field: 'value0', title: '单价（元）', width: 130 },
            { field: 'value1', title: '入库数量', width: 130 },
            { field: 'number', title: '金额（元）', width: 130 },
            {
              title: '操作',
              toolbar: `<span>
                          <a href='javascript:void(0)' class='table-tool-link' lay-event='edit'>
                            <span class='iconfont icon-bianji'></span>
                            <span>编辑</span>
                          </a>
                          <a href='javascript:void(0)' class='table-tool-link' lay-event='del'>
                            <span class='iconfont icon-shanchu1'></span>
                            <span>删除</span>
                          </a>
                        </span>`,
              minWidth: 200,
            },
          ]),
        ],
        data: currents,
      }
      outerTable = table.render(outerTableOpts)
      table.on('tool(outerTable)', function (obj) {
        switch (obj.event) {
          case 'edit':
            editNew(obj.data)
            break
          case 'del':
            LuLayer.confirm('确定删除？', () => {
              outerTableOpts.data = outerTableOpts.data.filter(item => item.id !== obj.data.id)
              obj.del()
            })
            break
        }
      })
    }
  }

  $('.submit').on('click', function () {
    const data = form.val('outForm')
    const { f1, f2, f3, f4, f5, f6, f7 } = data
    if (!f1 || !f2 || !f3 || !f4 || !f5 || !f6 || !f7) layer.msg('必要基本信息未填写', { icon: 2, anim: 6 })
  })

  const pt = new PageTemplate()

  ;(async () => {
    const params = $lulib.getHashParams()
    pageId = params.id
    innerHeaderRender()
    await innerBody()
  })()

  function innerHeaderRender () {
    let prefix = !!pageId ? '修改' : '新增'
    let title = prefix + '入库'
    let rightHtml = [{ txt: '返回', isWeaken: true }]
    luInnerHeader = new LuInnerHeader({ title, rightHtml })
  }

  async function innerBody () {
    // mock data
    pt.renderTop(
      await new Promise(resolve =>
        resolve([
          { id: 1, name: '供应商1' },
          { id: 2, name: '供应商2' },
          { id: 3, name: '供应商3' },
          { id: 4, name: '供应商4' },
        ]),
      ),
    )
    await pt.renderMid()
    pt.renderBot()
  }

  $lulib.bindMethod(luInnerHeader.rightBtns[0], () => {
    const url = 'bim/material-manage/stock-in-manage'
    $lulib.pagePushHash(url, null, true)
  })

  async function editNew (data) {
    const opts = { ...innerLayerOpts }
    isEdit = true
    opts.title = '修改货物'
    luLayer = new LuLayer(opts)
    tableOpts.data = [data]
    innerTable = table.render(tableOpts)
    table.on('tool(innerTable)', obj => (innerTableCurrentId = obj.data.id))
    $(".input1").val(data.value0)
    $(".input2").val(data.value1)
    $(".input3").val((data.value0 * data.value1).toFixed(2))
  }

  async function addNew () {
    const opts = { ...innerLayerOpts }
    isEdit = false
    opts.title = '选择货物'
    luLayer = new LuLayer(opts)

    innerTableData = await $lulib.getMockData('/htmls/mock/bim/stockInFormInnerTableData.json', 12, '', false)
    tableOpts.data = innerTableData
    innerTable = table.render(tableOpts)
    table.on('tool(innerTable)', obj => (innerTableCurrentId = obj.data.id))
  }

  function innerInput () {
    const inputs = $(this).parents('tr').find('.layui-input')
    const input0 = inputs[0]
    const input1 = inputs[1]
    const input2 = inputs[2]
    const value0 = input0.value
    const value1 = input1.value
    if (!value0 || !value1) return
    const value = (input2.value = (value0 * value1).toFixed(2))
    if (innerTableCurrentId) {
      const item = innerTableData.find(i => i.id === innerTableCurrentId)
      item.number = value
      item.value0 = value0
      item.value1 = value1
    }
  }

  function innerBoxSubmit () {
    const { data } = table.checkStatus('innerTableBox')
    if (!data.length) {
      layer.msg('未选择数据')
      return
    }
    const currentIds = data.filter(item => item.number).map(item => item.id)
    currents = innerTableData.filter(item => currentIds.includes(item.id))
    if (!currents.length) {
      layer.msg('未选择填选数据')
      return
    }
    if (isEdit) {
      for (let i = 0; i < currents.length; i++) {
        const curItem = currents[i]
        outerTableOpts.data = outerTableOpts.data.map(item => {
          if (item.id === curItem.id) return curItem
          return item
        })
      }
    } else {
      outerTableOpts.data = outerTableOpts.data.concat(currents)
    }
    outerTable.reload(outerTableOpts)
    luLayer.close()
  }

  const methods = [
    { dom: 'body', domStr: '#addNew', method: addNew },
    { dom: 'body', domStr: '.input1', evStr: 'input', method: innerInput },
    { dom: 'body', domStr: '.input2', evStr: 'input', method: innerInput },
    { dom: 'body', domStr: '.inner-box-btn', method: innerBoxSubmit },
  ]

  $lulib.methodProxy.bindMethodProxy(methods)
})
