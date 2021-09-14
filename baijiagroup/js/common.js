(function (globle) {
  class LuCommon {
    headerTemplate (index) {
      const link = [
        { txt: '柏嘉首页', link: './index.html' },
        { txt: '走进柏嘉', link: 'javascript:void(0)' },
        { txt: '新闻中心', link: 'javascript:void(0)' },
        { txt: '主营业务', link: 'javascript:void(0)' },
        { txt: '技术产品', link: 'javascript:void(0)' },
        { txt: '关于我们', link: './about.html' },
      ]
      let h = ''
      let className = ''
      for (let i = 0; i < link.length; i++) {
        const l = link[i]
        if (i === index) className = 'nav-item active'
        else className = 'nav-item'
        h += `<a href="${l.link}" class="${className}">${l.txt}</a>`
      }
      return `<div class="wrap">
                            <a href="javascript:void(0)" class="logo">
                              <img src="./images/logo.png" alt="">
                            </a>
                            <div class="nav-box">
                              <nav class="nav">${h}</nav>
                              <div class="search-client">
                                <div class="search">
                                  <form action="/search.html" method="get">
                                    <span class="icon" type="submit"></span>
                                    <input type="text" class="seach_inptu" autocomplete="off" name="q" placeholder="请输入搜索内容">
                                  </form>
                                </div>
                              </div>
                            </div>
                          </div>`
    }

    footerTemplate (styleType = 'deep') {
      let className = ''
      if (styleType === 'deep') className = 'common-footer'
      else className = 'common-footer light'
      return `<footer class="${className}">
                <div class="line">
                  <span>运营管理：柏嘉交科企划宣传部</span>
                  <span>技术开发：柏嘉交科智慧事业部</span>
                </div>
                <div class="line">
                  <span>版权所有：柏嘉交通科技集团有限公司（2014-2019）</span>
                </div>
                <div class="line">
                  <a href="javascript:void(0)">备案号：陕ICP15002980号-1</a>
                </div>
              </footer>`
    }

    renderFooter (domStr, styleType = 'deep') {
      const placeHolderJQueryDom = $(domStr)
      const h = this.footerTemplate(styleType)
      placeHolderJQueryDom.after(h)
      placeHolderJQueryDom.remove()
    }

    renderBanner (data, domStr = '.bannerPlaceholder') {
      let bh = '', nh = ''
      for (let i = 0; i < data.banner.length; i++) {
        const banner = data.banner[i]
        bh += `<li class="lubo_item" style="background-image: url(${banner.pic})"><a href="${banner.link}"></a></li>`
      }
      for (let i = 0; i < data.notice.length; i++) {
        const notice = data.notice[i]
        nh += `<li><a href="${notice.link}">${notice.text}<span class="more">了解更多 ></span></a></li>`
      }
      $(domStr).after(`<div class="banner">
                          <div id="lubo" class="lubo">
                            <div class="lubo_box">
                              <ul>
                                ${bh}
                              </ul>
                            </div>
                            <div class="cir_box">
                              <ul>
                                <li></li>
                                <li></li>
                                <li></li>
                              </ul>
                            </div>
                            <div class="lubo_btn">
                              <div class="prev">&lt;</div>
                              <div class="next">&gt;</div>
                            </div>
                          </div>
                        </div>
                        <div id="notice_wrap" class="notice">
                          <div class="notice-box wrap">
                            <span class="iconfont icon-gonggao"></span>
                            <div class="tempWrap">
                              <ul>${nh}</ul>
                            </div>
                          </div>
                        </div>`)

      $('#lubo').slide({
        'titCell': '.cir_box li',
        'mainCell': '.lubo_box ul',
        'effect': 'fold',
        'autoPlay': true,
        'delayTime': 500
      })

      $('#notice_wrap').slide({
        'titCell': '.hd ul',
        'mainCell': '.notice-box ul',
        'effect': 'topLoop',
        'autoPlay': true,
        'autoPage': true,
        'trigger': 'click'
      })

      $(domStr).remove()
    }

    contentLinkTemplate (list) {
      let h = ''
      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        let className = ''
        if (item.active) className = 'active'
        h += `<a href="${item.link}" class="${className}">${item.text}</a>`
      }
      return h
    }
  }

  globle.$luCommon = new LuCommon
})(window)
