layui.use(['LuCommonTemplate', 'LuLayer'], function () {
  const $ = layui.$

  const LuInnerHeader = layui.LuInnerHeader
  const LuSearchForm = layui.LuSearchForm
  const LuTable = layui.LuTable
  const LuLayer = layui.LuLayer

  class PageTemplate {}

  const pt = new PageTemplate()
  let luInnerHeader, luTable
  ;(async () => {
    innerHeaderRender()
    searchFormRender()
    await tableRender()
  })()

  function innerHeaderRender() {
    luInnerHeader = new LuInnerHeader({
      title: '施工二维码',
      rightHtml: [{ txt: '进度二维码' }, { txt: '工艺二维码' }],
    })
  }

  function searchFormRender() {
    new LuSearchForm([
      { label: '施工段落/工艺', type: 'text' },
      { label: '所属段落', type: 'select', selectData: [] },
      { label: '生成日期', type: 'date-s' },
      { label: '类型', type: 'select', selectData: [] },
    ])
  }

  async function tableRender() {
    const tableData = await $lulib.getMockData('/htmls/mock/bim/constructionQrcodeTableData.json', 14, '', false)

    const picTemplate = `<span><div class='table-pic'><img src='{{d.p7}}' alt=''></div></span>`

    const opts = {
      cols: [
        $lulib.tableSetCenter([
          { field: 'id', title: '序号', width: 60 },
          { field: 't1', title: '单项工程名称', minWidth: 210 },
          { field: 't2', title: '标段', minWidth: 120 },
          { field: 't3', title: '施工单位', minWidth: 120 },
          { field: 't4', title: '创建人', width: 110 },
          { field: 't5', title: '生成日期', width: 120 },
          { field: 't6', title: '类型', width: 90 },
          { title: '设备图片', width: 120, templet: picTemplate },
        ]),
      ],
      ctrlData: [
        { eventStr: 'edit', txtStr: '编辑' },
        { eventStr: 'del', txtStr: '删除' },
        { eventStr: 'download', txtStr: '下载二维码' },
        { eventStr: 'info', txtStr: '查看详情' },
      ],
      methods: {
        edit,
        del,
        download,
        info,
      },
    }
    opts.ctrlData.minWidth = 300
    luTable = new LuTable(tableData, opts)
  }

  function edit(data) {
    const { t6: type, id } = data
    if (type === '施工工艺') $lulib.pagePushHash(`bim/progress-control/craft-qrcode?id=${id}`)
    if (type === '施工进度') $lulib.pagePushHash(`bim/progress-control/schedule-qrcode?id=${id}`)
  }

  function del(_, obj) {
    LuLayer.confirm('确定删除？', () => obj.del())
  }

  function download(data) {
    console.log('download qrcode')
  }

  function info(data) {
    const { t6: type, id } = data

    if (type === '施工工艺') $lulib.pagePushHash(`bim/progress-control/craft-info?id=${id}`)

    if (type === '施工进度') $lulib.pagePushHash(`bim/progress-control/schedule-info?id=${id}`)
  }

  $lulib.bindMethod([
    { dom: luInnerHeader.rightBtns[0], method: qr1 },
    { dom: luInnerHeader.rightBtns[1], method: qr2 },
  ])

  function qr1() {
    $lulib.pagePushHash('bim/progress-control/schedule-qrcode')
  }

  function qr2() {
    $lulib.pagePushHash('bim/progress-control/craft-qrcode')
  }
})
