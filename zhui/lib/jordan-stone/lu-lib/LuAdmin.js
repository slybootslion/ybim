layui.define([], exports => {
  const $ = layui.$
  const luUtils = layui.LuUtils
  const dropdown = layui.dropdown

  class LuHeader {
    init (opts) {
      const header = this
      this.opts = opts
      this.render(opts, click)

      // do hash
      function click (obj) {
        if (obj && obj.id === +(opts.id)) return
        if (!obj) {
          const params = luUtils.getHashParams()
          let pid = 1
          if (params && typeof params.pid === 'string') pid = +params.pid
          luUtils.pagePushHash(header.getHref(), { pid })
          return
        }
        luUtils.pagePushHash(header.getHref(), { pid: obj.id })
        this.opts.id = obj.id
        header.render(header.opts, click)
      }

      click.call(this)
      if (this.bindFlag) return
      this.bindMethod()
    }

    render (opts, click) {
      const hh = this.headerTemplate(opts)
      $("#luHeader").html(hh)
      dropdown.render({
        elem: '#projectBtn',
        data: [
          ...opts.projectList
        ],
        click: obj => {
          click.call(this, obj)
        },
      })
    }

    bindMethod () {
      const header = this
      $("#luHeader").on('click', '.btn-item', function () {
        header.bindFlag = true
        const isActive = $(this).hasClass('active')
        if (isActive) return
        const opts = header.opts
        $(this).addClass('active').siblings('.btn-item').removeClass('active')
        const id = $(this).data('id')
        const item = opts.buttonList.find(btn => btn.id === id)
        luUtils.pagePushHash(item.href, { pid: opts.id })
      })
    }

    headerTemplate (data) {
      let { projectList, weather, id } = data

      if (!id || (typeof id === 'string' && id === 'undefined')) id = 1
      const projectTitle = projectList.find(p => p.id === +id).title
      // mock
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
                <div class="btn-list"></div>
              </div>
              <div class="right">
                <div class="project-list" id="projectBtn">
                  <span class="iconfont icon-chanyeyuanqu"></span>
                  <span>${projectTitle} >></span>
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

    getHref () {
      let href = luUtils.getHashNoParams()
      if (!href) href = this.opts.buttonList[0].href
      return href
    }
  }

  class LuBody {
    async init (data) {
      this.data = data
      await this.bindMethod()
    }

    async renderBody () {
      const href = luUtils.getHashNoParams()
      if (!href) {
        await luUtils.delay(100)
        await this.renderBody()
        return
      }
      const bodyItem = this.data.buttonList.find(btn => btn.href === href)
      if (!bodyItem) {
        luUtils.pageReplace('/zhui/pages/error404.html')
        return
      }
      // btn list
      let btnHtml = ''
      const btnId = this.data.buttonList.find(btn => btn.href === href).id || 1
      for (let i = 0; i < this.data.buttonList.length; i++) {
        const item = this.data.buttonList[i]
        const isActive = item.id === btnId ? 'active' : ''
        btnHtml += `<div class="btn-item ${isActive}" data-id="${item.id}">${item.text}</div>`
      }
      $("#luHeader .btn-list").html(btnHtml)
      // real body render handler
      $("#luBody").html(await luUtils.ajax(`/zhui/pages/${bodyItem.href}.html`, { dataType: 'html' }))
      $("title").html(bodyItem.text + '智慧园区三维可视化运营管理系统')
      // add animation after render page
      await luUtils.delay(500)
      $(".content-body .left").addClass('left-animation')
      $(".content-body .right").addClass('right-animation')
      $(".content-body .content").addClass('content-animation')
    }

    async bindMethod () {
      $(window).on('hashchange', async () => {
        console.log('test bind count')
        await this.renderBody()
      })
      await this.renderBody()
    }
  }

  class LuAdmin {
    constructor () {
      this.luHeader = new LuHeader
      this.luBody = new LuBody
    }
  }

  exports('LuAdmin', new LuAdmin)
})
