layui.use(['LuCommonTemplate', 'LuUtilsTemplate'], function () {
  const $ = layui.$

  const LuInnerHeader = layui.LuInnerHeader
  const LuSearchForm = layui.LuSearchForm
  const LuTable = layui.LuTable

  class PageTemplate {}

  const pt = new PageTemplate()

  let luInnerHeader, luTable
  !(() => {
    new LuInnerHeader({ title: '运营期养护' })
    renderSearchForm()
    renderTable()
  })()

  function renderSearchForm() {
    new LuSearchForm([
      {
        label: '标段',
        type: 'select',
        selectData: [
          { value: '1', key: 'A标段' },
          { value: '2', key: 'B标段' },
        ],
        name: 's3',
      },
    ])
  }

  async function renderTable() {
    const tableData = await $lulib.getMockData('/htmls/mock/bim/constructionQualityTableData.json', 7, '', false)
    const templet = `<span><span class="{{d.t6 === '严重' ? 'yellow' : (d.t6 === '重大' ? 'red': '')}}">{{d.t6}}</span></span>`
    const options = {
      cols: [
        $lulib.tableSetCenter([
          { field: 'id', title: '序号', width: 60 },
          { field: 't1', title: '养护部位', minWidth: 180 },
          { field: 't2', title: '所属区域', minWidth: 180 },
          { field: 't3', title: '养护负责人', width: 100 },
          { field: 't4', title: '整改责任人', width: 100 },
          { field: 't5', title: '问题描述', minWidth: 360 },
          { title: '等级', width: 80, templet },
          { field: 't7', title: '上报时间', width: 120 },
          { field: 't8', title: '期望整改时间', width: 120 },
          { field: 't9', title: '状态', width: 80 },
        ]),
      ],
      ctrlData: [{ eventStr: 'info', txtStr: '查看详情' }],
      methods: { info },
    }
    luTable = new LuTable(tableData, options)
  }

  function info(data) {
    $lulib.pagePushHash(`bim/quality-manage/construction-info?id=${data.id}`)
  }
})
