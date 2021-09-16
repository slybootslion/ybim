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

  function renderInnerHeader() {
    luInnerHeader = new LuInnerHeader({ title: '工人进退场查询', rightHtml: [{ txt: '导出' }] })
  }

  function renderSearchForm() {
    new LuSearchForm([{ label: '选择时间', type: 'date-d' }], {
      submit(data) {
        console.log(data)
      },
    })
  }

  async function renderTable() {
    const res = await $lulib.getMockData('/htmls/mock/bsite/entryExitQueryTableData.json', 8, '', false)
    const options = {
      cols: [
        $lulib.tableSetCenter([
          { type: 'checkbox', width: 41 },
          { type: 'numbers', title: '序号', width: 60 },
          { field: 'n1', title: '姓名' },
          { field: 'idNum', title: '身份证号', minWidth: 230 },
          { field: 'gender', title: '性别' },
          { field: 'type', title: '工种' },
          { field: 'team', title: '班组' },
          { field: 'inTime', title: '进场时间' },
          { field: 'outTime', title: '退场时间' },
          { field: 'company', title: '参建公司', minWidth: 290 },
        ]),
      ],
      hideHeadCheck: true,
    }
    luTable = new LuTable(res, options)
  }
})
// 950618
