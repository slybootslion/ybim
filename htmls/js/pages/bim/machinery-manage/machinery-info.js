layui.use(['LuCommonTemplate', 'LuLayer'], function () {
  const $ = layui.$

  const LuInnerHeader = layui.LuInnerHeader
  const LuLayer = layui.LuLayer
  let URL = 'bim/machinery-manage/equipment-ledger'

  let luInnerHeader, params, info

  class PageTemplate {
    renderInfo() {
      let h = ''
      const dict = {
        d2: '设备编号',
        d3: '规格型号',
        d4: '进场日期',
      }
      Object.keys(dict).forEach(item => {
        const i = info[item]
        h += `<div class='layui-form-item'>
                <label class='layui-form-label'>${dict[item]}：</label>
                <div class='layui-input-block'>
                  <span class='info'>${i}</span>
                </div>
               </div>`
      })
      return `<div class='content-head'>
                      <span>设备信息</span>
                    </div>
                    <div class='content-body content-form'>
                      <div class='layui-form-item layui-form-text textarea-box'>
                        <label class='layui-form-label'>设备名称：</label>
                        <div class='layui-input-block'>
                           <span class='info'>${info.d1}</span>
                        </div>
                      </div>
                      ${h}
                    </div>`
    }

    renderBottom(info, idx) {
      let i = 0
      let html = ''
      let title = idx === 0 ? '检修信息' : '使用信息'
      if (idx === 0) {
        const dict = {
          d1: '故障时间',
          d2: '故障现象',
          d3: '检修内容',
          d4: '试运情况',
          d5: '修后状态',
        }

        for (; i < info.length; i++) {
          let h = ''
          const item = info[i]
          Object.keys(dict).forEach(it => {
            h += `<div class='info-content-item'>
                    <span>${dict[it]}：</span>
                    <span class='info'>${item[it]}</span>
                  </div>`
          })
          h += `<div class='info-content-item'>
                  <span>附件：</span>
                  <span class='info'>
                    <a target='_blank' href='${item.d6.link}'>${item.d6.name}</a>
                  </span>
                </div>`
          html += `<div class='info-type-block' data-id='${item.id}'>
                    <div class='info-title'>
                      <span class='iconfont icon-yanchi'></span>
                      <span class='title-line'>检修人：${item.n1}</span>
                      <span class='title-line'>检修时间：${item.t1}</span>
                      <span class='iconfont icon-bianji edit0'></span>
                      <span class='iconfont icon-shanchu1 del'></span>
                    </div>
                    <div class='info-content'>
                      ${h}
                    </div>
                  </div>`
        }
      } else {
        const dict = {
          d1: '使用部门',
          d2: '使用人',
          d3: '使用时间',
          d4: '归还时间',
        }
        for (; i < info.length; i++) {
          let h = ''
          const item = info[i]
          Object.keys(dict).forEach(it => {
            h += `<div class='info-content-item'>
                    <span>${dict[it]}：</span>
                    <span class='info'>${item[it]}</span> 
                  </div>`
          })
          html += `<div class='info-type-block' data-id='${item.id}'>
                    <div class='info-title'>
                      <span class='iconfont icon-Wendang'></span>
                      <span>${item.t1}</span>
                      <span class='iconfont icon-bianji edit1'></span>
                      <span class='iconfont icon-shanchu1 del'></span>
                    </div>
                    <div class='info-content'>
                      ${h}
                    </div>
                  </div>`
        }
      }
      return `<div class='content-head'>
                <span>${title}</span>
              </div>
              <div class='content-tab-body'>
                ${html}
              </div>`
    }
  }

  const pt = new PageTemplate()

  ;(async () => {
    innerHeaderRender()
    await initParams()
    renderBodyTop()
    await renderBodyBottom(0)
  })()

  async function initParams() {
    params = $lulib.getHashParams()
    if (params.from && params.from === 'rental')
      URL = 'bim/machinery-manage/rental-equipment'
    info = await machineryInfo(params.id)
  }

  // mock data
  async function machineryInfo(id) {
    return new Promise(resolve => {
      resolve({
        d1: 'BJ2021-02150015高压起重机',
        d2: 'BJ2021-02150015',
        d3: 'HD-YCC',
        d4: '2021-05-01',
      })
    })
  }

  function innerHeaderRender() {
    luInnerHeader = new LuInnerHeader({
      title: '',
      rightHtml: [{ txt: '返回', isWeaken: true }],
    })

    patchHeader()

    function patchHeader() {
      const lDom = $('.luPageHeader').find('.left')
      lDom.find('.title').remove()
      const html = `<div class='left-btn-box'>
                      <div class='left-head-btn active'>检修记录</div>
                      <div class='left-head-btn'>使用记录</div>
                    </div>`
      lDom.html(html)
    }
  }

  function renderBodyTop() {
    const html = pt.renderInfo()
    $('.page-container .top').html(html)
  }

  // mock
  async function bodyBottom(idx) {
    if (idx === 0) {
      const d1 = await $lulib.getMockData('/htmls/mock/bim/machineryInfoData0.json', 2, '', false)
      return new Promise(resolve => resolve(d1))
    } else {
      const d2 = await $lulib.getMockData('/htmls/mock/bim/machineryInfoData1.json', 3, '', false)
      return new Promise(resolve => resolve(d2))
    }
  }

  async function renderBodyBottom(idx) {
    const info = await bodyBottom(idx)
    const html = pt.renderBottom(info, idx)
    $('.bottom-form').eq(idx).addClass('active').html(html).siblings('.bottom-form').removeClass('active')
  }

  $lulib.bindMethod([{ dom: luInnerHeader.rightBtns[0], method: back }])

  function back() {
    $lulib.pagePushHash(URL, true)
  }

  $lulib.methodProxy.bindMethodProxy([
    { dom: 'body', domStr: '.left-head-btn', method: headerBtnClick },
    { dom: 'body', domStr: '.del', method: del },
    { dom: 'body', domStr: '.edit0', method: editItem0 },
    { dom: 'body', domStr: '.edit1', method: editItem1 },
  ])

  function del(e) {
    LuLayer.confirm('确定删除？', () => {
      const ele = $(e.target).parents('.info-type-block')
      const { id } = ele.data()
      ele.remove()
    })
  }

  function editItem0(e) {
    const { id } = $(e.target).parents('.info-type-block').data()
    let url = `bim/machinery-manage/add-records?id=${params.id}&type=m&itemId=${id}`
    if (params.from === 'rental')
      url = `bim/machinery-manage/add-rental-records?id=${params.id}&type=m&itemId=${id}&from=${params.from}`
    $lulib.pagePushHash(url)
  }

  function editItem1(e) {
    const { id } = $(e.target).parents('.info-type-block').data()
    let url = `bim/machinery-manage/add-records?id=${params.id}&type=used&itemId=${id}`
    if (params.from === 'rental')
      url = `bim/machinery-manage/add-rental-records?id=${params.id}&type=used&itemId=${id}&from=${params.from}`
    $lulib.pagePushHash(url)
  }

  async function headerBtnClick() {
    const isActive = $(this).hasClass('active')
    if (isActive) return
    const dom = $(this).addClass('active').siblings('.left-head-btn').removeClass('active').end()
    switch (dom.html().trim()) {
      case '使用记录':
        await renderBodyBottom(1)
        break
      case '检修记录':
        await renderBodyBottom(0)
        break
    }
  }
})
