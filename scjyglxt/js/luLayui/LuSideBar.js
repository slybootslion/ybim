layui.define([], function (exports) {
  const $ = layui.$
  const error404Url = '/scjyglxt/pages/error/404.html'

  class LuSideBar {
    constructor (sidebarData) {
      this.sidebarData = sidebarData
      this.currentData = sidebarData[0]
    }

    async init () {
      $(window).on('hashchange', async () => {
        await this.handleHash()
        await this.renderHash()
      })
      if (await this.handleHash()) await this.renderHash()
      this.bindListeners()
    }

    async renderHash () {
      const item = this.findItemByHash()
      if (!item) {
        this.to404()
        return false
      }
      this.currentData = item
      this.renderSideBar()
      await this.dispatchContentRender()
    }

    async handleHash () {
      const hash = $lulib.getHashNoParams()
      this.hash = hash
      if (!hash) {
        $lulib.pagePushHash(this.sidebarData[0].href)
        return false
      }
      return true
    }

    renderSideBar () {
      const html = sideBarTemplate(this.sidebarData, this.currentData)
      $("#sidebarListBox").html(html)
    }

    bindListeners () {
      const layoutBody = $('.lu-layout-body')
      const instance = this
      layoutBody.on('click', '[data-lu-menuid]', function () {
        const thisDom = $(this)
        const id = thisDom.attr('data-lu-menuid')
        if (!id) return
        // if (instance.currentData.id === id) return false
        const hash = instance.findItemById(id).href
        $lulib.pagePushHash(hash)
      })
    }

    findItemById (id) {
      const list = this.sidebarData
      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        if (item.id === id) return item
      }
    }

    findItemByHash () {
      const list = this.sidebarData
      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        if (item.href === this.hash) return item
      }
    }

    to404 () {
      $lulib.pageReplace(error404Url)
    }

    async dispatchContentRender () {
      $lulib.contentLoad('.lu-body')
      let contentEl = $('#bodyOnePage')
      contentEl.html('')
      const item = this.currentData
      await $lulib.delay(500)
      if (!item) {
        $lulib.pageReplace(error404Url)
        return
      }
      const { title, href } = item
      $lulib.eventBus.emit('bodyContentChange', { title, href })
    }
  }

  exports('LuSideBar', LuSideBar)
})

function sideBarTemplate (list, current) {
  let h = ''
  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    if (item.hide) continue
    let activeClass = ''
    if (current.id === item.id) activeClass = 'layui-this'
    h += `<div class="lu-nav-item ${activeClass}" title="${item.title}" data-lu-menuid="${item.id}"><span class="side-icon-txt">${item.title}</span></div>`
  }
  return h
}
