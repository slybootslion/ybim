layui.use(['LuCommonTemplate'], function () {
  const $ = layui.$
  const LuSearchForm = layui.LuSearchForm
  const LuTable = layui.LuTable
  const LuLayer = layui.LuLayer
  let luTable, luLayer
  const form = layui.form
  const laydate = layui.laydate

  class PageTemplate {
    formTemplate (data) {
      let select1 = '<option value="">请选择</option>'
      let select2 = '<option value="">请选择</option>'
      for (let i = 0; i < data.select1.length; i++) {
        const item = data.select1[i]
        if (data.editData && item.key === data.editData.t1) select1 += `<option value='${item.value}' selected>${item.key}</option>`
        else select1 += `<option value='${item.value}'>${item.key}</option>`
      }
      for (let i = 0; i < data.select2.length; i++) {
        const item = data.select2[i]
        if (data.editData && item.key === data.editData.t2) select2 += `<option value='${item.value}' selected>${item.key}</option>`
        else select2 += `<option value='${item.value}'>${item.key}</option>`
      }

      return `<form  class='layui-form layer-form layer-form-flex-colm team-add-form' lay-filter='addForm' action=''>
                <div class='layui-inline'>
                  <label class='layui-form-label'>
                    <span>设备属性：</span>
                  </label>
                  <div class='layui-input-inline'>
                    <select name="f1">
                      ${select1}
                    </select>
                  </div>
                </div>
                <div class='layui-inline'>
                  <label class='layui-form-label'>
                    <span>设备类型：</span>
                  </label>
                  <div class='layui-input-inline'>
                    <select name="f2">
                      ${select2}
                    </select>
                  </div>
                </div>
                <div class='layui-inline'>
                  <label class='layui-form-label'>
                    <span>设备名称：</span>
                  </label>
                  <div class='layui-input-inline'>
                    <input type='text' value='${(data.editData && data.editData.t3) || ''}' name='f3' placeholder='请输入' autocomplete='off' class='layui-input'>
                  </div>
                </div>
                <div class='layui-inline'>
                  <label class='layui-form-label'>
                    <span>设备编号：</span>
                  </label>
                  <div class='layui-input-inline'>
                    <input type='text' value='' name='f4' placeholder='请输入' autocomplete='off' class='layui-input'>
                  </div>
                </div>
                <div class='layui-inline'>
                  <label class='layui-form-label'>
                    <span>安装位置：</span>
                  </label>
                  <div class='layui-input-inline'>
                    <input type='text' value='${(data.editData && data.editData.t4) || ''}' name='f5' placeholder='请输入' autocomplete='off' class='layui-input'>
                  </div>
                </div>
                <div class='layui-inline'>
                  <label class='layui-form-label'>
                    <span>安装时间：</span>
                  </label>
                  <div class='layui-input-inline'>
                    <input type='text' id='formDate' value='${(data.editData && data.editData.t5) || ''}' name='f6' placeholder='请输入' autocomplete='off' class='layui-input'>
                  </div>
                </div>
                <div class='layui-inline btn-box'>
                  <button type='button' lay-submit lay-filter='submit' class='layui-btn layui-layer-btn0'>确定</button>
                  <button type='button' lay-submit lay-filter='clear' class='layui-btn layui-layer-btn1 btn-weaken'>取消</button>
                </div>
              </form>`
    }
  }

  const pt = new PageTemplate

  !(() => {
    renderTable()
  })()

  const luSearchForm = new LuSearchForm([
    { label: '设备属性', type: 'select', selectData: [], name: 's1' },
    { label: '设备类型', type: 'select', selectData: [], name: 's2' },
    {
      label: '设备状态', type: 'select',
      selectData: [{ key: '在线', value: '1' }, { key: '离线', value: '2' }], name: 's3'
    },
  ], {
    submit (data) {
      console.log(data)
    }
  })

  async function renderTable () {
    const data = await $lulib.getMockData('/qljcs/mock/equipmentManagementTableData.json', 8, null, false)
    const tableOptions = {
      cols: [
        $lulib.tableSetCenter([
          { field: 'id', title: '编号', width: 60 },
          { field: 't1', title: '设备属性', width: 90 },
          { field: 't2', title: '设备类型', minWidth: 120 },
          { field: 't3', title: '设备名称', minWidth: 120 },
          { field: 't4', title: '安装位置', minWidth: 150 },
          { field: 't5', title: '安装时间', width: 110 },
          { field: 't6', title: '设备状态', width: 120 },
          { field: 't7', title: '通讯状态', width: 120 },
          { field: 't8', title: '通讯等级', width: 120 },
        ]),
      ],
      ctrlData: [
        { eventStr: 'edit', iconStr: 'icon-bianji1', txtStr: '编辑' },
        { eventStr: 'del', iconStr: 'icon-shanchu', txtStr: '删除' },
      ],
      methods: {
        edit (data) {
          renderForm(data)
        },
        del (_, obj) {
          LuLayer.confirm('确定删除？', () => obj.del())
        },
      },
    }
    luTable = new LuTable(data, tableOptions)
  }

  $(".add").on('click', () => renderForm());

  function renderForm (editData) {
    const data = {
      select1: [
        { key: '传感器', value: 1 },
        { key: '监控器', value: 2 },
      ],
      select2: [
        { key: '位移计', value: 1 },
        { key: '温度计', value: 2 },
        { key: 'fg1501', value: 3 },
      ]
    }
    const opts = {
      title: '添加设备',
      id: 'addEquipmentForm',
      area: ['578px', '468px'],
    }
    if (editData) {
      data.editData = editData
      opts.title = '编辑设备'
    }
    opts.content = pt.formTemplate(data)
    luLayer = new LuLayer(opts)
    form.render()
    laydate.render({
      elem: '#formDate',
      theme: '#007fff',
    })
  }

  form.on('submit(submit)', function (data) {
    console.log(data.field)
    luLayer.close()
  })

  form.on('submit(clear)', function (data) {
    luLayer.close()
  })
})
