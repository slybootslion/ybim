layui.define(['laytpl', 'dropdown'], function (exports) {
  const $ = layui.jquery
  const template = layui.laytpl
  const dropdown = layui.dropdown

  class HeaderTemplate {
    constructor (data) {
      this.data = data
      this.blockData = [
        { title: 'BIM管理平台', icon: 'bim', id: 1, path: 'bim/ctrl/index' },
        { title: '智慧工地', icon: 'zhgd', id: 2, path: 'zhgd/ctrl/index' },
        { title: '桥梁监测', icon: 'qljc', id: 3, path: 'qljc/ctrl/index' },
        { title: '智慧梁场', icon: 'zhlc', id: 4, path: 'zhlc/ctrl/index' },
      ]
    }

    renderHeader () {
      const headerHtml = `
        <div class='header-logo'>
          <img src='/htmls/images/public/logo.png' alt=''>
        </div>
        <div class='header-content'>
          <div class='header-content-left'>
            <span class='txt'">{{d.projectName}}</span>
            <span class='iconfont icon-tucengzhanshifangshipeizhi' 
                  id='headerLeft1'></span>
            <span id="headerLeft2">
              <span class="iconfont icon-yingyong"></span><span>桥梁检测</span>
            </span>
<!--            <span>-->
<!--              <span class='iconfont icon-yingyong' -->
<!--                    id='headerLeft2'></span>-->
<!--              <span class='left2-text'>{{d.modelName}}</span>-->
<!--            </span>-->
          </div>
          <div class='header-content-right'>
            <div class='user-setting' 
                 id='ldjsc'>
              <span class='iconfont icon-yonghuquanxianx'></span>
              <span>领导驾驶舱</span>
            </div>
            <div class='time-box'>
              <span id='headerTime'>{{d.time}}</span>
            </div>
            <div class='username-box'>
              <span class='iconfont icon-das'></span>
              <span class='username' id='username'>
                <a href='javascript:void(0)'>{{d.username}}</a>
              </span>
            </div>
          </div>
        </div>
`
      const data = this.data
      if (!data.modelName) data.modelName = 'BIM管理平台'
      else {
        const model = this.blockData.find(i => i.icon === data.modelName)
        if (!model) {
          if (data.modelName === 'user') data.modelName = '用户设置'
        } else {
          data.modelName = model.title
        }
      }
      const html = template(headerHtml).render(data)
      $('.lu-header').html(html)
    }

    updateProjectName (name) {
      $('.header-content .header-content-left .txt').html(name)
    }

    // updateBlockName (name) {
    //   $('.header-content .header-content-left .left2-text').html(name)
    // }

    renderProjectList (list) {
      const data = list.map(item => {
        item.title = item.name
        delete item.name
        return item
      })

      dropdown.render({
        elem: '#headerLeft1',
        data,
        click: obj => {
          this.updateProjectName(obj.title)
          $lulib.eventBus.emit('changeHeadProject', obj)
        },
      })
    }

    renderBLock () {
      /*let h = ``
      $.each(this.blockData, (idx, item) => {
        h += `<div class='header-dd-b-item' data-index='${idx}'>
                 <img class='h-dd-b-i-pic' src='/htmls/images/public/${item.icon}.png' alt=''>
                 <span>${item.title}</span>
              </div>`
      })
      const content = `<div class='header-dropdown-block'>${h}</div>`
      dropdown.render({
        elem: '#headerLeft2',
        content,
        ready: elemPanel => {
          elemPanel[0].style.display = 'block'
          const dom = $('.header-dropdown-block')

          const fn = e => {
            let ele = e.target.className === 'header-dd-b-item' ? $(e.target) : $(e.target).parent('.header-dd-b-item')
            const item = this.blockData[$(ele).data('index')]
            $lulib.pagePushHash(item.path)
            this.updateBlockName(item.title)
            elemPanel[0].style.display = 'none'
            dom.off('click')
          }

          dom.on('click', '.header-dd-b-item', fn)
        },
      })*/
    }
  }

  class HeaderTemplateQL {
    constructor (data) {
      this.data = data
    }

    renderHeader () {
      const data = this.data
      const picDist = {
        1: { t: '晴', icon: 'p1' },
        2: { t: '雪', icon: 'p2' },
        3: { t: '阴', icon: 'p3' },
        4: { t: '雨', icon: 'p4' },
      }
      const desDist = { c0: '优', c1: '良', c2: '轻度污染', c3: '中度污染', c4: '重度污染', c5: '严重污染' }
    }
  }

  exports('LuHeaderTemplate', HeaderTemplate)
  exports('LuHeaderTemplateQL', HeaderTemplateQL)
})
