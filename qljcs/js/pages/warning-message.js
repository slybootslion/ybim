layui.use(['LuCommonTemplate'], function () {
  const $ = layui.$
  const LuTable = layui.LuTable
  let luTable
  (async () => {
    await renderTable()
  })()

  $(".selectBridge .btn-item").on('click', async function () {
    const isActive = $(this).hasClass('active')
    if (isActive) return
    $(this).addClass('active').siblings('.btn-item').removeClass('active')
    await renderTable()
  });

  async function getTableData () {
    return $lulib.getMockData('/qljcs/mock/warningMessageTableData.json', 3, null, false)
  }

  async function renderTable () {
    const dict = { 1: 'red', 2: 'orange', 3: 'yellow', 4: 'blue' }
    const handleT4Template = d => {
      const t4 = d.t4
      if (!t4) return t4 + '级'
      return `<span class="iconfont icon-yujing ${dict[d.t4]}"></span>`
    }
    const tableOptions = {
      cols: [
        $lulib.tableSetCenter([
          { field: 'id', title: '编号', width: 60 },
          { field: 't1', title: '设备类型', width: 150 },
          { field: 't2', title: '设备名称', minWidth: 120 },
          { field: 't3', title: '安装位置', minWidth: 150 },
          { title: '预警等级', width: 90, templet: handleT4Template },
          { field: 't5', title: '报警信息', minWidth: 130 },
          { field: 't6', title: '产生次数', width: 120 },
          { field: 't7', title: '告警时间', width: 140 },
        ]),
      ],
      limit: 18,
    }
    const data = await getTableData()
    luTable = new LuTable(data, tableOptions)
  }

  $(".setting-warning").on('click',() => $lulib.pagePushHash('warning-message/warning-setting'));
})
