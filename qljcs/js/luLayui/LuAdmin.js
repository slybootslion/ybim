layui.define(['LuHeader', 'LuSideBar'], function (exports) {
  const $ = layui.$
  const LuHeader = layui.LuHeader
  const LuSideBar = layui.LuSideBar

  class LuAdmin {
    async init (options) {
      this.options = options
      const { loadingTime, projectName, weather, username, sideBarPath } = this.options
      await $lulib.delay(loadingTime)
      await (new LuHeader()).init({ projectName, weather, username })
      const sidebarData = await $lulib.ajax(sideBarPath, 'json')
      await (new LuSideBar(sidebarData)).init()
      const loaderDom = $('.loader-content')
      loaderDom && loaderDom.length && loaderDom.fadeOut()
      $lulib.eventBus.on('bodyContentChange', data => {
        this.renderBodyContent(data)
      })
    }

    async renderBodyContent (data) {
      const { href, title } = data
      $lulib.methodProxy.offBodyEventFn()
      const page = await this.bodyContentTemplate(href, title)
      let contentEl = $('#bodyOnePage')
      contentEl.html(page)
      $lulib.contentLoadRemove()
    }

    async bodyContentTemplate (href, title) {
      const TITLE_SUFFIX = '结构物安全检测系统'
      $('title').html(`${title} - ${TITLE_SUFFIX}`)
      const idUrl = href.replace(/\//g, '').toUpperCase()
      const url = '/qljcs/pages/' + href + '/index.html'
      return $lulib.ajax(url)
    }
  }

  exports('LuAdmin', LuAdmin)
})
