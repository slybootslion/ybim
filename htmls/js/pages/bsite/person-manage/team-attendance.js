layui.use(['LuCommonTemplate', 'LuLayer'], function () {
  const $ = layui.$

  const LuInnerHeader = layui.LuInnerHeader
  const LuSearchForm = layui.LuSearchForm
  const LuTable = layui.LuTable

  let luInnerHeader, luTable
  !(async () => {
    renderInnerHeader()
    renderSearchForm()
    await renderTable()
  })()

  function renderInnerHeader () {
    luInnerHeader = new LuInnerHeader({
      title: '班组考勤',
    })
  }

  function renderSearchForm () {
    // mock
    const bData = [
      { value: 1, key: '班组1' },
      { value: 2, key: '班组2' },
      { value: 3, key: '班组3' },
    ]
    const cData = [
      { value: 1, key: '公司1' },
      { value: 2, key: '山东荣红生物科技有限公司' },
    ]
    new LuSearchForm(
      [
        { label: '选择时间', type: 'date-d' },
        { label: '选择班组', type: 'select', selectData: bData, name: 's2' },
        { label: '所属公司', type: 'select', selectData: cData, name: 's3' },
      ],
      {
        submit (data) {
          console.log(data)
        },
      },
    )
  }

  async function renderTable () {
    // mock
    const data = await $lulib.getMockData('/htmls/mock/bsite/teamAttendanceTableData.json', 8, '', false)
    const tableOptions = {
      cols: [
        $lulib.tableSetCenter([
          { field: 'date', title: '日期', width: 120 },
          { field: 'team', title: '班组名称', minWidth: 160 },
          { field: 'company', title: '所属参建公司', minWidth: 210 },
          { field: 'count', title: '花名册人数' },
          { field: 'attCount', title: '考勤人数' },
          { field: 'lose', title: '缺卡人数' },
          { field: 'late', title: '迟到人数' },
          { field: 'early', title: '早退人数' },
        ]),
      ],
      ctrlData: [{ eventStr: 'info', iconStr: 'icon-chakanxiangqing', txtStr: '查看工人考勤' }],
      methods: {
        info (data) {
          console.log(data)
          const { id } = data
          $lulib.pagePushHash('bim/person-manage/worker-attendance', { id })
        },
      },
    }

    luTable = new LuTable(data, tableOptions)
  }
})
