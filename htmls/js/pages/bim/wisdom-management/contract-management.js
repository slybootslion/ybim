layui.use(['LuCommonTemplate', 'LuLayer'], function () {
  const form = layui.form
  const laydate = layui.laydate

  const LuInnerHeader = layui.LuInnerHeader
  const LuSearchForm = layui.LuSearchForm
  const LuLayer = layui.LuLayer
  const LuTable = layui.LuTable
  const LuUpload = layui.LuUpload
  const luUtilsTemplate = layui.LuUtilsTemplate

  let luInnerHeader, luTable, luLayer, luUpload
  // mock
  const selectData = [
    { key: '人员', value: 1 },
    { key: '分包', value: 2 },
    { key: '施工', value: 3 },
    { key: '监理', value: 4 },
    { key: '设计', value: 5 },
    { key: '设备', value: 6 },
  ]

  class PageTemplate {
    layerFormTemplate (data) {
      const sel = data.sel
      const editData = {
        f1: '', f2: '', f3: '', f4: '', f5: '',
      }
      if (data.editData) {
        editData.f1 = data.editData.t2
        editData.f2 = data.editData.t1
        editData.f3 = data.editData.t3
        editData.f4 = data.editData.t5
        editData.f5 = data.editData.t4
      }
      const s1 = luUtilsTemplate.renderSelectOptions(sel, editData.f3, 'key', 'value')

      const uploadHtml = `<div class='content-body content-upload layui-form'>
                            <div class='upload-box'>
                              <div class='file-box' id='fileBox'></div>
                            </div>
                            <div class='upload-file-placeholder'></div>
                          </div>`

      return `
        <form class='layui-form layer-form layer-form-flex-colm team-add-form' action=''>
          <div class='layui-inline'>
            <label class='layui-form-label required'>
              <span>合同名称：</span>
            </label>
            <div class='layui-input-inline'>
              <input type='text' 
                     name='f1' 
                     lay-verify='required' 
                     placeholder='请输入'
                     autocomplete='off'
                     value='${editData.f1}'
                     class='layui-input w335'></div>
          </div>
          <div class='layui-inline'>
            <label class='layui-form-label required'>
              <span>合同编号：</span>
            </label>
            <div class='layui-input-inline'>
              <input type='text' 
                     name='f2' 
                     lay-verify='required' 
                     placeholder='请输入'
                     autocomplete='off'
                     value='${editData.f2}'
                     class='layui-input w335'></div>
          </div>
          <div class='layui-inline'>
            <label class='layui-form-label required'>
              <span>合同类型：</span>
            </label>
            <div class='layui-input-inline'>
                  <select name='f3' lay-verify='required'>
                    ${s1}
                  </select>
                </div>
          </div>
          <div class='layui-inline'>
            <label class='layui-form-label required'>
              <span>签订日期：</span>
            </label>
            <div class='layui-input-inline'>
              <input type='text'
                     lay-verify='required' 
                     id='formDate1' 
                     name='f4' 
                     placeholder='请输入' 
                     autocomplete='off' 
                     class='layui-input' 
                     value='${editData.f4}'>
            </div>
          </div>
          <div class='layui-inline'>
            <label class='layui-form-label required'>
              <span>合同总金额：</span>
            </label>
            <div class='layui-input-inline'>
              <input type='text' 
                     name='f5' 
                     lay-verify='required' 
                     placeholder='请输入'
                     autocomplete='off'
                     value='${editData.f5}'
                     class='layui-input w335'></div>
          </div>
          <div class='layui-inline'>
                <label class='layui-form-label required'>
                  <span>附件上传：</span>
                </label>
                <div class='layui-input-inline'>
                  ${uploadHtml}
                </div>
              </div>
          <div class='layui-layer-btn btn-box'>
            <button type='button' 
                    lay-submit
                    lay-filter='submit' 
                    class='layui-btn layui-layer-btn0'>提交</button>
          </div>
        </form>
      `
    }
  }

  const pt = new PageTemplate();
  (async () => {
    renderInnerHeader()
    renderSearchForm()
    await renderTable()
  })()


  function renderInnerHeader () {
    luInnerHeader = new LuInnerHeader({
      title: '合同管理',
      rightHtml: [{ txt: '合同登记' }],
    })
  }

  function renderSearchForm () {
    new LuSearchForm(
      [
        { label: '合同名称', type: 'text', name: 's1' },
        { label: '合同编号', type: 'text', name: 's2' },
        { label: '选择时间', type: 'date-d' },
        { label: '合同类型', type: 'select', selectData, name: 's4' },
      ],
      {
        submit (data) {
          console.log(data)
        }
      }
    )
  }

  async function renderTable () {
    // mock
    const data = await $lulib.getMockData('/htmls/mock/bjm/contractManagementTableData.json', 12, '', false)
    const linkTemplate = `<span>
      <a class="table-tool-link" download href="{{d.link}}"><span class='iconfont icon-fujian'></span>附件</a>
</span>`

    const options = {
      cols: [
        $lulib.tableSetCenter([
          { field: 'id', title: '序号', width: 60 },
          { field: 't1', title: '合同编号', minWidth: 190, align: 'center' },
          { field: 't2', title: '合同名称', minWidth: 320, align: 'center' },
          { field: 't3', title: '合同类型', width: 120, align: 'center' },
          { field: 't4', title: '合同金额', width: 190, align: 'center' },
          { field: 't5', title: '签订日期', width: 150, align: 'center' },
          { title: '附件', templet: linkTemplate, width: 120, align: 'center' },
        ]),
      ],
      ctrlData: [
        { eventStr: 'edit', iconStr: 'icon-bianji', txtStr: '编辑' },
        { eventStr: 'del', iconStr: 'icon-shanchu1', txtStr: '删除' },
        { eventStr: 'info', iconStr: 'icon-chakanxiangqing', txtStr: '查看详情' },
      ],
      methods: {
        edit,
        del,
        info
      },
    }
    luTable = new LuTable(data, options)
  }

  async function edit (data) {
    uploadForm(data)
  }

  function del (_, obj) {
    LuLayer.confirm('确定删除？', () => obj.del())
  }

  function info(data,obj) {
    console.log(data, obj)
  }

  $lulib.bindMethod([{ dom: luInnerHeader.rightBtns[0], method: uploadForm }])

  function uploadForm (editData) {
    const options = {
      title: '合同等级',
      id: 'contractUploadForm',
      area: ['700px', '460px']
    }
    const data = {
      sel: selectData
    }
    let isEdit = false
    if (!(editData instanceof MouseEvent)) {
      data.editData = editData
      isEdit = true
    }
    options.content = pt.layerFormTemplate(data)
    luLayer = new LuLayer(options)
    form.render()
    laydate.render({
      elem: '#formDate1',
      theme: '#007fff',
    })
    const uploadOptions = {
      el: '#fileBox',
      elFile: '.upload-file-placeholder',
      label: '附件上传',
      max: 1,
      limit: 20,
      multiple: false,
      desc: '',
      success (files) {
        console.log(files)
      }
    }
    luUpload = new LuUpload(uploadOptions)
    isEdit && luUpload.renderFileList([{ name: 'xxxxxxxxxxx.pdf' }], true)
  }

  form.on('submit(submit)', function (data) {
    if (!luUpload.files.length) {
      layer.msg('文件未上传')
      return
    }
    luLayer.close()
  })
})
