layui.use(['LuCommonTemplate', 'LuLayer', 'LuUtilsTemplate'], function () {
  const $ = layui.$
  const table = layui.table
  const form = layui.form

  const LuInnerHeader = layui.LuInnerHeader
  const LuSearchForm = layui.LuSearchForm
  const LuTable = layui.LuTable
  const LuLayer = layui.LuLayer
  const luUtilsTemplate = layui.LuUtilsTemplate

  class PageTemplate {
    layerFormTemplate(data) {
      const { sel1, sel2 } = data
      let editData = { t1: '', t2: '', t3: '', t4: '', t5: '', t6: '', t7: '', t8: '' }
      if (data.editData) {
        editData.t1 = data.editData.t1
        editData.t2 = data.editData.t2
        editData.t3 = data.editData.t3
        editData.t4 = data.editData.t4
        editData.t7 = data.editData.t6
        editData.t8 = data.editData.t5
      }
      const h1 = luUtilsTemplate.renderSelectOptions(sel1, editData.t3)
      const h2 = luUtilsTemplate.renderSelectOptions(sel2, editData.t4)
      return `
        <form class='layui-form layer-form layer-form-flex-colm team-add-form goods-form' action=''>
          <div class='add-account-box'>
            <div class='box-item'>
              <div class='layui-inline'>
                <label class='layui-form-label required'>
                  <span>用户名：</span>
                </label>
                <div class='layui-input-inline'>
                  <input type='text'
                         name='f1'
                         value='${editData.t1}'
                         lay-verify='required' 
                         placeholder='请输入用户名' 
                         autocomplete='off' class='layui-input'>
                </div>
              </div>
              <div class='layui-inline'>
                <label class='layui-form-label required'>
                  <span>角色：</span>
                </label>
                <div class='layui-input-inline'>
                  <select lay-verify='required' name='f3'>
                    ${h1}
                  </select>
                </div>
              </div>
              <div class='layui-inline'>
                <label class='layui-form-label required'>
                  <span>用户密码：</span>
                </label>
                <div class='layui-input-inline'>
                  <input type='password'
                         name='f5'
                         lay-verify='required' 
                         placeholder='请输入密码' 
                         autocomplete='off' class='layui-input'>
                </div>
              </div>
              <div class='layui-inline'>
                <label class='layui-form-label'>
                  <span>联系电话：</span>
                </label>
                <div class='layui-input-inline'>
                  <input type='text'
                         name='f7'
                         value='${editData.t7}'
                         placeholder='请输入联系电话' 
                         autocomplete='off' class='layui-input'>
                </div>
              </div>
            </div>
            <div class='box-item'>
              <div class='layui-inline'>
                <label class='layui-form-label'>
                  <span>姓名：</span>
                </label>
                <div class='layui-input-inline'>
                  <input type='text'
                         name='f2'
                         value='${editData.t2}'
                         placeholder='请输入姓名' 
                         autocomplete='off' class='layui-input'>
                </div>
              </div>
              <div class='layui-inline'>
                <label class='layui-form-label required'>
                  <span>所在公司：</span>
                </label>
                <div class='layui-input-inline'>
                  <select lay-verify='required' name='f4'>
                    ${h2}
                  </select>
                </div>
              </div>
              <div class='layui-inline'>
                <label class='layui-form-label required'>
                  <span>确认密码：</span>
                </label>
                <div class='layui-input-inline'>
                  <input type='password'
                         name='f6'
                         lay-verify='required' 
                         placeholder='确认密码' 
                         autocomplete='off' class='layui-input'>
                </div>
              </div>
              <div class='layui-inline'>
                <label class='layui-form-label'>
                  <span>岗位：</span>
                </label>
                <div class='layui-input-inline'>
                  <input type='text'
                         name='f8'
                         value='${editData.t8}'
                         placeholder='请输入岗位' 
                         autocomplete='off' class='layui-input'>
                </div>
              </div>
            </div>
          </div>
          <div class='layui-layer-btn btn-box'>
            <button type='button' lay-submit lay-filter='submit' class='layui-btn'>确定</button>
          </div>
        </form>
      `
    }
  }

  const pt = new PageTemplate()

  let luInnerHeader, luTable, luLayer
  ;(async () => {
    initInnerHeader()
    searchFormRender()
    await tableRender()
  })()

  function initInnerHeader() {
    luInnerHeader = new LuInnerHeader({
      title: '账号管理',
      rightHtml: [{ txt: '添加账号' }],
    })
  }

  function searchFormRender() {
    new LuSearchForm(
      [
        { label: '用户名', type: 'text', name: 'search1' },
        { label: '姓名', type: 'text', name: 'search2' },
        { label: '所在公司', type: 'select', selectData: [], name: 'search3' },
        { label: '角色', type: 'select', selectData: [], name: 'search4' },
      ],
      {
        submit(data) {
          console.log(data)
        },
      },
    )
  }

  async function tableRender() {
    const tableData = await $lulib.getMockData('/htmls/mock/user/accountManageListData.json', 1, '', false)
    const ctrlHtml = `<span>
        <a href='javascript:void(0)' class='table-tool-link' lay-event='edit'>
          <span class='iconfont icon-bianji'></span>
          <span>编辑</span>
        </a>
        {{d.t1 === 'admin' ? '' : '<a href='javascript:void(0)' class='table-tool-link' lay-event='del'>
          <span class='iconfont icon-shanchu1'></span>
          <span>删除</span>
        </a>
        <a href='javascript:void(0)' class='table-tool-link' lay-event='reset'>
          <span>重置密码</span>
        </a>'}}
</span>`
    const opts = {
      cols: [
        $lulib.tableSetCenter([
          { field: 'id', title: '序号', width: 60 },
          { field: 't1', title: '用户名', width: 100 },
          { field: 't2', title: '姓名', minWidth: 90 },
          { field: 't3', title: '角色', minWidth: 120 },
          { field: 't4', title: '所在公司', minWidth: 210 },
          { field: 't5', title: '岗位' },
          { field: 't6', title: '联系电话', minWidth: 120 },
          { field: 't7', title: '创建时间', minWidth: 120 },
          { title: '操作', templet: ctrlHtml, minWidth: 230 },
        ]),
      ],
    }
    luTable = new LuTable(tableData, opts)
    table.on('tool(table)', tableCtrlEvent)
  }

  function tableCtrlEvent(obj) {
    function reset(data) {
      LuLayer.confirm('确定重置密码', () => console.log('do something'))
    }

    function del(_, obj) {
      LuLayer.confirm('确定删除？', () => obj.del())
    }

    function edit(data) {
      account(data)
    }

    const fn = { reset, del, edit }
    fn[obj['event']](obj.data, obj)
  }

  $lulib.bindMethod([{ dom: luInnerHeader.rightBtns[0], method: account }])

  function account(editData) {
    const opts = {
      id: 'accountManageForm',
      area: ['860px', '400px'],
    }
    // mock select data
    const sel1 = [
      { id: 1, title: '超级管理员' },
      { id: 2, title: '施工管理' },
    ]
    const sel2 = [
      { id: 1, title: '公路管理处' },
      { id: 2, title: '陕西三秦路桥' },
    ]
    const data = { sel1, sel2 }
    if (editData instanceof MouseEvent) {
      opts.title = '新增账号'
    } else {
      data.editData = editData
      opts.title = '修改账号'
    }
    opts.content = pt.layerFormTemplate(data)
    luLayer = new LuLayer(opts)
    form.render()
  }

  form.on('submit(submit)', function (data) {
    let { f1, f2, f3, f4, f5, f6, f7, f8 } = data.field
    f5 = f5.trim()
    f6 = f6.trim()
    if (f5 !== f6) {
      $lulib.quickMessage('密码不相同')
      return
    }
    if (f7 && !/^1[3-9]\d{9}$/.test(f7)) {
      $lulib.quickMessage('手机号码不正确')
      return
    }
    luLayer.close()
  })
})
