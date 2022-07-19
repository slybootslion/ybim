layui.use(['LuCommonTemplate'], function () {
  const $ = layui.$
  const LuSearchForm = layui.LuSearchForm
  const LuTable = layui.LuTable
  const LuLayer = layui.LuLayer
  let luTable, luLayer

  ;(async () => {
    await renderTable()
  })()

  const luSearchForm = new LuSearchForm([
    { label: '设备属性', type: 'select', selectData: [], name: 's1' },
    { label: '设备类型', type: 'select', selectData: [], name: 's2' },
    {
      label: '设备状态', type: 'select',
      selectData: [{ key: '在线', value: '1' }, { key: '离线', value: '2' }], name: 's3'
    },
  ], {
    titleLeft: '设备管理',
    submit (data) {
      console.log(data)
    }
  })

  async function renderTable () {
    const data = await $lulib.getMockData('/bpjcs/mock/equipmentManagementTableData.json', 8, null, false)

    const tableTemplate1 = d => `<span>${d.t7}, ${d.t8}</span>`
    const tableTemplate2 = d => `<span>${d.t9}, ${d.t10}</span>`
    const tableTemplate3 = d => `<span>${d.t11}, ${d.t12}</span>`
    const tableTemplate4 = d => `<span>${d.t13}, ${d.t14}</span>`

    const tableOptions = {
      cols: [
        $lulib.tableSetCenter([
          { field: 'id', title: '编号', width: 60 },
          { field: 't1', title: '设备类型', width: 90 },
          { field: 't3', title: '设备名称' },
          { field: 't4', title: '安装位置' },
          { field: 't5', title: '安装时间', width: 110 },
          { field: 't6', title: '设备状态', width: 120 },
          { title: '一级阈值', templet: tableTemplate1 },
          { title: '二级阈值', templet: tableTemplate2 },
          { title: '三级阈值', templet: tableTemplate3 },
          { title: '四级阈值', templet: tableTemplate4 },
          { field: 't15', title: '预警接收人', width: 120 },
          { field: 't16', title: '接收电话', width: 120 },
        ]),
      ],
      ctrlData: [
        { eventStr: 'edit', iconStr: 'icon-bianji', txtStr: '编辑' },
      ],
      methods: {
        edit (data) {
          $lulib.pagePushHash(`equipment/equipment-form?id=${data.id}`)
        },
      },
    }
    tableOptions.ctrlData.minWidth = 120
    luTable = new LuTable(data, tableOptions)
  }
})
