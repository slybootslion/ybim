layui.use(['LuCommonTemplate', 'LuLayer', 'LuUtilsTemplate'], function () {
  const $ = layui.jquery

  const LuInnerHeader = layui.LuInnerHeader
  const LuSearchForm = layui.LuSearchForm
  const LuTable = layui.LuTable
  const LuLayer = layui.LuLayer

  let luInnerHeader
  ;(async () => {
    innerHeaderRender()
    searchFormRender()
    await tableRender()
  })()

  function innerHeaderRender() {
    luInnerHeader = new LuInnerHeader({
      title: '入库管理',
      rightHtml: [{ txt: '新增入库' }, { txt: '导入' }, { txt: '导出' }],
    })
  }

  function searchFormRender() {
    new LuSearchForm([
      { label: '入库编号', type: 'text' },
      { label: '合同订单号', type: 'text' },
      {
        label: '供应商',
        type: 'select',
        selectData: [],
      },
      { label: '入库人', type: 'text' },
      {
        label: '起止时间',
        type: 'date-d',
        options: {
          startName: 'sDate',
          endName: 'eDate',
        },
      },
    ])
  }

  async function tableRender() {
    const tableData = await $lulib.getMockData('/htmls/mock/bim/stockManageTableData.json', 8, null, false)

    const tableOptions = {
      cols: [
        $lulib.tableSetCenter([
          { type: 'checkbox', width: 50 },
          { field: 'id', title: '序号', width: 60 },
          { field: 't1', title: '入库编号', minWidth: 180 },
          { field: 't2', title: '合同订单编号', minWidth: 120 },
          { field: 't3', title: '供应商', minWidth: 120 },
          { field: 't4', title: '验收人', width: 90 },
          { field: 't5', title: '入库人', width: 90 },
          { field: 't6', title: '入库时间', width: 120 },
        ]),
      ],
      ctrlData: [
        { eventStr: 'edit', iconStr: 'icon-bianji', txtStr: '编辑' },
        { eventStr: 'del', iconStr: 'icon-shanchu1', txtStr: '删除' },
        { eventStr: 'info', iconStr: 'icon-chakanxiangqing', txtStr: '查看详情' },
      ],
      methods: {
        edit(obj) {
          $lulib.pagePushHash('bim/material-manage/stock-in-add?id=' + obj.id)
        },
        info(obj) {
          $lulib.pagePushHash('bim/material-manage/stock-in-info?id=' + obj.id)
        },
        del(obj) {
          LuLayer.confirm('确定删除？', () => obj.del())
        },
      },
    }

    const lt = new LuTable(tableData, tableOptions)
  }

  $lulib.bindMethod([{ dom: luInnerHeader.rightBtns[0], method: addInStock }])

  function addInStock() {
    $lulib.pagePushHash('bim/material-manage/stock-in-add')
  }
})
