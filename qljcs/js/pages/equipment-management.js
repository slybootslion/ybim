layui.use(['LuCommonTemplate'], function () {
  const $ = layui.$

  const LuSearchForm = layui.LuSearchForm
  const LuTable = layui.LuTable
  let luTable
  (() => {
    renderTable()
  })()
  const luSearchForm = new LuSearchForm([
    { label: '设备属性', type: 'select', selectData: [], name: 's1' },
    { label: '设备类型', type: 'select', selectData: [], name: 's2' },
    {
      label: '设备状态', type: 'select',
      selectData: [{ key: '在线', value: '1' }, { key: '离线', value: '2' }], name: 's3'
    },
  ], {
    submit (data) {
      console.log(data)
    }
  })

  async function renderTable () {
    const data = await $lulib.getMockData('/qljcs/mock/equipmentManagementTableData.json', 8, null, false)
    const tableOptions = {
      cols: [
        $lulib.tableSetCenter([
          { field: 'id', title: '编号', width: 60 },
          { field: 't1', title: '设备属性', width: 90 },
          { field: 't2', title: '设备类型', minWidth: 120 },
          { field: 't3', title: '设备名称', minWidth: 120 },
          { field: 't4', title: '安装位置', minWidth: 150 },
          { field: 't5', title: '安装时间', width: 110 },
          { field: 't6', title: '设备状态', width: 120 },
          { field: 't7', title: '通讯状态', width: 120 },
          { field: 't8', title: '通讯等级', width: 120 },
        ]),
      ],
      ctrlData: [
        { eventStr: 'edit', iconStr: 'icon-bianji1', txtStr: '编辑' },
        { eventStr: 'del', iconStr: 'icon-shanchu', txtStr: '删除' },
      ],
      methods: {
        edit (data) {
          console.log(data)
        },
        del (_, obj) {
          obj.del()
          // LuLayer.confirm('确定删除？', () => obj.del())
        },
      },
    }
    luTable = new LuTable(data, tableOptions)
  }
})
