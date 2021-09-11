layui.use(['LuCommonTemplate'], function () {
  const $ = layui.$
  const LuInnerHeader = layui.LuInnerHeader
  const LuSearchForm = layui.LuSearchForm
  const LuTable = layui.LuTable

  !(() => {
    innerHeaderRender()
    searchFormRender()
    tableRender()
  })()

  function innerHeaderRender() {
    new LuInnerHeader({ title: '库存管理', rightHtml: [{ txt: '导出' }] })
  }

  function searchFormRender() {
    new LuSearchForm([
      {
        label: '货物类别',
        type: 'select',
        selectData: [
          {value: 1, key: '11', selected: true},
          {value: 2, key: '12'}
        ],
      },
      { label: '货品名称', type: 'text'},
    ], {
      submit(v, a) {}
    })
  }

  async function tableRender() {
    const tableData = await $lulib.getMockData('/htmls/mock/bim/inventoryManageTableData.json', 13, '', false)

    const t7Template = `<span>
                          <span class="{{d.t9 > 0 || d.t11 < 0 ? 'layui-badge' : ''}}">{{d.t7}}</span>
                       </span>`

    const t9Template = `<span>
                          <span class="{{d.t9 > 0 ? 'count-warning' : ''}}">{{d.t9}}</span>
                        </span>`

    const t11Template = `<span>
                           <span class="{{d.t11 < 0 ? 'count-warning' : ''}}">{{d.t11}}</span>
                         </span>`

    const tableOptions = {
      cols: [
        $lulib.tableSetCenter([
          { type: 'checkbox', width: 50 },
          { field: 'id', title: '序号', width: 60 },
          { field: 't1', title: '货物名称', minWidth: 180 },
          { field: 't2', title: '货物类别', minWidth: 120 },
          { field: 't3', title: '规格型号', minWidth: 120 },
          { field: 't4', title: '单位', width: 90 },
          { field: 't5', title: '单价', width: 110 },
          { field: 't6', title: '库存金额', minWidth: 160 },
          { title: '当前库存', templet: t7Template, width: 110 },
          { field: 't8', title: '库存上限', width: 90 },
          { title: '超储量', templet: t9Template, width: 90 },
          { field: 't10', title: '库存下限', width: 90 },
          { title: '短缺量', templet: t11Template, width: 90 },
          { field: 't12', title: '最后更新时间', width: 200 },
        ])
      ],
    }
    const table = new LuTable(tableData, tableOptions)
  }
})
