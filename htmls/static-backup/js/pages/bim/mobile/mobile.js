layui.use([], function () {
  $ = layui.$

  class PageTemplate {
    contentTemplate(data) {
      const { use, overhaul } = data
      let uH = '',
        oH = ''
      for (let i = 0; i < use.length; i++) {
        const uD = use[i]
        const uhList = [
          { key: '使用部门', value: uD.i2 },
          { key: '使用人', value: uD.i3 },
          { key: '使用时间', value: uD.i4 },
          { key: '归还时间', value: uD.i5 },
        ]
        let h = ''
        uhList.forEach(
          l =>
            (h += `<div class='content-item-s'><span class='cid-key'>${l.key}：</span><span class='cid-value'>${l.value}</span></div>`),
        )
        uH += `
          <div class='content-item'>
            <div class='content-item-t'>
              <span class='iconfont icon-huabankaobei-'></span>
              <span>${uD.i1}</span>
            </div>
            ${h}
          </div>
        `
      }
      for (let i = 0; i < overhaul.length; i++) {
        const oD = overhaul[i]
        const ohList = [
          { key: '故障时间', value: oD.i3 },
          { key: '故障现象', value: oD.i4 },
          { key: '检修内容', value: oD.i5 },
          { key: '试运情况', value: oD.i6 },
          { key: '修后状况', value: oD.i7 },
        ]
        let h = ''
        ohList.forEach(
          l =>
            (h += `<div class='content-item-s'><span class='cid-key'>${l.key}：</span><span class='cid-value'>${l.value}</span></div>`),
        )
        oH += `
      	  <div class='content-item'>
            <div class='content-item-t'>
              <span class='iconfont icon-cxy_tonghangcheliang'></span>
              <span>检修人：${oD.i1}</span>
              <span>检修时间：${oD.i2}</span>
            </div>
            ${h}
          </div>
      	`
      }

      return `
        <div class='content-box cb1 active'>
          ${oH}
        </div>
        <div class='content-box cb2'>
          ${uH}
        </div>
      `
    }

    headerTemplate(data) {
      const { pic, i1, i2, i3, i4, i5 } = data
      const infoList = [
        { key: '设备名称', value: i1 },
        { key: '设备编号', value: i2 },
        { key: '规格型号', value: i3 },
        { key: '生产日期', value: i4 },
        { key: '进场日期', value: i5 },
      ]
      let h = ''
      let i = 0,
        len = infoList.length
      for (; i < len; i++) {
        const info = infoList[i]
        h += `
          <div class='info-box'>
            <div class='info-left'>${info.key}：</div>
            <div class='info-right'>${info.value}</div>
          </div>
        `
      }
      return `
        <div class='header-info'>
          <div class='header-left'>
            <img src='${pic}' alt=''>
          </div>
          <div class='header-right'>
            ${h}
          </div>
        </div>
        <div class='btn-box'>
          <button class='header-btn active'>检修记录</button>
          <button class='header-btn'>使用记录</button>
        </div>
      `
    }
  }

  let pt = new PageTemplate()
  let equipment = null
  !(() => {
    initData()
    rootEleFontSize()
  })()

  function initData() {
    const { id } = $lulib.getAllUrlParams()
    if (id) {
      equipment = id
      getData()
    }
  }

  function getData(equipment) {
    // mock
    const headData = {
      pic: 'http://gnjzlw.com/uploadfile/20190308/201903080917226292016.jpg',
      i1: 'SFHF挖掘机',
      i2: 'shs1253313',
      i3: 'DHHF2015348/2021054613',
      i4: '2014-05-14',
      i5: '2020-11-26',
    }
    // mock
    let od = {
      i1: '王菲',
      i2: '2021-04-12',
      i3: '2021-04-12',
      i4: '故障现象表面有裂痕，剐蹭等显现，需要重新清理。故障现象表面有裂痕，剐蹭等显现，需要重新清理。',
      i5: '表面裂痕已修复，并且进行养护。表面裂痕已修复，并且进行养护。表面裂痕已修复，并且进行养护。表面裂痕已修复，并且进行养护。',
      i6: '良好',
      i7: '可以正常使用',
    }
    let ud = {
      i1: '2021-04-12',
      i2: '陕西三秦路桥有限公司 路基路面班组',
      i3: '王工',
      i4: '2020-05-12 15:15:56',
      i5: '2020-05-18 15:15:56',
    }
    renderHeader(headData)
    renderContent({ od, ud })
  }

  $lulib.methodProxy.bindMethodProxy([{ dom: 'body', domStr: '.header-btn', method: handleTab }])

  function handleTab(e) {
    const dom = $(this)
    const txt = dom.html()
    const isAct = dom.hasClass('active')
    console.log(txt, isAct)
    if (isAct) return
    dom.addClass('active').siblings('button').removeClass('active')
    if (txt === '检修记录') $('.cb1').show().siblings('.cb2').hide()
    else $('.cb2').show().siblings('.cb1').hide()
  }

  window.addEventListener('resize', rootEleFontSize, false)

  function rootEleFontSize() {
    const $html = $('html')
    const d = 750 / 100
    let clientW = $html.width() || 375
    clientW > 750 && (clientW = 750)
    $html.css({ fontSize: clientW / d })
    const $wrapper = $('.wrap-container')
    $lulib.isMobile() ? $wrapper.addClass('mobile-wrapper') : $wrapper.removeClass('mobile-wrapper')
  }

  function renderHeader(data) {
    const html = pt.headerTemplate(data)
    $('.header').html(html)
  }

  function renderContent({ od, ud }) {
    const contentData = {
      use: new Array(3).fill(ud),
      overhaul: new Array(3).fill(od),
    }

    const html = pt.contentTemplate(contentData)
    $('.content').html(html)
  }
})
