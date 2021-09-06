layui.use(['LuCommonTemplate', 'LuLayer'], function () {
  const $ = layui.$
  const form = layui.form

  const LuInnerHeader = layui.LuInnerHeader
  const LuSearchForm = layui.LuSearchForm
  const LuTable = layui.LuTable
  const LuLayer = layui.LuLayer
  const LuAreaSelect = layui.LuAreaSelect

  class PageTemplate {
    formTemplate(data) {
      const { selectOptionsData, editData } = data
      let h = '<option value="">请选择类型</option>'
      let d = { f1: '', f3: '', f4: '', f5: '' }
      if (editData) {
        d.f1 = editData.t1
        d.f3 = editData.t3
        d.f4 = editData.t4
        d.f5 = editData.t5
      }
      for (let i = 0; i < selectOptionsData.length; i++) {
        const s = selectOptionsData[i]
        if (editData && s.key === editData.t2) {
          h += `<option value='${s.value}' selected>${s.key}</option>`
        } else {
          h += `<option value='${s.value}'>${s.key}</option>`
        }
      }
      return `
        <form class='layui-form layer-form layer-form-flex-colm team-add-form' action='' lay-filter='add'>
          <div class='layui-inline'>
            <label class='layui-form-label required'>
              <span>企业名称：</span>
            </label>
            <div class='layui-input-inline'>
              <input type='text' 
                     name='f1' 
                     lay-verify='required'
                     value='${d.f1}'
                     placeholder='请输入企业名称' 
                     autocomplete='off' 
                     class='layui-input'>
            </div>
          </div>
          <div class='layui-inline'>
            <label class='layui-form-label required'>
              <span>参建类型：</span>
            </label>
            <div class='layui-input-inline'>
              <select name='f2' lay-verify='required'>
                ${h}
              </select>
            </div>
          </div>
          <div class='layui-inline'>
            <label class='layui-form-label required'>
              <span>统一社会信用代码：</span>
            </label>
            <div class='layui-input-inline'>
              <input type='text' name='f3' lay-verify='required' placeholder='请输入社会信用代码' autocomplete='off' class='layui-input' value='${d.f3}'>
            </div>
          </div>
          <div class='layui-inline' id='areaPicker'></div>
          <div class='layui-inline'>
            <label class='layui-form-label required'>
              <span>联系人姓名：</span>
            </label>
            <div class='layui-input-inline'>
              <input type='text' name='f4' lay-verify='required' placeholder='请输入联系人姓名' autocomplete='off' class='layui-input' value='${d.f4}'>
            </div>
          </div>
          <div class='layui-inline'>
            <label class='layui-form-label required'>
              <span>联系人电话：</span>
            </label>
            <div class='layui-input-inline'>
              <input type='text' name='f5' lay-verify='required|phone|number' placeholder='请输入联系人电话' autocomplete='off' class='layui-input' value='${d.f5}'>
            </div>
          </div>
          <div class='layui-layer-btn btn-box'>
              <button type='button' lay-submit lay-filter='submit' class='layui-btn layui-layer-btn0'>保存</button>
            </div>
        </form>
      `
    }
  }

  const pt = new PageTemplate()

  let luInnerHeader, luTable, luLayer, luAreaSelect
  !(async () => {
    initInnerHeader()
    searchFormRender()
    luAreaSelect = new LuAreaSelect({ elem: '#areaPicker', title: '企业注册地' })
    await tableRender()
  })()

  function initInnerHeader() {
    luInnerHeader = new LuInnerHeader({
      title: '参建单位管理',
      rightHtml: [{ txt: '添加单位' }],
    })
  }

  function searchFormRender() {
    new LuSearchForm(
      [
        { label: '单位名称', type: 'text', name: 's1' },
        { label: '单位类型', type: 'select', selectData: [], name: 's2' },
      ],
      {
        async submit(data) {},
      },
    )
  }

  async function tableRender() {
    const data = await $lulib.getMockData('/htmls/mock/user/participatingData.json', 47, '', false)
    const options = {
      cols: [
        $lulib.tableSetCenter([
          { field: 'id', title: '序号', width: 60 },
          { field: 't1', title: '参建单位', minWidth: 270 },
          { field: 't2', title: '参建类型', width: 140 },
          { field: 't3', title: '统一社会信用代码', width: 220 },
          { field: 't4', title: '联系人', width: 120 },
          { field: 't5', title: '联系电话', width: 160 },
          { field: 't6', title: '企业注册地', minWidth: 320 },
        ]),
      ],
      ctrlData: [
        { eventStr: 'edit', iconStr: 'icon-bianji', txtStr: '编辑' },
        { eventStr: 'del', iconStr: 'icon-shanchu1', txtStr: '删除' },
      ],
      methods: {
        edit,
        del,
      },
    }
    luTable = new LuTable(data, options)
  }

  function edit(data) {
    dataForm(data)
  }

  function del(_, obj) {
    LuLayer.confirm('确定删除？', () => obj.del())
  }

  $lulib.bindMethod([{ dom: luInnerHeader.rightBtns[0], method: dataForm }])

  function dataForm(editData) {
    // mock
    const selectOptionsData = [
      { key: '总承包单位', value: 1 },
      { key: '劳务分包', value: 2 },
      { key: '勘察单位', value: 3 },
      { key: '建设单位', value: 4 },
      { key: '后勤服务', value: 5 },
      { key: '施工单位', value: 6 },
      { key: '其他', value: 99 },
    ]
    const options = {
      title: '新增参建单位',
      id: 'addCompany',
      area: ['678px', '498px'],
    }
    const data = { selectOptionsData }
    if (editData instanceof MouseEvent) {
      options.content = pt.formTemplate(data)
      luAreaSelect.resetData()
    } else {
      data.editData = editData
      options.title = '编辑参建单位'
      options.content = pt.formTemplate(data)
      // mock data to lu-area-select component
      luAreaSelect.config.data = {
        city: '西安市',
        cityCode: '610100',
        county: '雁塔区',
        countyCode: '610113',
        province: '陕西省',
        provinceCode: '610000',
      }
    }
    luLayer = new LuLayer(options)
    form.render()
    luAreaSelect.render()
  }

  form.on('submit(submit)', data => {
    console.log(data.field)
    console.log(luAreaSelect.getData())
    luLayer.close()
  })
})
