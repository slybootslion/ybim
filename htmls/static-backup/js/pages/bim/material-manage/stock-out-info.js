layui.use(['LuCommonTemplate'], function () {
  const $ = layui.$

  const LuInnerHeader = layui.LuInnerHeader
  const LuTable = layui.LuTable

  let pageId, luInnerHeader

  class PageTemplate {
    renderTop(data) {
      const di = { 0: '出库编号', 1: '出库人', 2: '领用班组', 3: '领用人', 4: '领用时间', 5: '出库原因' }
      let h = ''
      for (let i = 0; i < data.length - 1; i++) {
        const d = data[i]
        h += `<div class='layui-form-item mb0'>
                <label class='layui-form-label'>${di[i]}：</label>
                <div class='layui-input-block'>
                  <span class='info'>${d}</span>
                </div>
              </div>`
      }
      h += `<div class='layui-form-item mb0 layui-form-text textarea-box'>
              <label class='layui-form-label'>备注：</label>
              <div class='layui-input-block'>
                <span class='info'>${data[data.length - 1]}</span>
              </div>
           </div>`
      const html = `<div class='content-head'>
                      <span>基本信息</span>
                    </div>
                    <div class='content-body content-form layui-form'>
                      ${h}
                    </div>`
      $('.inner-top').html(html)
    }

    renderMid(data) {
      const html = `<div class='content-head'>
                      <span>出库明细</span>
                    </div>
                    <div class='luTable'></div>`
      $('.inner-mid').html(html)
      const opts = {
        cols: [
          $lulib.tableSetCenter([
            { field: 'id', title: '序号', width: 60 },
            { field: 't1', title: '材料名称', minWidth: 280 },
            { field: 't2', title: '规格型号', minWidth: 280 },
            { field: 't3', title: '单位', width: 110 },
            { field: 't4', title: '出库数量', width: 150 },
            { field: 't7', title: '金额（元）', width: 160 },
          ]),
        ],
        limit: 10,
      }
      new LuTable(data.dt, opts)
    }

    renderBot(data) {
      let h = ``

      for (let i = 0; i < data.length; i++) {
        h += `
        <span class='upload-file'>
          <span>${data[i]}</span>
          <span class='iconfont icon-xiazai'></span>
        </span>
        `
      }

      const html = `<div class='content-head'>
                      <span>附件</span>
                    </div>
                    <div class='content-body content-upload layui-form'>
                      <div class='upload-file-box'>${h}</div>
                    </div>`
      $('.inner-bot').html(html)
    }
  }

  const pt = new PageTemplate()

  ;(async () => {
    const params = $lulib.getHashParams()
    pageId = params.id
    innerHeaderRender()
    await innerBody()
  })()

  function innerHeaderRender() {
    luInnerHeader = new LuInnerHeader({
      title: '出库明细',
      rightHtml: [{ txt: '返回', isWeaken: true }],
    })
  }

  async function innerBody() {
    const data1 = await new Promise(resolve =>
      resolve([
        'BJ2021-02150015',
        '张工',
        '西安中交柏嘉科技发展有限公司',
        '刘丽',
        '2021年02月15日 15:30:25',
        '施工需要',
        '该批货物有部分颜色色差，并且与之前货物属不同厂家，在使用时应注意需要做始严，确定货物是否可用，有必要的课申请退货或换货。',
      ]),
    )
    pt.renderTop(data1)

    const dt = await $lulib.getMockData('/htmls/mock/bim/stockInFormInnerTableData.json', 4, '', false)
    const data2 = { dt }
    pt.renderMid(data2)

    const data3 = await new Promise(resolve => resolve(['物料入库单.jpg', '物料入库单2.jpg', '物料入库办理手续.pdf']))
    pt.renderBot(data3)
  }

  $lulib.bindMethod([{ dom: luInnerHeader.rightBtns[0], method: addInStock }])

  function addInStock() {
    $lulib.pagePushHash('bim/material-manage/stock-out-manage')
  }
})
