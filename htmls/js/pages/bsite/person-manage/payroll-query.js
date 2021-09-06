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
    luInnerHeader = new LuInnerHeader({
      title: '工资发放查询',
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
    const selectMonth = [
      { value: 1, key: '一月' },
      { value: 2, key: '二月' },
      { value: 3, key: '三月' },
      { value: 4, key: '四月' },
      { value: 5, key: '五月' },
      { value: 6, key: '六月' },
      { value: 7, key: '七月' },
      { value: 8, key: '八月' },
      { value: 9, key: '九月' },
      { value: 10, key: '十月' },
      { value: 11, key: '十一月' },
      { value: 12, key: '十二月' },
    ]
    new LuSearchForm(
      [
        { label: '工人姓名', type: 'text', name: 's1' },
        { label: '选择班组', type: 'select', selectData: bData, name: 's2' },
        { label: '记工单截止月份', type: 'select', selectData: selectMonth, name: 's3' },
        { label: '所属公司', type: 'select', selectData: cData, name: 's4' },
        { label: '身份证号', type: 'text', name: 's5' },
        {
          label: '发放状态',
          type: 'select',
          selectData: [
            { value: 1, key: '未发放' },
            { value: 2, key: '已发放' },
          ],
          name: 's6',
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
    const tableData = await $lulib.getMockData('/htmls/mock/bsite/payrollQueryData.json', 7, '', false)
    const html = `<span>
                    <span class="{{d.status ? 'table-txt-green' : 'table-txt-red'}}">{{d.status ? '已发放' : '未发放'}}</span>
                  </span>`

    const options = {
      cols: [
        $lulib.tableSetCenter([
          { field: 'id', title: '序号', width: 60 },
          { field: 'n1', title: '姓名', minWidth: 80 },
          { field: 'idNum', title: '身份证号码', minWidth: 220 },
          { field: 'team', title: '班组名称', minWidth: 160 },
          { field: 'company', title: '所属参建公司', minWidth: 220 },
          { field: 'endDate', title: '记工单截止月份', minWidth: 120 },
          { field: 'day', title: '工日（工）', minWidth: 80 },
          { field: 'money', title: '工价（元/工）', minWidth: 90 },
          { field: 'payCount', title: '发放金额（元）', minWidth: 90 },
          { field: 'payDate', title: '发放时间', minWidth: 80 },
          { title: '状态', templet: html, minWidth: 80 },
        ]),
      ],
    }
    luTable = new LuTable(tableData, options)
  }
})
