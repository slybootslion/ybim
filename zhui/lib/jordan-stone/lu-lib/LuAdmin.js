layui.define([], exports => {
  const $ = layui.$
  const luUtils = layui.LuUtils

  class LuHeader {
    headerTemplate (data) {
      const { buttonList, projectList, weather, id } = data
      let btnHtml = ''
      for (let i = 0; i < buttonList.length; i++) {
        const item = buttonList[i]
        const isActive = i === 0 ? 'active' : ''
        btnHtml += `<div class="btn-item ${isActive}">${item.text}</div>`
      }
      const projectName = projectList.find(p => p.id === id).name
      const weatherIconDict = {
        1: 'icon-tianqitubiao_dayu', // 大雨
        2: 'icon-tianqitubiao_qing', // 晴
        3: 'icon-tianqitubiao_daxue', // 大雪
        4: 'icon-tianqitubiao_xiaoxue', // 小雪
        5: 'icon-tianqitubiao_xiaoyu', // 小雨
        6: 'icon-tianqitubiao_zhongyu', // 中雨
        7: 'icon-tianqitubiao_duoyun', // 多云
      }
      const date = luUtils.getFormatTime('YYYY年MM月DD日 dddd')

      return `<div class="left">
                <div class="logo"></div>
                <div class="btn-list">${btnHtml}</div>
              </div>
              <div class="right">
                <div class="project-list">
                  <span class="iconfont icon-chanyeyuanqu"></span>
                  <span>${projectName} >></span>
                </div>
                <div class="weather-box">
                  <span class="iconfont ${weatherIconDict[weather.icon]}"></span>
                  <div class="weather-info">
                    <div class="top">${date}</div>
                    <div class="bottom">${weather.text} ${weather.temperature}</div>
                  </div>
                </div>
              </div>`
    }

    init (opts) {
      const hh = this.headerTemplate(opts)
      $("#luHeader").html(hh)
    }
  }

  class LuAdmin {
    constructor () {
      this.luHeader = new LuHeader()
    }
  }

  exports('LuAdmin', new LuAdmin)
})
