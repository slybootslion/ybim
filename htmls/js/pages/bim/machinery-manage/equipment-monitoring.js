layui.use(['LuCommonTemplate', 'LuLayer'], function () {
  const $ = layui.$
  const form = layui.form
  const laydate = layui.laydate

  const LuInnerHeader = layui.LuInnerHeader
  const LuSearchForm = layui.LuSearchForm
  const LuTable = layui.LuTable

  let luInnerHeader, luTable

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

  async function tableRender () {
    const tableData = await $lulib.getMockData('/htmls/mock/bim/equipmentTableData.json', 17, '', false)
    const template = `
      <span>
        <div class="table-statue">
          <span class="point {{d.t7 === '正常' ? 'green' : 'red'}}"></span>
          <span class="{{d.t7 === '正常' ? '' : 'red-text'}}" lay-event>
            {{d.t7}}
          </span>
        </div>
      </span>
    `
    const tableOptions = {
      cols: [
        $lulib.tableSetCenter([
          { type: 'checkbox', width: 50 },
          { field: 'id', title: '序号', width: 60 },
          { field: 't1', title: '设备名称', minWidth: 180 },
          {
            title: '设备图片',
            width: 120,
            templet: '<span><div class="table-pic"><img src="{{d.t2}}" alt=""></div></span>',
          },
          { field: 't3', title: '设备编号', minWidth: 120 },
          { field: 't11', title: '设备类型', width: 100 },
          { title: '设备状态', width: 110, templet: template },
          { field: 't12', title: '持续时长', width: 130 },
          { field: 't13', title: '当前油量', minWidth: 130 },
        ]),
      ],
      ctrlData: [
        { eventStr: 'm1', txtStr: '工时' },
        { eventStr: 'm2', txtStr: '轨迹' },
        { eventStr: 'm3', txtStr: '油量' },
        { eventStr: 'm4', txtStr: '定位' }
      ],
      methods: {
        m1, m2, m3, m4
      },
    }
    luTable = new LuTable(tableData, tableOptions)
  }

  function m1 (data) {
    const { id } = data
    $lulib.pagePushHash(`bim/machinery-manage/equipment-monitoring-time?id=${id}`)
  }

  function m2 (data) {
    const {id} = data
    $lulib.pagePushHash(`bim/machinery-manage/equipment-monitoring-track?id=${id}`)
  }

  function m3 (data) {
    const { id } = data
    $lulib.pagePushHash(`bim/machinery-manage/equipment-monitoring-oil?id=${id}`)
  }

  function m4 (data) {

  }
})
