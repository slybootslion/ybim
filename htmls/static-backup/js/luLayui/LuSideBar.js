layui.define(['LuBodyContentTemplate'], function (exports) {
  const $ = layui.$
  const layer = layui.layer
  const LuBodyContentTemplate = layui.LuBodyContentTemplate

  const error404Url = '/htmls/pages/error/404.html'

  class LuSideBar {
    constructor({ dataPath, shrink }) {
      this.dataPath = dataPath
      this.shrink = shrink
      this.lock = false
      this.currentData = null
      this.modelType = 'bim'
      this.luBodyContentTemplate = new LuBodyContentTemplate(this.shrink)
      this.init()
    }

    async init() {
      $(window).on('hashchange', async () => {
        if (this.lock) {
          this.lock = false
          return
        }
        await this.handleHash()
        this.renderHash()
      })
      // render style
      const top = parseInt($('.lu-header').css('height'))
      const btnH = parseInt($('.stretch-btn-box').css('height'))
      $('.lu-side').css({ top: top + btnH })
      if (await this.handleHash()) this.renderHash()
      this.bindListeners()
    }

    async handleHash() {
      const hash = $lulib.getHashNoParams()
      this.hash = hash
      const { dataPath, modelType } = this
      let data, prefix
      if (!hash) {
        prefix = modelType
        data = this.handleFilePathPrefix(await $lulib.ajax(dataPath[prefix], 'json'), prefix)
        $lulib.pagePushHash(data[0].href)
        return false
      }
      prefix = this.getPrefix(hash)
      data = await $lulib.ajax(dataPath[prefix], 'json')
      if (!data && !data.length) this.to404()
      this.currentData = this.handleFilePathPrefix(data, prefix)
      return true
    }

    handleFilePathPrefix(data, prefix) {
      return data.map(item => {
        item.href = `${prefix}/${item.href}`
        if (item.children) item.children = this.handleFilePathPrefix(item.children, prefix)
        return item
      })
    }

    renderHash() {
      const prefix = this.getPrefix(this.hash)
      const item = findItemByHash(this.currentData, this.hash)
      if (!item) this.to404()
      this.renderSideBar(prefix)
      this.dispatchContentRender(null, item)
      this.sideBarActive(item.id)
    }

    renderSideBar(prefix) {
      const { currentData } = this
      let back = false
      if (prefix === 'user') back = true
      this.luBodyContentTemplate.renderSideBar(currentData, back)
      this.modelType = prefix
    }

    getPrefix(fullHash) {
      return fullHash.split('/')[0]
    }

    to404() {
      $lulib.pageReplace(error404Url)
    }

    clearMiniOpenMenu() {
      if (window.openMenu) layer.close(window.openMenu)
      window.openMenu = null
    }

    async dispatchContentRender(id, item = null) {
      $lulib.contentLoad('.lu-body')
      await $lulib.delay(500)
      if (!item && id) {
        item = findItemById(this.currentData, id)
        if (!item) return
        // const oldHash = $lulib.getHash()
        location.hash = '/' + item.href
        this.lock = true
      }
      if (!item) {
        $lulib.pageReplace(error404Url)
        return
      }
      const { title, href } = item
      $lulib.eventBus.emit('bodyContentChange', { title, href })
      this.lock = false
    }

    sideBarActive(id) {
      $('.lu-menu').removeClass('layui-this')
      let el = $(`[data-lu-menuid=${id}]`).parent('.lu-menu').addClass('layui-this')
      if (el.prop('tagName') !== 'LI') {
        const pl = el.parents('.lu-nav-item')
        !pl.hasClass('layui-nav-itemed') && pl.addClass('layui-nav-itemed')
      }
    }

    checkStretchDomType() {
      const strBtnBox = $('.stretch-btn-box')
      const stretchDom = strBtnBox.find('.stretch-a')
      const type = +stretchDom.attr('data-lu-stretch')
      const stretchDom2 = strBtnBox.find('.sidebar-back')
      return { type, stretchDom2 }
    }

    bindListeners() {
      const strBtnBox = $('.stretch-btn-box')
      const layoutBody = $('.lu-layout-body')

      const luSideBar = this

      strBtnBox.on('click', '[data-lu-stretch]', function () {
        const type = +$(this).attr('data-lu-stretch')
        if (type) {
          $(this).attr({ 'data-lu-stretch': 0 })
          layoutBody.attr({ class: 'layui-layout-body lu-layout-body lu-layout-mini' })
        } else {
          $(this).attr({ 'data-lu-stretch': 1 })
          layoutBody.attr({ class: 'layui-layout-body lu-layout-body lu-layout-all' })
        }
        luSideBar.clearMiniOpenMenu()
      })

      strBtnBox.on('click', '.sidebar-back', function () {
        luSideBar.lock = false
        $lulib.eventBus.emit('backModelHash')
      })

      layoutBody.on('mouseenter', '.lu-nav-item', function () {
        const { type, stretchDom2 } = luSideBar.checkStretchDomType()
        if (type || stretchDom2.length) return
        luSideBar.clearMiniOpenMenu()
        const children = $(this).find('.lu-nav-child')
        if (!children.length) return
        const html = `<ul class='layui-nav layui-nav-tree layui-this lu-layui-nav-zoom'><li class='layui-nav-item layui-nav-itemed'>${children.html()}</li></ul>`
        window.openMenu = layer.tips(html, $(this), {
          tips: [2, '#242d3c'],
          time: 1000 * 10, // 显示10秒
          skin: 'popup-tips',
          success(el) {
            let left = el.position().left - 49
            el.css({ left: left })
          },
        })
      })

      layoutBody.on('mouseleave', '.popup-tips', function () {
        const { type } = luSideBar.checkStretchDomType()
        if (!type) luSideBar.clearMiniOpenMenu()
      })

      layoutBody.on('click', '[data-lu-menuid]', function () {
        luSideBar.clearMiniOpenMenu()
        const thisDom = $(this)
        const id = thisDom.attr('data-lu-menuid')
        if (!id) return
        const hash = findItemById(luSideBar.currentData, id).href
        $lulib.pagePushHash(hash)
        // luSideBar.dispatchContentRender(id)
        const { type } = luSideBar.checkStretchDomType()
        if (type) return
        luSideBar.sideBarActive(id)
      })
    }
  }

  function findItemById(list, id) {
    for (let i = 0; i < list.length; i++) {
      let item = list[i]
      if (item.id === id) return item
      if (item.children) {
        const fi = findItemById(item.children, id)
        if (fi && fi.href) return fi
      }
    }
  }

  function findItemByHash(list, hash) {
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      if (item.href === hash) return item
      if (item.children) {
        const fi = findItemByHash(item.children, hash)
        if (fi && fi.href) return fi
      }
    }
  }

  exports('LuSideBar', LuSideBar)
})
