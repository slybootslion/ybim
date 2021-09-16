layui.use(['LuCommonTemplate', 'LuUtilsTemplate'], function () {
  const $ = layui.$
  const laydate = layui.laydate

  class PageTemplate {
    renderNavBox(index) {
      const config = [
        { name: '光照', icon: 'icon-guangzhao' },
        { name: '行车', icon: 'icon-cxy_tonghangcheliang' },
        { name: '大雾', icon: 'icon-dawu' },
        { name: '漫游', icon: 'icon-manyou1' },
      ]

      let html = ''
      for (let i = 0; i < config.length; i++) {
        const item = config[i]
        const isActive = index != null && i === index ? 'active' : ''
        html += `
        <div class='main-nav-item ${isActive}'>
          <span class='iconfont ${item.icon}'></span>
          <span class='txt'>${item.name}</span>
        </div>`
      }

      return html
    }

    renderTimeBar() {
      return `
        <div class='title'>
          <span class='txt'>光照</span>
          <span class='close'>X</span>
        </div>
        <div class='content'>
          <div class='content-item'>
            <div class='t'>
              <span>选择时间：</span>
              <span class='time'>13:30</span>
            </div>
            <div class='input-box'>
              <div class='range-box'>
                <input type='range' id='rangeLight' value='850' min='0' max='1700'>
                <div class='scale-box'>
                  <div class='bg'></div>
                  <span class='range-time'>22:00</span>
                  <span class='range-time'>5:00</span>
                </div>
              </div>
            </div>
          </div>
          <div class='content-item'>
            <div class='t'>
              <span>选择日期：</span>
              <input type='text' id='date' placeholder='选择日期'>
            </div>
          </div>
        </div>`
    }
  }

  const pt = new PageTemplate()

  let guangzhaopanel = $('.guangzhao-panel')
  ;(() => {
    initRenderNavBox()
    initTimeBar()
  })()

  function initRenderNavBox(index) {
    $('.nav-box').html(pt.renderNavBox(index))
  }

  function initTimeBar() {
    guangzhaopanel.html(pt.renderTimeBar())
    laydate.render({
      elem: `#date`,
      theme: '#007fff',
    })
  }

  $lulib.methodProxy.bindMethodProxy([
    { dom: 'body', domStr: '.main-nav-item', method: tapItem },
    { dom: 'body', domStr: '#rangeLight', method: rangeChange },
    { dom: 'body', domStr: '.close', method: () => guangzhaopanel.hide() },
  ])

  const showTips = () => {
    if (!showTips.isShow) {
      const html = `<div class='alert-msg-content'></div>`
      $('.scene-simulation').append(html)
      setTimeout(() => $('.alert-msg-content').remove(), 5000)
    }
    showTips.isShow = true
  }

  function tapItem() {
    const index = $(this).index()
    initRenderNavBox(index)

    switch (index) {
      case 0:
        guangzhaoPanel()
        break
      case 3:
        showTips()
        break
    }
  }

  function guangzhaoPanel() {
    guangzhaopanel.show()
    rangeChange()
  }

  function rangeChange() {
    const $this = $('#rangeLight')
    const max = $this.attr('max')
    const val = $this.val()
    let timeArr = parseFloat(val / 100)
      .toFixed(2)
      .toString()
      .split('.')
    const h = Number(timeArr[0]) + 5
    const m = parseInt((Number(timeArr[1]) * 60) / 100)
      .toString()
      .padStart(2, '0')
    $('.time').html(`${h}:${m}`)
    const widthPercent = parseInt(Number(val / max) * 100)
    $('.scale-box .bg').css({ width: `${widthPercent}%` })
  }
})
