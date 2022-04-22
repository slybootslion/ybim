layui.use(['LuCommonTemplate', 'LuLayer'], function () {
  const $ = layui.$
  const form = layui.form

  const LuInnerHeader = layui.LuInnerHeader
  const LuSearchForm = layui.LuSearchForm
  const LuLayer = layui.LuLayer
  const LuTable = layui.LuTable

  let luInnerHeader, luTable
  ;(async () => {
    renderInnerHeader()
    renderSearchForm()
    await renderTable()
  })()


  function renderInnerHeader () {
    luInnerHeader = new LuInnerHeader({
      title: '合同管理',
      rightHtml: [{ txt: '合同登记' }],
    })
  }

  function renderSearchForm () {
    // mock
    const selectData = [
      { key: '施工', value: 1 },
      { key: '监理', value: 2 },
      { key: '业主', value: 3 },
      { key: '设计', value: 4 },
      { key: '分包', value: 5 },
      { key: '施工合同', value: 6 },
    ]

    new LuSearchForm(
      [
        { label: '合同名称', type: 'text', name: 's1' },
        { label: '合同编号', type: 'text', name: 's2' },
        { label: '选择时间', type: 'date-d' },
        { label: '合同类型', type: 'select', selectData, name: 's4' },
      ],
      {
        submit (data) {
          console.log(data)
        }
      }
    )
  }

  async function renderTable () {
    // mock
    const data = await $lulib.getMockData('/htmls/mock/bjm/contractManagementTableData.json', 12, '', false)
    const linkTemplate = `<span>
      <a class="table-tool-link" download href="{{d.link}}"><span class='iconfont icon-fujian'></span>附件</a>
</span>`

    const options = {
      cols: [
        $lulib.tableSetCenter([
          { field: 'id', title: '序号', width: 60 },
          { field: 't1', title: '合同编号', minWidth: 190, align: 'center' },
          { field: 't2', title: '合同名称', minWidth: 320, align: 'center' },
          { field: 't3', title: '合同类型', width: 120, align: 'center' },
          { field: 't4', title: '合同金额', width: 190, align: 'center' },
          { field: 't5', title: '签订日期', width: 150, align: 'center' },
          { title: '附件', templet: linkTemplate, width: 120, align: 'center' },
        ]),
      ],
      ctrlData: [
        { eventStr: 'edit', iconStr: 'icon-bianji', txtStr: '编辑' },
        { eventStr: 'del', iconStr: 'icon-shanchu1', txtStr: '删除' },
      ],
      methods: {
        edit,
        del,
      },
    }
    luTable = new LuTable(data, options)
  }

  async function edit (data) {
    console.log(data)
  }

  function del (_, obj) {
    LuLayer.confirm('确定删除？', () => obj.del())
  }
})
