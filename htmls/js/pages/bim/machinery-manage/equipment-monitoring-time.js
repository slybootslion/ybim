layui.use(['LuCommonTemplate', 'LuLayer'], function () {
  const $ = layui.$
  const LuInnerHeader = layui.LuInnerHeader
  const element = layui.element
  const LuTable = layui.LuTable

  let luInnerHeader, luTable
  ;(async () => {
    innerHeaderRender()
    tableRender()
  })()

  function innerHeaderRender () {
    luInnerHeader = new LuInnerHeader({
      title: '设备监测',
      rightHtml: [{ txt: '返回', isWeaken: true }],
    })
  }

  $lulib.bindMethod([{ dom: luInnerHeader.rightBtns[0], method: () => $lulib.pageGoBack() }])

  async function tableRender () {
    const tableData = await $lulib.getMockData('/htmls/mock/bim/equipmentMonitoringTimeTableData.json', 17, '', false)
    console.log(tableData)
    const tableOptions = {
      cols: [[
        { field: 't1', title: '日期' },
        { field: 't2', title: '运行时长' },
        { field: 't3', title: '怠速时长' },
        { field: 't4', title: '静止时长' },
      ]],
      ctrlData: [
        { eventStr: 'info', txtStr: '查看详情' },
      ],
      methods: { info },
      limit: 8,
    }
    luTable = new LuTable(tableData, tableOptions)
  }

  function info (data) {
    console.log(data)
  }


  // tabs change
  const showExportTableButton = idx => {
    const $btn = $(".table-out-btn")
    idx === 0 ? $btn.removeClass('hide') : $btn.addClass('hide')
  }
  element.on('tab(role)', data => {
    showExportTableButton(data.index)
    console.log($('.luTable'))
  })
})
