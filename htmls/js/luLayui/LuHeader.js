layui.define(['util', 'LuHeaderTemplate'], function (exports) {
  const $ = layui.jquery
  const util = layui.util
  const LuHeaderTemplate = layui.LuHeaderTemplate

  const loginUrl = '/htmls/pages/login.html'

  function setTime() {
    return util.toDateString(new Date(), 'yyyy年MM月dd日 HH:mm:ss')
  }

  function renderTime() {
    $('#headerTime').html(setTime())
  }

  class LuHeader {
    constructor(username, projectList) {
      this.username = username
      this.projectList = projectList
      this.timeboxTimer = null
      this.beforeHash = null
      this.init()
    }

    init() {
      const { username, projectList } = this
      const time = setTime()
      const projectName = projectList.length ? projectList[0].name : '项目名称'
      const prefix = $lulib.getHash().split('/')[0]
      this.renderTemplate(username, projectName, time, prefix)
      this.renderProjectList()
      this.bindListeners()
      this.renderBlockList()
      /* -- -- -- -- -- */
      this.renderTime()
    }

    renderTime() {
      if (this.timeboxTimer) clearInterval(this.timeboxTimer)
      const headerTime = $('#headerTime')
      this.timeboxTimer = setInterval(() => headerTime.html(setTime()), 1000)
    }

    renderTemplate(username, projectName, time, modelName) {
      this.lhTemplate = new LuHeaderTemplate({ username, projectName, time, modelName })
      this.lhTemplate.renderHeader()
    }

    renderProjectList() {
      const list = this.projectList
      if (list.length) this.lhTemplate.renderProjectList(list)
    }

    renderBlockList() {
      this.lhTemplate.renderBLock()
    }

    bindListeners() {
      const headerEle = $('.lu-header')

      headerEle.on('click', '#username', function () {
        $lulib.pageReplace(loginUrl)
      })

      headerEle.on('click', '#userSetting', () => {
        if (window.openMenu) layer.close(window.openMenu)
        window.openMenu = null
        $('.lu-layout-body').attr({ class: 'layui-layout-body lu-layout-body lu-layout-all' })
        const URL = 'user/system-settings/account-management'
        const hash = $lulib.getHash()
        if (hash === URL) return
        this.beforeHash = hash
        $lulib.pagePushHash(URL)
        $(".header-content-left .left2-text").html('用户设置')
      })

      headerEle.on('click', '#ldjsc', () => $lulib.pagePush('/htmls/pages/bim/data-screen'))

      $lulib.eventBus.on('backModelHash', () => {
        if (!this.beforeHash) $lulib.pageReplace('/htmls')
        else {
          const prefix = this.beforeHash.split('/')[0]
          const model = this.lhTemplate.blockData.find(b => b.icon === prefix)
          if (model) $(".header-content-left .left2-text").html(model.title)
          $lulib.pagePushHash(this.beforeHash, null, true)
        }
      })
    }
  }

  exports('LuHeader', LuHeader)
})
