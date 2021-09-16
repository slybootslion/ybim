layui.use(['LuCommonTemplate', 'LuLayer'], function () {
  const $ = layui.$

  const LuInnerHeader = layui.LuInnerHeader
  const LuSearchForm = layui.LuSearchForm
  const LuTable = layui.LuTable
  const LuLayer = layui.LuLayer

  let luInnerHeader, luTable
  !(async () => {
    renderInnerHeader()
    renderSearchForm()
    await renderTable()
  })()

  function renderInnerHeader() {
    luInnerHeader = new LuInnerHeader({
      title: '人员注册',
      rightHtml: [{ txt: '添加', icon: 'icon-renyuantianjia' }],
    })
  }

  function renderSearchForm() {
    new LuSearchForm(
      [
        { label: '姓名', type: 'text', name: 's1' },
        { label: '身份证号', type: 'text', name: 's2' },
        { label: '所属公司', type: 'select', selectData: [], name: 's3' },
        { label: '工种', type: 'select', selectData: [], name: 's4' },
      ],
      {
        submit(data) {
          console.log(data)
        },
      },
    )
  }

  async function renderTable() {
    const tableData = await $lulib.getMockData('/htmls/mock/bsite/personnelRegistrationTableData.json', 12, '', false)
    const options = {
      cols: [
        $lulib.tableSetCenter([
          { type: 'numbers', title: '序号', width: 90 },
          { field: 'name', title: '姓名', width: 120 },
          { field: 'idNum', title: '身份证号', minWidth: 220 },
          { field: 'position', title: '职务', width: 120 },
          { field: 'age', title: '年龄', width: 90 },
          { field: 'phone', title: '手机号码', width: 180 },
          { field: 'type', title: '工种', width: 120 },
          { field: 'regType', title: '注册类型', width: 120 },
          { field: 'issAuthority', title: '发证机关', minWidth: 220 },
        ]),
      ],
      ctrlData: [
        { eventStr: 'edit', iconStr: 'icon-bianji', txtStr: '编辑' },
        { eventStr: 'del', iconStr: 'icon-shanchu1', txtStr: '删除' },
        { eventStr: 'info', iconStr: 'icon-chakanxiangqing', txtStr: '查看详情' },
      ],
      methods: { edit, del, info },
    }
    luTable = new LuTable(tableData, options)
  }

  const url = 'bim/person-manage/personnel-registration-step'

  function edit(data) {
    $lulib.pagePushHash(url, { id: data.id })
  }

  function del(_, obj) {
    LuLayer.confirm('确定删除？', () => obj.del())
  }

  function info(data) {
    $lulib.pagePushHash(url, { id: data.id, type: 4 })
  }

  function add() {
    $lulib.pagePushHash(url)
  }

  $lulib.bindMethod([{ dom: luInnerHeader.rightBtns[0], method: add }])
})
