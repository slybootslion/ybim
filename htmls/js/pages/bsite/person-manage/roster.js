layui.use(['LuCommonTemplate', 'LuLayer'], function () {
  const $ = layui.$
  const form = layui.form

  const LuInnerHeader = layui.LuInnerHeader
  const LuSearchForm = layui.LuSearchForm
  const LuTable = layui.LuTable
  const LuLayer = layui.LuLayer
  const LuTableSelect = layui.LuTableSelect

  class PageTemplate {
    personFormTemplate(data) {
      let h = '<option value="">请选择参建单位</option>'
      for (let i = 0; i < data.length; i++) {
        h += `<option value='${data[i].value}'>${data[i].key}</option>`
      }

      return `<form class='layui-form layer-form layer-form-flex-colm team-add-form' lay-filter='addForm' action=''>
                <div class='layui-inline'>
                  <label class='layui-form-label'>
                    <span>参建单位：</span>
                  </label>
                  <div class='layui-input-inline'>
                    <select name='t1'>
                      ${h}
                    </select>
                  </div>
                </div>
                <div class='layui-inline'>
                  <label class='layui-form-label'>
                    <span>班组：</span>
                  </label>
                  <div class='layui-input-inline'>
                    <input type='text' name='' placeholder='请选择班组' autocomplete='off' class='layui-input' id='banzuSelectInput'>
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

  let luInnerHeader,
    luTable,
    luLayer,
    luTableSelect = new LuTableSelect()
  !(async () => {
    renderInnerHeader()
    renderSearchForm()
    await renderTable()
  })()

  function renderInnerHeader() {
    luInnerHeader = new LuInnerHeader({
      title: '花名册',
      rightHtml: [{ txt: '人员变动' }, { txt: '进场' }, { txt: '退场' }, { txt: '导出' }],
    })
  }

  function renderSearchForm() {
    // mock data
    const selectData = {
      d1: [
        { key: '公司1', value: 1 },
        { key: '公司2', value: 2 },
      ],
      d2: [
        { key: '建筑工', value: 1 },
        { key: '通风工', value: 2 },
        { key: '钢筋工', value: 3 },
        { key: '木工', value: 4 },
        { key: '杂工', value: 5 },
      ],
      d3: [
        { key: '班组1', value: 1 },
        { key: '班组2', value: 2 },
        { key: '班组3', value: 3 },
        { key: '班组4', value: 4 },
        { key: '班组5', value: 5 },
      ],
    }

    new LuSearchForm(
      [
        { label: '姓名', type: 'text', name: 's1' },
        { label: '身份证号', type: 'text', name: 's2' },
        { label: '所属公司', type: 'select', selectData: selectData.d1, name: 's2' },
        { label: '工种', type: 'select', selectData: selectData.d2, name: 's3' },
        { label: '班组', type: 'select', selectData: selectData.d3, name: 's4' },
        {
          label: '是否进场',
          type: 'select',
          selectData: [
            { key: '是', value: 1 },
            { key: '否', value: 2 },
          ],
          name: 's5',
        },
      ],
      {
        submit(data) {
          console.log(data)
        },
      },
    )
  }

  async function renderTable() {
    // mock
    const data = await $lulib.getMockData('/htmls/mock/bsite/rosterTableData.json', 12, '', false)
    const options = {
      cols: [
        $lulib.tableSetCenter([
          { type: 'checkbox', width: 41 },
          { type: 'numbers', title: '序号', width: 60 },
          { field: 'name', title: '姓名', width: 103 },
          { field: 'idNum', title: '身份证号', minWidth: 156 },
          { field: 'phone', title: '手机号码', width: 122 },
          { field: 'gender', title: '性别', width: 81 },
          { field: 'company', title: '所属参建单位', width: 172 },
          { field: 'type', title: '工种', width: 102 },
          { field: 'team', title: '班组', width: 102 },
          { field: 'inTime', title: '进场时间', width: 144 },
          { field: 'outTime', title: '退场时间', width: 144 },
          { field: 'status', title: '人员状态', width: 84 },
          { field: 'regType', title: '注册类型', width: 84 },
        ]),
      ],
      ctrlData: [{ eventStr: 'info', iconStr: 'icon-chakanxiangqing', txtStr: '查看详情' }],
      methods: { info },
      hideHeadCheck: true,
    }
    luTable = new LuTable(data, options)
  }

  $lulib.bindMethod([
    { dom: luInnerHeader.rightBtns[0], method: personnelChanges },
    { dom: luInnerHeader.rightBtns[1], method: personnelIn },
    { dom: luInnerHeader.rightBtns[2], method: personnelOut },
    { dom: luInnerHeader.rightBtns[3], method: ExportFile },
  ])

  function personnelChanges() {
    if (!$lulib.checkSelected(luTable)) return false
    const data = [
      { key: '单位1', value: 1 },
      { key: '单位2', value: 2 },
      { key: '单位3', value: 3 },
      { key: '单位4', value: 4 },
      { key: '单位5', value: 5 },
      { key: '单位6', value: 6 },
      { key: '单位7', value: 7 },
      { key: '单位8', value: 8 },
    ]
    const content = pt.personFormTemplate(data)
    const opts = {
      title: '人员变动',
      id: 'rosterChangeForm',
      area: ['778px', '328px'],
      content,
    }
    luLayer = new LuLayer(opts)
    form.render()
    luTableSelect.render({
      elem: '#banzuSelectInput',
      checkedKey: 'id',
      table: innerTableOpts(),
      search(keyword, searchTable) {
        const d = innerTableOpts()
        d.data = [
          {
            id: 1,
            teamName: 'change test',
            personNum: '12',
            groupLeader: '田鹏',
          },
          {
            id: 2,
            teamName: '123',
            personNum: '15',
            groupLeader: '田鹏',
          },
        ]
        searchTable.reload(d)
      },
      done(el, data) {
        const arr = []
        layui.each(data.data, function (index, item) {
          arr.push(item.teamName)
        })
        el.val(arr.join(','))
      },
    })
  }

  function personnelIn() {
    if (!$lulib.checkSelected(luTable)) return false
  }

  function personnelOut() {
    if (!$lulib.checkSelected(luTable)) return false
  }

  function ExportFile() {
    if (!$lulib.checkSelected(luTable)) return false
  }

  function info(data) {
    $lulib.pagePushHash('bim/person-manage/roster-detail', { id: data.id })
  }

  function innerTableOpts() {
    /*mock data*/
    const data = [
      {
        id: 1,
        teamName: '混凝土班组',
        personNum: '12',
        groupLeader: '田鹏',
      },
      {
        id: 2,
        teamName: '电工班',
        personNum: '15',
        groupLeader: '田鹏',
      },
      {
        id: 3,
        teamName: '混凝土班组',
        personNum: '13',
        groupLeader: '田鹏',
      },
      {
        id: 4,
        teamName: '电工班',
        personNum: '16',
        groupLeader: '田鹏',
      },
    ]
    return {
      data,
      page: {
        layout: ['prev', 'page', 'next', 'count'],
      },
      cols: [
        [
          { type: 'radio' },
          { field: 'teamName', title: '班组名称' },
          { field: 'personNum', title: '班组人数' },
          { field: 'groupLeader', title: '班组长' },
        ],
      ],
    }
  }
})
