layui.use(['LuCommonTemplate', 'LuUtilsTemplate'], function () {
  const $ = layui.$

  const LuInnerHeader = layui.LuInnerHeader
  const LuSearchForm = layui.LuSearchForm
  const LuTable = layui.LuTable

  class PageTemplate {
    statistic(data) {
      const full = 295
      const strokeDasharrayX = `${data.percent * full}px`
      return `
        <div class='left'>
          <div class='chart'>
            <div class='display-circle'>
              <div class='sector'>
                <svg class='ant-progress-circle ' viewBox='0 0 100 100'>
                  <path class='ant-progress-circle-trail' d='M 50,50 m 0,-47a 47,47 0 1 1 0,94a 47,47 0 1 1 0,-94'
                        stroke='#eee' stroke-width='10' fill-opacity='0'
                        style='stroke-dasharray: 295.31px, 295.31px; stroke-dashoffset: 0px;'></path>
                  <path class='ant-progress-circle-path' d='M 50,50 m 0,-47a 47,47 0 1 1 0,94a 47,47 0 1 1 0,-94'
                        stroke-linecap='butt ' stroke='#00dcef' stroke-width='10' fill-opacity='0'
                        style='stroke-dasharray: ${strokeDasharrayX}, 354.31px;stroke-dashoffset: 0;'></path>
                </svg>
              </div>
              <div class='inner'>
                <div class='txt'>完成度</div>
                <div class='percent'><span class='num'>${(data.percent * 100).toFixed(2)}</span><span class='per'>%</span></div>
              </div>
            </div>
          </div>
          <div class='block'>
            <div class='block-item'>
              累计检查：<span>${data.d1}</span>
            </div>
            <div class='block-item'>
              待复查：<span>${data.d2}</span>
            </div>
            <div class='block-item'>
              待整改：<span>${data.d3}</span>
            </div>
            <div class='block-item'>
              超期隐患：<span>${data.d4}</span>
            </div>
          </div>
        </div>
        <div class='right'>
          <div class='qrcode'>
            <img src='/htmls/images/page/bim/qrcodexcx.png' alt=''>
          </div>
          <p>扫一扫登录移动端</p>
        </div>
      `
    }
  }

  const pt = new PageTemplate()
  let luTable
  !(async () => {
    new LuInnerHeader({ title: '施工质量' })
    renderTopStatistic()
    renderSearchForm()
    await renderTable()
  })()

  function renderTopStatistic() {
    // mock
    const data = { percent: Math.random(), d1: 18, d2: 3, d3: 12, d4: 32 }
    const html = pt.statistic(data)
    $('.chart-box').html(html)
  }

  function renderSearchForm() {
    new LuSearchForm([
      {
        label: '标段',
        type: 'select',
        selectData: [
          { value: '1', key: 'A标段' },
          { value: '2', key: 'B标段' },
        ],
        name: 's3',
      },
    ])
  }

  async function renderTable() {
    const tableData = await $lulib.getMockData('/htmls/mock/bim/constructionQualityTableData.json', 7, '', false)

    const templet1 = `<span><span class="{{d.t6 === '严重' ? 'yellow' : (d.t6 === '重大' ? 'red': '')}}">{{d.t6}}</span></span>`
    const templet2 = `
<span>
  <span class='table-event-span' lay-event='info'>查看详情</span>
  <a class="layui-btn table-bind-model layui-btn-xs {{!!d.isBind ? 'gray' : ''}}" lay-event='bindModel'>{{d.isBind ? '取消标记' : '在模型中标记'}}</a>
</span>`

    const options = {
      cols: [
        $lulib.tableSetCenter([
          { field: 'id', title: '序号', width: 60 },
          { field: 't1', title: '养护部位', minWidth: 180 },
          { field: 't2', title: '所属区域', minWidth: 180 },
          { field: 't3', title: '养护负责人', width: 100 },
          { field: 't4', title: '整改责任人', width: 100 },
          { field: 't5', title: '问题描述', minWidth: 360 },
          { title: '等级', width: 80, templet: templet1 },
          { field: 't7', title: '上报时间', width: 120 },
          { field: 't8', title: '期望整改时间', width: 120 },
          { field: 't9', title: '状态', width: 80 },
          { title: '操作', toolbar: templet2, minWidth: 220 },
        ]),
      ],
    }

    luTable = new LuTable(tableData, options)

    luTable.$table.on(`tool(${luTable.options.filter})`, obj => {
      const { event, data } = obj
      switch (event) {
        case 'info':
          info(data)
          break
        case 'bindModel':
          bindModel(data)
          break
      }
    })
  }

  function info(data) {
    $lulib.pagePushHash(`bim/quality-manage/maintenance-info?id=${data.id}`)
  }

  function bindModel(data) {
    $lulib.pagePushHash(`bim/quality-manage/bind-model?id=${data.id}`)
  }
})
