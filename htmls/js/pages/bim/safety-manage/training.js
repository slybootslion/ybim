layui.use(['LuCommonTemplate', 'LuLayer'], function () {
  const $ = layui.$
  const LuInnerHeader = layui.LuInnerHeader
  const LuSearchForm = layui.LuSearchForm
  const LuLayer = layui.LuLayer
  const LuTable = layui.LuTable

  let luInnerHeader, params, luTable

  class PageTemplate {

  }

  const pt = new PageTemplate();
  (async () => {
    innerHeaderRender()
    renderSearchForm()
    await renderTable()
  })()

  function innerHeaderRender () {
    luInnerHeader = new LuInnerHeader({
      title: '教育培训',
      rightHtml: [{ txt: '新增培训' }],
    })
  }

  function renderSearchForm () {
    new LuSearchForm(
      [
        { label: '教育名称', type: 'text', name: 's1' },
        { label: '培训时间', type: 'date-d' },
        { label: '培训地点', type: 'text', name: 's2' },
      ],
      {
        submit (data) {
          console.log(data)
        }
      }
    )
  }

  async function renderTable() {
    const tableData = await $lulib.getMockData('/htmls/mock/bjm/safetyTrainingTabelData.json', 12, '', false)
    console.log(tableData)
    const options = {
      cols: [
        $lulib.tableSetCenter([
          { field: 'id', title: '序号', width: 60 },
          { field: 't1', title: '时间', minWidth: 160, align: 'center' },
          { field: 't2', title: '培训名称', minWidth: 400, align: 'center' },
          { field: 't3', title: '培训地点', minWidth: 180, align: 'center' },
          { field: 't4', title: '组织部门', minWidth: 160, align: 'center' },
          { field: 't5', title: '主讲人', width: 150, align: 'center' },
        ]),
      ],
      ctrlData: [
        { eventStr: 'edit', iconStr: 'icon-bianji', title: '编辑' },
        { eventStr: 'del', iconStr: 'icon-shanchu1', title: '删除' },
        { eventStr: 'm1', iconStr: 'icon-chakanxiangqing', title: '详情' },
        { eventStr: 'm2', iconStr: 'icon-xinzeng', title: '添加' },
      ],
      methods: {
        edit,
        del,
        m1,
        m2
      },
    }
    luTable = new LuTable(tableData, options)
  }


  async function edit (data) {
    console.log(data)
  }

  function del (_, obj) {
    LuLayer.confirm('确定删除？', () => obj.del())
  }

  function m1(data) {
    console.log(data)
  }

  function m2(data) {
    console.log(data)
  }

})
