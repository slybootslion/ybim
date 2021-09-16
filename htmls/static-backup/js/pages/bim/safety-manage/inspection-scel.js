layui.use(['LuCommonTemplate', 'LuLayer', 'LuUtilsTemplate'], function () {
  const $ = layui.$

  const LuInnerHeader = layui.LuInnerHeader
  const LuTable = layui.LuTable

  let luInnerHeader, params, luTable

  class PageTemplate {
    renderTopInfo (data) {
      const dict = {
        i2: '所属区域',
        i3: '任务类型',
        i4: '累计检查',
        i5: '检查人',
      }

      let h = ``
      Object.keys(dict).forEach(keys => {
        h += `<div class='info-desc-item'>
                <span>${dict[keys]}：</span>
                <span class='info'>${data[keys]}</span>
              </div>`
      })

      return `
        <div class='info-title'>
          ${data.i1}
        </div>
        <div class='info-desc'>
          ${h}
        </div>
      `
    }
  }

  const pt = new PageTemplate()

  ;(async () => {
    innerHeaderRender()
    initParams()
    await renderInfo()
    await tableRender()
  })()

  function initParams() {
    params = $lulib.getHashParams()
  }

  async function renderInfo() {
    const info = await new Promise(resolve =>
      resolve({
        i1: '箱梁桥面边护栏',
        i2: '第13联箱梁',
        i3: '作业检查任务',
        i4: '55次',
        i5: '李齐',
      }),
    )

    const html = pt.renderTopInfo(info)
    $(".top-info").html(html)
  }

  function innerHeaderRender() {
    luInnerHeader = new LuInnerHeader({
      title: '安全检查计划',
      rightHtml: [{ txt: '返回', isWeaken: true }],
    })
  }

  async function tableRender() {
    const data = await $lulib.getMockData('/htmls/mock/bim/safetyInspectionScelTableData.json', 13, '', false)

    const templet = `<span>
                       <span class="{{ d.t5 === '异常' ? 'red' : '' }}">{{d.t5}}</span>
                     </span>`

    const opts = {
      cols: [
        $lulib.tableSetCenter([
          { field: 'id', title: '序号', width: 60 },
          { field: 't1', title: '检查时间', minWidth: 190 },
          { field: 't2', title: '整改责任人', minWidth: 120 },
          { field: 't3', title: '整改完成时间', minWidth: 120 },
          { field: 't4', title: '检查内容描述', minWidth: 300 },
          {
            title: '检查结果',
            minWidth: 100,
            templet,
          },
          { field: 't6', title: '状态', minWidth: 90 }
        ]),
      ],
      ctrlData: [{ eventStr: 'info', txtStr: '查看详情' }],
      methods: {
        info,
      },
    }

    luTable = new LuTable(data, opts)
  }

  function info(data) {
    $lulib.pagePushHash(`bim/safety-manage/inspection-info?id=${data.id}`)
  }

  $lulib.bindMethod([{ dom: luInnerHeader.rightBtns[0], method: $lulib.pageGoBack }])
})
