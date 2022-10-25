layui.use(['LuCommonTemplate', 'LuLayer'], function () {
  const $ = layui.$
  const form = layui.form
  const laydate = layui.laydate

  const LuInnerHeader = layui.LuInnerHeader
  const LuSearchForm = layui.LuSearchForm

  let luInnerHeader

  const equipmentList = [
    { id: 1, title: '路面机械' }, { id: 2, title: '起重机械' }, { id: 3, title: '混凝土机械' },
    { id: 4, title: '隧道机械' }, { id: 5, title: '桩工机械' }, { id: 6, title: '桥梁机械' },
    { id: 7, title: '养路机械' }, { id: 8, title: '压实机械' }, { id: 9, title: '土方机械' },
    { id: 10, title: '港口机械' }, { id: 11, title: '沥青设备' }, { id: 12, title: '通用机械' },
  ]

  class PageTemplate {
  }

  const pt = new PageTemplate()

  ;(async () => {
    innerHeaderRender()
    searchFormRender()
    await tableRender()
  })()

  function innerHeaderRender () {
    luInnerHeader = new LuInnerHeader({
      title: '设备监测',
    })
  }

  function searchFormRender () {
    new LuSearchForm([
      { label: '设备名称', type: 'text' },
      { label: '设备编号', type: 'text' },
      {
        label: '设备类型', type: "select",
        selectData: equipmentList.map(i => ({ value: i.id, key: i.title }))
      },
      {
        label: '使用状态',
        type: 'select',
        selectData: [
          { value: '1', key: '正常' },
          { value: '2', key: '异常' },
        ],
      },
    ])
  }

  function tableRender () {
  }
})
