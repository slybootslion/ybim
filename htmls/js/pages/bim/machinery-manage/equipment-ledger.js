layui.use(['LuCommonTemplate', 'LuLayer'], function () {
  const $ = layui.$
  const form = layui.form
  const laydate = layui.laydate

  const LuInnerHeader = layui.LuInnerHeader
  const LuSearchForm = layui.LuSearchForm
  const luUtilsTemplate = layui.LuUtilsTemplate
  const LuTable = layui.LuTable
  const LuLayer = layui.LuLayer
  const LuUpload = layui.LuUpload

  let luInnerHeader, luTable, luLayer, luUpload

  class PageTemplate {
    equipmentFormSetting(data) {
      const { sel1, sel2 } = data
      let editData = { t1: '', t2: '', t3: '', t4: '', t5: '', t6: '' }
      if (data.editData) {
        editData.t1 = data.editData.t1
        editData.t2 = data.editData.t3
        editData.t3 = data.editData.t4
        editData.t4 = data.editData.t5
        editData.t5 = data.editData.t6
        editData.t6 = data.editData.t7
      }
      const s1 = luUtilsTemplate.renderSelectOptions(sel1, editData.t4)
      const s2 = luUtilsTemplate.renderSelectOptions(sel2, editData.t6)

      const uploadHtml = `<div class='content-body content-upload layui-form'>
                            <div class='upload-box'>
                              <div class='file-box' id='fileBox'></div>
                            </div>
                            <div class='upload-file-placeholder'></div>
                          </div>`

      return `
        <form class='layui-form layer-form layer-form-flex-colm team-add-form goods-form' action=''>
          <div class='add-account-box'>
            <div class='box-item'>
              <div class='layui-inline'>
                <label class='layui-form-label required'>
                  <span>设备名称：</span>
                </label>
                <div class='layui-input-inline'>
                  <input type='text' 
                         placeholder='请输入' 
                         lay-verify='required' 
                         autocomplete='off' 
                         class='layui-input' 
                         value='${editData.t1}'>
                </div>
              </div>
              <div class='layui-inline'>
                <label class='layui-form-label required'>
                  <span>规格型号：</span>
                </label>
                <div class='layui-input-inline'>
                  <input type='text' 
                         placeholder='请输入'
                         lay-verify='required'
                         autocomplete='off' 
                         class='layui-input'
                         name='t3'
                         value='${editData.t3}'>
                </div>
              </div>
              <div class='layui-inline'>
                <label class='layui-form-label required'>
                  <span>设备图片：</span>
                </label>
                <div class='layui-input-inline'>
                  ${uploadHtml}
                </div>
              </div>
              <div class='layui-inline'>
                <label class='layui-form-label required'>
                  <span>使用状态：</span>
                </label>
                <div class='layui-input-inline'>
                  <select name='t6' lay-verify='required'>
                    ${s2}
                  </select>
                </div>
              </div> 
            </div>
            <div class='box-item'>
              <div class='layui-inline'>
                <label class='layui-form-label required'>
                  <span>设备编号：</span>
                </label>
                <div class='layui-input-inline'>
                  <input type='text' 
                         placeholder='请输入' 
                         autocomplete='off'
                         lay-verify='required' 
                         class='layui-input' 
                         value='${editData.t2}'>
                </div>
              </div>
              <div class='layui-inline'>
                <label class='layui-form-label required'>
                  <span>额定功率：</span>
                </label>
                <div class='layui-input-inline'>
                  <select name='t4' lay-verify='required'>
                    ${s1}
                  </select>
                </div>
              </div>
              <div class='layui-inline'>
                <label class='layui-form-label required'>
                  <span>进场日期：</span>
                </label>
                <div class='layui-input-inline'>
                  <input type='text' 
                         id='formDate' 
                         name='t5'
                         lay-verify='required'
                         placeholder='请输入' autocomplete='off' class='layui-input' value='${editData.t5}'>
                </div>
              </div>
            </div>
          </div>
          <div class='layui-layer-btn btn-box'>
            <button type='button' lay-submit lay-filter='submit' class='layui-btn'>添加生成二维码</button>
          </div>
        </form>
      `
    }
  }

  const pt = new PageTemplate()

  ;(async () => {
    innerHeaderRender()
    searchFormRender()
    await tableRender()
  })()

  function innerHeaderRender() {
    luInnerHeader = new LuInnerHeader({
      title: '设备台账',
      rightHtml: [{ txt: '添加设备' }, { txt: '导入' }, { txt: '导出' }],
    })
  }

  function searchFormRender() {
    new LuSearchForm([
      { label: '设备名称', type: 'text' },
      { label: '设备编号', type: 'text' },
      { label: '进场日期', type: 'date-s' },
      {
        label: '使用状态',
        type: 'select',
        selectData: [
          { value: '1', key: '正常' },
          { value: '2', key: '异常' },
        ],
      },
    ])
  }

  async function tableRender() {
    const tableData = await $lulib.getMockData('/htmls/mock/bim/equipmentTableData.json', 17, '', false)

    const templet1 = `<span><div class="table-pic"><img src="{{d.t2}}" alt=""></div></span>`
    const templet2 = `<span><div class="table-pic"><img src="{{d.t9}}" alt=""></div></span>`

    const tableOptions = {
      cols: [
        $lulib.tableSetCenter([
          { type: 'checkbox', width: 50 },
          { field: 'id', title: '序号', width: 60 },
          { field: 't1', title: '设备名称', minWidth: 180 },
          {
            title: '设备图片',
            width: 120,
            templet: templet1,
          },
          { field: 't3', title: '设备编号', minWidth: 120 },
          { field: 't4', title: '规格型号', minWidth: 120 },
          { field: 't5', title: '额定功率', width: 90 },
          { field: 't6', title: '进场日期', width: 90 },
          { field: 't7', title: '使用状态', width: 90 },
          { field: 't8', title: '使用部门', minWidth: 120 },
          {
            title: '二维码',
            width: 120,
            templet: templet2,
          },
        ]),
      ],
      ctrlData: [
        { eventStr: 'edit', iconStr: 'icon-bianji', title: '编辑' },
        { eventStr: 'del', iconStr: 'icon-shanchu1', title: '删除' },
        { eventStr: 'm1', iconStr: 'icon-chakanxiangqing', title: '查看详情' },
        { eventStr: 'm2', iconStr: 'icon-tianjiajilu', title: '添加检修记录' },
        { eventStr: 'm3', iconStr: 'icon-xinzeng', title: '添加使用记录' },
      ],
      methods: {
        edit: addNew,
        del,
        m1,
        m2,
        m3,
      },
    }
    luTable = new LuTable(tableData, tableOptions)
  }

  function del(_, obj) {
    LuLayer.confirm('确定删除？', () => obj.del())
  }

  function m1(data) {
    const { id } = data
    $lulib.pagePushHash(`bim/machinery-manage/machinery-info?id=${id}`)
  }

  function m2(data) {
    const { id } = data
    $lulib.pagePushHash(`bim/machinery-manage/add-records?id=${id}&type=m`)
  }

  function m3(data) {
    const { id } = data
    $lulib.pagePushHash(`bim/machinery-manage/add-records?id=${id}&type=used`)
  }

  $lulib.bindMethod([{ dom: luInnerHeader.rightBtns[0], method: addNew }])

  async function addNew(editData) {
    const { sel1, sel2 } = await new Promise(resolve => {
      resolve({
        sel1: [
          { id: 1, title: '12V' },
          { id: 2, title: '24V' },
        ],
        sel2: [
          { id: 1, title: '正常' },
          { id: 2, title: '异常' },
        ],
      })
    })
    const data = { sel1, sel2 }
    const opts = {
      id: 'equipmentForm',
      area: ['860px', '500px'],
    }

    let isEdit = false
    if (!(editData instanceof MouseEvent)) {
      opts.title = '修改设备'
      data.editData = editData
      isEdit = true
    } else {
      opts.title = '添加设备'
      isEdit = false
    }
    opts.content = pt.equipmentFormSetting(data)

    luLayer = new LuLayer(opts)
    form.render()
    laydate.render({
      elem: '#formDate',
      theme: '#007fff',
    })

    const uploadOpts = {
      el: '#fileBox',
      elFile: '.upload-file-placeholder',
      label: '上传缩略图',
      max: 1,
      multiple: true,
      accept: 'image/*',
      success(files) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          // mock
          setTimeout(() => luUpload.clearFin(file), $lulib.randomInt(10, 3) * 750)
        }
      },
    }

    luUpload = new LuUpload(uploadOpts)
    isEdit && luUpload.renderFileList([{ name: '0480_list.jpg' }], true)
  }

  form.on('submit(submit)', function (data) {
    luLayer.close()
  })
})
