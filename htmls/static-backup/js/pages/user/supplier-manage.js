layui.use(['LuCommonTemplate', 'LuLayer'], function () {
  const $ = layui.$
  const form = layui.form

  const LuInnerHeader = layui.LuInnerHeader
  const LuSearchForm = layui.LuSearchForm
  const LuTable = layui.LuTable
  const LuAreaSelect = layui.LuAreaSelect
  const LuLayer = layui.LuLayer

  class PageTemplate {
    formTemplate(editData) {
      let d = { f1: '', f2: '', f4: '', f5: '', f6: '' }
      if (editData) {
        d.f1 = editData.t1
        d.f2 = editData.t2
        d.f4 = editData.t4
        d.f5 = editData.t5
        d.f6 = editData.t6
      }
      return `
        <form class='layui-form layer-form layer-form-flex-colm team-add-form' action='' lay-filter='add'>
          <div class='layui-inline'>
            <label class='layui-form-label required'>
              <span>供应商全称：</span>
            </label>
            <div class='layui-input-inline'>
              <input type='text' 
                     name='f1' 
                     lay-verify='required'
                     value='${d.f1}'
                     placeholder='请输入' 
                     autocomplete='off' 
                     class='layui-input'>
            </div>
          </div>
          <div class='layui-inline'>
            <label class='layui-form-label required'>
              <span>供应商简称：</span>
            </label>
            <div class='layui-input-inline'>
              <input type='text' name='f2' lay-verify='required' placeholder='请输入' autocomplete='off' class='layui-input' value='${d.f2}'>
            </div>
          </div>
          <div class='layui-inline' id='areaPicker'></div>
          <div class='layui-inline'>
            <label class='layui-form-label required'>
              <span>联系人：</span>
            </label>
            <div class='layui-input-inline'>
              <input type='text' name='f4' lay-verify='required' placeholder='请输入' autocomplete='off' class='layui-input' value='${d.f4}'>
            </div>
          </div>
          <div class='layui-inline'>
            <label class='layui-form-label required'>
              <span>联系电话：</span>
            </label>
            <div class='layui-input-inline'>
              <input type='text' name='f5' lay-verify='required|phone|number' placeholder='请输入' autocomplete='off' class='layui-input' value='${d.f5}'>
            </div>
          </div>
          <div class='layui-inline'>
            <label class='layui-form-label required'>
              <span>产品与服务：</span>
            </label>
            <div class='layui-input-inline'>
              <textarea name='f6' maxlength='100' placeholder='请输入内容' class='layui-textarea'>${d.f6}</textarea>
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
    luAreaSelect = new LuAreaSelect({ elem: '#areaPicker', title: '所属地区', type: 'less' })
    await tableRender()
  })()

  function initInnerHeader() {
    luInnerHeader = new LuInnerHeader({
      title: '供应商管理',
      rightHtml: [{ txt: '新增供应商' }],
    })
  }

  function searchFormRender() {
    new LuSearchForm(
      [
        { label: '供应商名称', type: 'text', name: 's1' },
        { label: '联系电话', type: 'text', name: 's2' },
      ],
      {
        async submit(data) {},
      },
    )
  }

  async function tableRender() {
    const data = await $lulib.getMockData('/htmls/mock/user/supplierTableData.json', 67, '', false)
    const options = {
      cols: [
        $lulib.tableSetCenter([
          { field: 'id', title: '序号', width: 60 },
          { field: 't1', title: '供应商全程', minWidth: 270 },
          { field: 't2', title: '供应商简称', width: 140 },
          { field: 't3', title: '所属地区', width: 220 },
          { field: 't4', title: '联系人', width: 120 },
          { field: 't5', title: '联系电话', width: 160 },
          { field: 't6', title: '产品服务', minWidth: 380 },
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

  $lulib.bindMethod([{ dom: luInnerHeader.rightBtns[0], method: dataForm }])

  function dataForm(editData) {
    const options = {
      title: '新增供应商',
      id: 'addSupplier',
      area: ['720px', '538px'],
    }
    if (editData instanceof MouseEvent) {
      options.content = pt.formTemplate()
      luAreaSelect.resetData()
    } else {
      options.title = '修改供应商'
      options.content = pt.formTemplate(editData)
      // mock data to lu-area-select component
      luAreaSelect.config.data = {
        city: '西安市',
        cityCode: '610100',
        province: '陕西省',
        provinceCode: '610000',
      }
    }
    luLayer = new LuLayer(options)
    luAreaSelect.render()
  }

  function edit(data) {
    dataForm(data)
  }

  function del(_, obj) {
    LuLayer.confirm('确定删除？', () => obj.del())
  }

  form.on('submit(submit)', data => {
    console.log(data.field)
    console.log(luAreaSelect.getData())
    luLayer.close()
  })

  let a = [12, 13]

  function foo(b) {
    b.push(15)
  }

  console.log(a)
})
