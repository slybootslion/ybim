layui.use(['LuCommonTemplate'], function () {
  const $ = layui.$
  const LuTable = layui.LuTable
  const LuLayer = layui.LuLayer

  let luTable
  !(() => {
    renderTable()
  })()

  async function renderTable () {
    const tableData = await $lulib.getMockData('/qljcs/mock/warningSettingTableData.json', 8, null, false)
    const options = {
      cols: [
        $lulib.tableSetCenter([
          { field: 'id', title: '编号', width: 60 },
          { field: 't1', title: '传感器编号', minWidth: 140 },
          { field: 't2', title: '设备类型', minWidth: 180 },
          { field: 't3', title: '设备名称', minWidth: 180 },
          { field: 't4', title: '一级预警', width: 100, },
          { field: 't5', title: '二级预警', width: 100 },
          { field: 't6', title: '三级预警', width: 100 },
          { field: 't7', title: '四级预警', width: 100 },
          { field: 't8', title: '预警接收人', width: 160 },
          { field: 't9', title: '接收人电话', width: 180 },
        ]),
      ],
      ctrlData: [
        { eventStr: 'edit', iconStr: 'icon-bianji1', txtStr: '编辑' },
        { eventStr: 'del', iconStr: 'icon-shanchu', txtStr: '删除' },
      ],
      methods: {
        edit (data) {
          console.log(data)
          goFormPage(data.id)
        },
        del (_, obj) {
          LuLayer.confirm('确定删除？', () => obj.del())
        },
      },
      limit: 18
    }
    luTable = new LuTable(tableData, options)
  }

  function goFormPage (editId) {
    let url = 'warning-message/warning-form'
    if (editId) {
      url += `?id=${editId}`
    }
    $lulib.pagePushHash(url)
  }

  $(".add-warning").on('click', () => goFormPage());

})
