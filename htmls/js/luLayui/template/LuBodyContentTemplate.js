layui.define(['laytpl', 'element'], function (exports) {
  const $ = layui.jquery
  const template = layui.laytpl
  const element = layui.element

  class BodyContentTemp {
    constructor(shrink) {
      this.pageStack = []
      this.shrink = shrink
    }

    renderSideBar(list, back = false) {
      const SHRINK = 'all'
      let h = ``
      for (let i = 0; i < list.length; i++) {
        const menu = list[i]
        if (!menu.hide) {
          let ch = ``
          if (menu.children) ch = this.renderSideBarChildren(menu.children)
          const data = {
            MENU_ACTIVE_CLASS: 'layui-this',
            ...this._formatSideBarMenuAttr(menu),
            ...menu,
            children: ch,
          }
          const html = `
            <li class="layui-nav-item lu-nav-item lu-menu {{d.active ? d.MENU_ACTIVE_CLASS : ''}}">
              <a href='{{d.hrefFlag}}' data-lu-menuid="{{d.children ? '' : d.id}}">
                <span class='iconfont {{d.icon}}'></span><span class='menu-title'>{{d.title}}</span>
              </a>
              {{d.children}}
            </li>        
          `
          h += template(html).render(data)
        }
      }
      const html = `<ul class='layui-nav layui-nav-tree' lay-shrink='${this.shrink ? SHRINK : ''}'>${h}</ul>`
      $('#sidebarListBox').html(html)
      element.init()

      let h2 = ''
      if (back) {
        h2 = `<a class='sidebar-back' href='javascript:void(0)'><span>返回</span></a>`
      } else {
        const isMini = !!$('.lu-layout-mini').length
        h2 = `<a class='stretch-a' data-lu-stretch='${
          isMini ? 0 : 1
        }' href='javascript:void(0)'><span class='iconfont icon-ziyuan'></span> <span class='shousuo-txt'>收缩</span></a>`
      }
      let html2 = ``
      $('#stretchBtnBox').html(h2)
    }

    renderSideBarChildren(list, is3 = false) {
      let len = list.length, h = '', hc = ''
      for (let i = 0; i < list.length; i++) {
        const menu = list[i]
        len--
        if (!menu.hide && !menu.children) {
          const data = {
            ...this._formatSideBarMenuAttr(menu),
            ...menu,
          }
          h += `
              <dd class='lu-menu'>
                <a href='${data.hrefFlag}' ${data.targetFlag} data-lu-menuid='${data.id}' class='${is3 ? 'children-menu-3' : ''}'>
                  <span class='menu-title-child'>${data.title}</span>
                </a>
              </dd>
            `
          if (!len) {
            if (!hc) return `<dl class='layui-nav-child lu-nav-child'>${h}</dl>`
            else return hc + `<dl class='layui-nav-child lu-nav-child'>${h}</dl>`
          }
        } else if (menu.children && menu.children.length) {
          const childrenHtml = this.renderSideBarChildren(menu.children, true)
          hc += `
             <dl class='layui-nav-child lu-nav-child'>
              <dd class='menu-dd'>
                <a href='javascript:;' class='menu-child-level1'>
                  <span class='layui-left-nav'>${menu.title}</span>
                  <span class='layui-nav-more'></span>
                </a>
                ${childrenHtml}
              </dd>
             </dl>
          `
          if (!len) return `<dl class='layui-nav-child lu-nav-child'>${h}</dl>` + hc
        }
      }
      return `<dl class='layui-nav-child lu-nav-child'>${h}</dl>`
    }

    _formatSideBarMenuAttr(menu) {
      const targetFlag = menu.target ? `target="${menu.target}"` : ''
      const hrefFlag = menu.target && menu.href ? menu.href : 'javascript:void(0)'
      // const hrefData = menu.href ? `data-lu-href="${menu.href}"` : ''
      return {
        targetFlag,
        hrefFlag,
      }
    }

    renderBodyContent({ animation, href, title }) {
      const TITLE_SUFFIX = 'BIM智慧工地综合管理平台'
      $('title').html(`${title} - ${TITLE_SUFFIX}`)
      this.animation = animation
      return this.renderPageContent(href)
    }

    async renderPageContent(url, force = true) {
      let contentEl = $('#bodyOnePage')
      const idUrl = url.replace(/\//g, '').toUpperCase()
      const aniClass = this.animation ? 'iframe-animation' : ''
      url = '/htmls/pages/' + url + '.html'
      const page = await $lulib.ajax(url)
      const divHtml = `<div class='content-page-in-stack ${aniClass}' id='${idUrl}'>
                         ${page}
                       </div>`
      if (force) {
        contentEl.html('')
        contentEl.html(divHtml)
        this.pageStack.length = 0
        this.pageStack.push(idUrl)
      } else {
        // 慎用
        contentEl.append(divHtml)
        this.pageStack.push(idUrl)
      }
    }

    removerLast(el) {
      const id = this.pageStack.pop()
      $(`#${id}`).remove()
    }
  }

  exports('LuBodyContentTemplate', BodyContentTemp)
})
