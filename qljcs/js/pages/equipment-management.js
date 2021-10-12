layui.use(['LuCommonTemplate'], function () {
  const $ = layui.$

  const LuSearchForm = layui.LuSearchForm

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
})
