layui.use(['LuCommonTemplate', 'echarts'], function () {
  const $ = layui.$
  const LuSearchForm = layui.LuSearchForm
  let luSearchForm

  ;(() => {
    renderSearch()
  })()

  function renderSearch () {
    luSearchForm = new LuSearchForm([
      { label: '设备编号', type: 'text', name: 't1' },
      { label: '设备类型', type: 'select', selectData: [], name: 's1' },
      { label: '设备名称', type: 'select', selectData: [], name: 's2' },
    ], {
      submit (data) {
        console.log(data)
      }
    })
  }
})
