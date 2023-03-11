layui.use(['form', 'LuCommonTemplate'], function () {
  const $ = layui.$
  const layuiForm = layui.form;
  const LuTable = layui.LuTable

  let luTable;

  async function renderTable () {
    const data = await $lulib.getMockData('/scjyglxt/mock/assetsData.json', 8, null, false)
    const linkTemplate = `
      <span>
        <a href="javascript:void(0)" class="table-tool-link" lay-event="m1" title="a">
          <span class="iconfont icon-bianji"></span>
        </a>
        <a href="javascript:void(0)" class="table-tool-link" lay-event="m2" title="b">
          <span class="iconfont icon-mima"></span>
        </a>
        <a href="javascript:void(0)" class="table-tool-link" lay-event="m3" title="c">
          <span class="iconfont icon-xiangmu"></span>
        </a>
      </span>      
    `
    const tableOptions = {
      cols: [
        $lulib.tableSetCenter([
          { field: 'id', title: '编号', width: 60 },
          { field: 't1', title: '资产编码', width: 160 },
          { field: 't2', title: '资产类型', width: 120 },
          { field: 't3', title: '名称', width: 260 },
          { field: 't4', title: '品牌', width: 200 },
          { field: 't5', title: '规格型号', width: 130 },
          { field: 't6', title: '采购时间', width: 160 },
          { field: 't7', title: '使用部门', width: 260 },
          { field: 't8', title: '使用人', width: 90 },
          { field: 't9', title: '管理人', width: 90 },
          { field: 't10', title: '资产状态', width: 90 },
          { title: '操作', templet: linkTemplate, align: 'center' },
        ]),
      ],
      limit: 16,
      methods: { m1, m2, m3 },
    }
    luTable = new LuTable(data, tableOptions)
    luTable.tableOn()
  }

  function m1 () {
    console.log('m1')
  }

  function m2 () {
    console.log('m2')
  }

  function m3 () {
    console.log('m3')
  }

  renderTable()
})
