layui.use(['LuCommonTemplate'], function () {
  const $ = layui.$

  const LuInnerHeader = layui.LuInnerHeader
  const LuSearchForm = layui.LuSearchForm
  const LuTable = layui.LuTable

  class PageTemplate {}

  const pt = new PageTemplate()

  let luInnerHeader, luTable
  !(async () => {
    renderInnerHeader()
    renderSearchForm()
    await renderTable()
  })()

  function renderInnerHeader() {
    luInnerHeader = new LuInnerHeader({
      title: '工人考勤',
      rightHtml: [{ txt: '下载工人考勤' }],
    })
  }

  function renderSearchForm() {
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
    new LuSearchForm([
      { label: '选择时间', type: 'date-d', name: 's1' },
      { label: '工人姓名', type: 'text', name: 's2' },
      { label: '选择班组', type: 'select', selectData: bData, name: 's3' },
      { label: '所属公司', type: 'select', selectData: cData, name: 's4' },
    ], {
      submit(data) {
        console.log(data)
      }
    })
  }

  async function renderTable() {
    // mock
    const data = await $lulib.getMockData('/htmls/mock/bsite/workerAttendanceTableData.json', 13, '', false)
    const template = `
      <span>
        <span class="layui-badge {{d.outTime === '/' ? '' : 'layui-bg-green'}}" lay-event>
          {{d.outTime === '/' ? '异常' : '正常'}}
        </span>
      </span>
    `
    const options = {
      cols: [
        $lulib.tableSetCenter([
          { type: 'checkbox', width: 41 },
          { field: 'date', title: '日期', width: 120 },
          { field: 'name', title: '姓名', minWidth: 90 },
          { field: 'idNum', title: '身份证号', minWidth: 230 },
          { field: 'team', title: '所属班组', minWidth: 120 },
          { field: 'company', title: '所属参建公司', minWidth: 210 },
          { field: 'type', title: '工种' },
          { field: 'personType', title: '人员角色', minWidth: 90 },
          { field: 'workHour', title: '工时', width: 60 },
          { field: 'validHour', title: '有效工时', width: 60 },
          { field: 'inTime', title: '进场时间', width: 144 },
          { field: 'outTime', title: '退场时间', width: 144 },
          { title: '备注', templet: template },
        ]),
      ],
      hideHeadCheck: true
    }

    luTable = new LuTable(data, options)
  }
})
