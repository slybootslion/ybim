layui.define([], function (exports) {
  const $ = layui.$
  const dropdown = layui.dropdown

  class LuHeader {
    init (data) {
      const { projectName, weather, username, listData } = data
      const date = $lulib.getFormatTime('YYYY年MM月DD日 dddd')
      this.renderHeader({ projectName, weather, username, date, listData })
    }

    renderHeader ({ projectName, weather, username, date, listData }) {
      $(".lu-header-ql")
        .html(headerTemplate({ projectName, weather, username, date, name: listData[0] }))

      dropdown.render({
        elem: '#headerListBox',
        data: listData,
        click: obj => {
          $lulib.pagePushHash(`index/index?id=${obj.id}`);
          $("#headerListBox .name").html(obj.title)
        }
      })
      dropdown.render({
        elem: '#typeList',
        data: [{ title: '桥梁检测系统' }],
        click: obj => $lulib.pageOpen('/qljcs/')
      })
    }
  }

  exports('LuHeader', LuHeader)
})

function headerTemplate ({ projectName, weather, username, date, name }) {
  const picDist = {
    1: { t: '晴', icon: 'p1' },
    2: { t: '雪', icon: 'p2' },
    3: { t: '阴', icon: 'p3' },
    4: { t: '雨', icon: 'p4' },
  }
  return `<div class="left">
            <div class="icon">
              <img src="/bpjcs/images/page/bim/${picDist[weather.w1].icon}.png" alt="">
            </div>
            <div class="left-date">
              <div class="date-text">${date}</div>
              <div class="left-date-weather">${weather.w3} ${weather.w2}</div>
            </div>
            <div class="project-box">
              <span class="iconfont icon-xiangmu"></span>
              <span class="name">${projectName}</span>
            </div>
            <div class="list-box" id="headerListBox">
              <span class="iconfont icon-dizhi"></span>
              <span class="name">${name.title}</span>
              <span class="iconfont icon-xiala"></span>
            </div>
          </div>
        <div class="middle">结构物安全检测系统</div>
        <div class="right">
          <div class="type-list" id="typeList">
            <span class="iconfont icon-changguibianpofangyang"></span>
            <span class="name">边坡检测系统</span>
            <span class="iconfont icon-xiala"></span>
          </div>
          <span class="username">${username}</span>
        </div>`
}
