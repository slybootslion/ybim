layui.use(['LuCommonTemplate', 'LuLayer'], function () {
  const $ = layui.$
  const form = layui.form

  const LuInnerHeader = layui.LuInnerHeader
  const LuTable = layui.LuTable
  const LuLayer = layui.LuLayer

  class PageTemplate {
    formTemplate(editData) {
      return `
        <form class='layui-form layer-form' action=''>
          <div class='layui-inline'>
            <label class='layui-form-label required'>
              <span>工种名称：</span>
            </label>
            <div class='layui-input-inline'>
              <input type='text' 
                     name='t1' 
                     lay-verify='required' 
                     placeholder='请输入工种名称' 
                     autocomplete='off'
                     class='layui-input w335' value='${editData && editData.id ? editData.t1 : ''}'>
            </div>
          </div>
          <div class='layui-layer-btn btn-box'>
            <button type='button' lay-submit lay-filter='submit' class='layui-btn layui-layer-btn0'>确定</button>
          </div>
        </form>
      `
    }
  }

  const pt = new PageTemplate()

  let luInnerHeader, luTable, luLayer, currentEditData = null
  !(async () => {
    initInnerHeader()
    await tableRender()
  })()

  function initInnerHeader() {
    luInnerHeader = new LuInnerHeader({
      title: '自定义工种',
      rightHtml: [{ txt: '新增工种' }],
    })
  }

  async function tableRender() {
    const data = await $lulib.getMockData('/htmls/mock/user/customWorkTypesTableData.json', 27, '', false)
    const options = {
      cols: [
        $lulib.tableSetCenter([
          { field: 'id', title: '序号', width: 60 },
          { field: 't1', title: '工种名称', minWidth: 220 },
          { field: 't2', title: '添加时间', minWidth: 220 },
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
    currentEditData = data
    dataForm(currentEditData)
  }

  function del(_, obj) {
    LuLayer.confirm('确定删除？', () => obj.del())
  }

  form.on('submit(submit)', function (data) {
    const d = data.field
    console.log(currentEditData, d)
    if (!currentEditData) {

    } else {
      currentEditData = null
    }
    luLayer.close()
  })

  function dataForm(editData) {
    const opts = {
      title: '新增工种',
      id: 'addWorkType',
      area: ['578px', '238px'],
      content: '',
    }

    if (editData instanceof MouseEvent) {
      opts.content = pt.formTemplate()
    } else {
      opts.title = '编辑工种'
      opts.content = pt.formTemplate(editData)
    }

    luLayer = new LuLayer(opts)
  }

  $lulib.bindMethod([{ dom: luInnerHeader.rightBtns[0], method: dataForm }])
})
