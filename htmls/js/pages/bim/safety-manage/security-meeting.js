layui.use(['LuCommonTemplate', 'LuLayer'], function () {
  const $ = layui.$
  const laydate = layui.laydate
  const form = layui.form

  const LuInnerHeader = layui.LuInnerHeader
  const LuSearchForm = layui.LuSearchForm
  const LuLayer = layui.LuLayer
  const LuTable = layui.LuTable

  let luInnerHeader, luTable, luLayer

  class PageTemplate {
    layerTemplate (data) {
      const editData = {
        f1: '', f2: '', f3: '', f4: '', f5: '',
      }
      if (data.editData) {
        editData.f1 = data.editData.t2
        editData.f2 = data.editData.t3
        editData.f3 = data.editData.t4
        editData.f4 = data.editData.t1
        editData.f5 = data.editData.t5
      }
      return `
        <form class='layui-form layer-form layer-form-flex-colm team-add-form' action=''>
          <div class='layui-inline'>
            <label class='layui-form-label required'>
              <span>会议名称：</span>
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
              <span>会议地点：</span>
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
              <span>组织部门：</span>
            </label>
            <div class='layui-input-inline'>
              <input type='text' 
                     name='f3' 
                     lay-verify='required' 
                     placeholder='请输入'
                     autocomplete='off'
                     value='${editData.f3}'
                     class='layui-input w335'></div>
          </div>
          <div class='layui-inline'>
            <label class='layui-form-label required'>
              <span>会议日期：</span>
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
              <span>主讲人：</span>
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
    innerHeaderRender()
    renderSearchForm()
    await renderTable()
  })()

  function innerHeaderRender () {
    luInnerHeader = new LuInnerHeader({
      title: '安全会议',
      rightHtml: [{ txt: '新增会议' }],
    })
  }

  function renderSearchForm () {
    new LuSearchForm(
      [
        { label: '会议名称', type: 'text', name: 's1' },
        { label: '会议时间', type: 'date-d' },
        { label: '会议地点', type: 'text', name: 's2' },
      ],
      {
        submit (data) {
          console.log(data)
        }
      }
    )
  }

  async function renderTable () {
    const tableData = await $lulib.getMockData('/htmls/mock/bjm/safetyTrainingTabelData.json', 12, '', false)

    const linkTemplate = `
      <span>
        <a href="javascript:void(0)" class="table-tool-link" lay-event="edit" title="编辑">
          <span class="iconfont icon-bianji"></span>
        </a>
        <a href="javascript:void(0)" class="table-tool-link" lay-event="del" title="删除">
          <span class="iconfont icon-shanchu1"></span>
        </a>
        <a href="javascript:void(0)" class="table-tool-link" lay-event="{{d.state === 1 ? 'm1' : 'm2'}}" title="{{d.state === 1 ? '添加' : '详情'}}">
          <span class="iconfont {{d.state === 1 ? 'icon-xinzeng' : 'icon-chakanxiangqing'}}"></span>
        </a>
      </span>      
    `

    const options = {
      cols: [
        $lulib.tableSetCenter([
          { field: 'id', title: '序号', width: 60 },
          { field: 't1', title: '会议时间', minWidth: 160, align: 'center' },
          { field: 't2', title: '会议名称', minWidth: 400, align: 'center' },
          { field: 't3', title: '会议地点', minWidth: 180, align: 'center' },
          { field: 't4', title: '组织部门', minWidth: 160, align: 'center' },
          { field: 't5', title: '主持人', width: 150, align: 'center' },
          { title: '操作', templet: linkTemplate, width: 120, align: 'center' },
        ]),
      ],
      methods: {
        edit: formShow,
        del,
        m1,
        m2
      },
    }
    luTable = new LuTable(tableData, options)
    luTable.tableOn()
  }

  function del (_, obj) {
    LuLayer.confirm('确定删除？', () => obj.del())
  }

  function m1 (data) {
    $lulib.pagePushHash(`bim/safety-manage/security-meeting-form?id=${data.id}`)
  }

  function m2 (data) {
    $lulib.pagePushHash(`bim/safety-manage/security-meeting-info?id=${data.id}`)
  }

  const formShow = editData => {
    const options = {
      title: '合同等级',
      id: 'contractUploadForm',
      area: ['700px', '460px']
    }
    const data = {}
    if (!(editData instanceof MouseEvent)) data.editData = editData
    options.content = pt.layerTemplate(data)
    luLayer = new LuLayer(options)
    laydate.render({
      elem: '#formDate1',
      theme: '#007fff',
    })
  }

  $lulib.bindMethod([{ dom: luInnerHeader.rightBtns[0], method: formShow }])

  form.on('submit(submit)', function (data) {
    console.log(data)
    luLayer.close()
  })
})
