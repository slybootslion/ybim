layui.use(['LuCommonTemplate', 'LuLayer', 'LuUtilsTemplate'], function () {
  const $ = layui.jquery

  const LuInnerHeader = layui.LuInnerHeader
  const LuSearchForm = layui.LuSearchForm
  const LuTable = layui.LuTable

  let luInnerHeader

  ;(async () => {
    innerHeaderRender()
    searchFormRender()
    await tableRender()
  })()

  function innerHeaderRender() {
    luInnerHeader = new LuInnerHeader({
      title: '出库管理',
      rightHtml: [{ txt: '新增出库' }, { txt: '导入' }, { txt: '导出' }],
    })
  }

  function searchFormRender() {
    new LuSearchForm(
      [
        { label: '出库编号', type: 'text' },
        { label: '出库人', type: 'text' },
        {
          label: '领用班组',
          type: 'select',
          selectData: [],
        },
        { label: '领用人', type: 'text' },
        {
          label: '起止时间',
          type: 'date-d',
          options: {
            startName: 'sDate',
            endName: 'eDate',
          },
        },
      ],
      {
        submit(val) {
          console.log(val)
        },
      },
    )
  }

  async function tableRender() {
    const tableData = await $lulib.getMockData('/htmls/mock/bim/stockManageTableData.json', 8, null, false)

    const tableOptions = {
      cols: [
        $lulib.tableSetCenter([
          { type: 'checkbox', width: 50 },
          { field: 'id', title: '序号', width: 60 },
          { field: 't1', title: '出库编号', minWidth: 180 },
          { field: 't4', title: '出库人', width: 90 },
          { field: 't7', title: '领用班组', minWidth: 120 },
          { field: 't5', title: '领用人', width: 90 },
          { field: 't6', title: '出库时间', width: 120 },
        ])
      ],
      ctrlData: [
        {eventStr: 'edit', iconStr: 'icon-bianji', txtStr: '编辑'},
        {eventStr: 'del', iconStr: 'icon-shanchu1', txtStr: '删除'},
        {eventStr: 'info', iconStr: 'icon-chakanxiangqing', txtStr: '查看详情'},
      ],
      methods: {
        edit(obj) {
          $lulib.pagePushHash('bim/material-manage/stock-out-add?id=' + obj.id)
        },
        info(obj) {
          $lulib.pagePushHash('bim/material-manage/stock-out-info?id=' + obj.id)
        }
      }
    }

    const lt = new LuTable(tableData, tableOptions)
  }

  $lulib.bindMethod([{ dom: luInnerHeader.rightBtns[0], method: addOutStock }])

  function addOutStock() {
    $lulib.pagePushHash('bim/material-manage/stock-out-add')
  }
})
