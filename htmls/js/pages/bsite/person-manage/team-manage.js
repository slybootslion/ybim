layui.use(['LuCommonTemplate', 'LuLayer'], function () {
  const $ = layui.$
  const form = layui.form

  const LuInnerHeader = layui.LuInnerHeader
  const LuSearchForm = layui.LuSearchForm
  const LuTable = layui.LuTable
  const LuLayer = layui.LuLayer

  class PageTemplate {
    formTemplate(data) {
      let companyHtml = '<option value="">请选择参建单位</option>'
      let teamHtml = '<option value="">请选择工种</option>'
      for (let i = 0; i < data.company.length; i++) {
        const item = data.company[i]
        if (data.editData && item.key === data.editData.company)
          companyHtml += `<option value='${item.value}' selected>${item.key}</option>`
        else companyHtml += `<option value='${item.value}'>${item.key}</option>`
      }
      for (let i = 0; i < data.team.length; i++) {
        const item = data.team[i]
        if (data.editData && item.key === data.editData.team) teamHtml += `<option value='${item.value}' selected>${item.key}</option>`
        else teamHtml += `<option value='${item.value}'>${item.key}</option>`
      }
      return `<form class='layui-form layer-form layer-form-flex-colm team-add-form' lay-filter='addForm' action=''>
                <div class='layui-inline'>
                  <label class='layui-form-label required'>
                    <span>班组名称：</span>
                  </label>
                  <div class='layui-input-inline'>
                    <input lay-verify='required' type='text' value='${
                      (data.editData && data.editData.team) || ''
                    }' name='test' placeholder='请输入班组名称' autocomplete='off' class='layui-input'>
                  </div>
                </div>
                <div class='layui-inline'>
                  <label class='layui-form-label required'>
                    <span>所属参建单位：</span>
                  </label>
                  <div class='layui-input-inline'>
                    <select lay-verify='required' value='${data.editData || ''}'>
                      ${companyHtml}
                    </select>
                  </div>
                </div>
                <div class='layui-inline'>
                  <label class='layui-form-label'>
                    <span>班组工种：</span>
                  </label>
                  <div class='layui-input-inline'>
                    <select>
                      ${teamHtml}
                    </select>
                  </div>
                </div>
                <div class='layui-inline'>
                  <label class='layui-form-label'>
                    <span>责任人：</span>
                  </label>
                  <div class='layui-input-inline'>
                    <input type='text' name='' value='${
                      (data.editData && data.editData.name) || ''
                    }' placeholder='请输入责任人' autocomplete='off' class='layui-input'>
                  </div>
                </div>
                <div class='layui-inline'>
                  <label class='layui-form-label'>
                    <span>责任人身份证号码：</span>
                  </label>
                  <div class='layui-input-inline'>
                    <input type='text' name='' value='${
                      (data.editData && data.editData.idNum) || ''
                    }' placeholder='请输入责任人身份证号码' autocomplete='off' class='layui-input'>
                  </div>
                </div>
                <div class='layui-layer-btn btn-box'>
                  <button type='button' lay-submit lay-filter='submit' class='layui-btn layui-layer-btn0'>保存</button>
                </div>
              </form>`
    }
  }

  const pt = new PageTemplate()

  let luInnerHeader, luTable, luLayer
  !(async () => {
    renderInnerHeader()
    renderSearchForm()
    await renderTable()
  })()

  function renderInnerHeader() {
    luInnerHeader = new LuInnerHeader({
      title: '班组管理',
      rightHtml: [{ txt: '新增', icon: 'icon-xinzeng' }],
    })
  }

  function renderSearchForm() {
    // mock
    const selectData = [
      { value: 1, key: '公司1' },
      { value: 2, key: '山东荣红生物科技有限公司' },
    ]
    new LuSearchForm(
      [
        { label: '班组名称', type: 'text', name: 's1' },
        {
          label: '所属公司',
          type: 'select',
          name: 's2',
          selectData,
        },
      ],
      {
        submit(val) {
          console.log(val)
        },
      },
    )
  }

  async function renderTable() {
    // mock data
    const tableData = await $lulib.getMockData('/htmls/mock/bsite/teamManageTableData.json', 12, '', false)
    const options = {
      cols: [
        $lulib.tableSetCenter([
          { field: 'id', title: '序号', width: 60 },
          { field: 'team', title: '班组名称', minWidth: 140 },
          { field: 'company', title: '所属参建单位', minWidth: 210 },
          { field: 'teamNum', title: '班组人数', width: 90 },
          { field: 'name', title: '班组负责人', minWidth: 140 },
          { field: 'idNum', title: '负责人身份证号', minWidth: 230 },
          { field: 'phone', title: '负责手机号码', minWidth: 140 },
        ]),
      ],
      ctrlData: [
        { eventStr: 'edit', iconStr: 'icon-bianji', txtStr: '编辑' },
        { eventStr: 'del', iconStr: 'icon-shanchu1', txtStr: '删除' },
        { eventStr: 'info', iconStr: 'icon-chakanxiangqing', txtStr: '查看详情' },
      ],
      methods: {
        edit,
        info,
        del(_, obj) {
          LuLayer.confirm('确定删除？', () => obj.del())
        },
      },
    }
    luTable = new LuTable(tableData, options)
  }

  function edit(data) {
    renderForm(data)
  }

  function info(data) {
    $lulib.pagePushHash(`bim/person-manage/team-detail`, data)
  }

  $lulib.bindMethod([{ dom: luInnerHeader.rightBtns[0], method: renderForm }])

  function renderForm(editData) {
    // mock
    const data = {
      company: [
        { value: 1, key: '公司1' },
        { value: 2, key: '山东荣红生物科技有限公司' },
        { value: 3, key: '陕西三秦路桥有限责任公司' },
      ],
      team: [
        { value: 1, key: '管理人员工种' },
        { value: 2, key: '综合' },
        { value: 3, key: '架子工' },
        { value: 4, key: '焊工' },
        { value: 5, key: '桩机操作工' },
        { value: 6, key: '爆破工' },
        { value: 7, key: '电工班组' },
        { value: 8, key: '木工班组' },
        { value: 9, key: '混凝土工' },
        { value: 10, key: '钢筋工' },
        { value: 11, key: '安全员' },
        { value: 12, key: '抹灰工' },
        { value: 13, key: '起重工' },
        { value: 14, key: '杂工' },
        { value: 15, key: '其它' },
      ],
    }
    const opts = {
      title: '新增班组',
      id: 'teamAddForm',
      area: ['678px', '468px'],
    }
    if (editData instanceof MouseEvent) {
      opts.content = pt.formTemplate(data)
    } else {
      data.editData = editData
      opts.content = pt.formTemplate(data)
      opts.title = '编辑班组'
    }
    luLayer = new LuLayer(opts)
    form.render()
  }

  form.on('submit(submit)', function (data) {
    luLayer.close()
  })
})
