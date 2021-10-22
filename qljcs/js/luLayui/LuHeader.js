layui.define([], function (exports) {
  const $ = layui.$

  class LuHeader {
    init (data) {
      const { projectName, weather, username } = data
      const date = $lulib.getFormatTime('YYYY年MM月DD日 dddd')
      this.renderHeader({ projectName, weather, username, date })
    }

    renderHeader ({ projectName, weather, username, date }) {
      $(".lu-header-ql").html(headerTemplate({ projectName, weather, username, date }))
    }
  }

  exports('LuHeader', LuHeader)
})

function headerTemplate ({ projectName, weather, username, date }) {
  const picDist = {
    1: { t: '晴', icon: 'p1' },
    2: { t: '雪', icon: 'p2' },
    3: { t: '阴', icon: 'p3' },
    4: { t: '雨', icon: 'p4' },
  }
  return `<div class="left">
            <div class="icon">
              <img src="/qljcs/images/page/bim/${picDist[weather.w1].icon}.png" alt="">
            </div>
            <div class="left-date">
              <div class="date-text">${date}</div>
              <div class="left-date-weather">${weather.w3} ${weather.w2}</div>
            </div>
            <div class="project-box">
              <span class="iconfont icon-xiangmutuijin"></span>
              <span>${projectName}</span>
            </div>
          </div>
        <div class="middle">结构物安全检测系统</div>
        <div class="right"><span class="username">${username}</span></div>`
}
