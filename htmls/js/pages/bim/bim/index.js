layui.use(['LuUtilsTemplate', 'zTree'], function () {
  const $ = layui.jquery
  const colorpicker = layui.colorpicker
  const zTree = layui.zTree

  const LuUtilsTemplate = layui.LuUtilsTemplate

  function fn1() {
    console.log('fn1')
  }

  class PageTemplate {
    renderToolsBar() {
      const toolsBar = [
        { icon: 'icon-xuanzhuan', title: '位置复原' },
        { icon: 'icon-qingchu', title: '清除事件' },
        {
          icon: 'icon-touming',
          title: '透明展示',
          children: [
            { title: '全透明', fn: fn1 },
            { title: '局部透明', fn: fn1 },
            { title: '局部隐藏', fn: fn1 },
          ],
        },
        {
          icon: 'icon-yanse',
          title: '颜色',
          children: [
            { title: '红色展示', fn: fn1 },
            { title: '绿色展示', fn: fn1 },
            { title: '黄色展示', fn: fn1 },
            { title: '蓝色展示', fn: fn1 },
            { title: '随机颜色', fn: fn1 },
          ],
        },
        {
          icon: 'icon-zu',
          title: '模型可见',
          children: [
            { title: '模型展示', fn: fn1 },
            { title: '模型GIS', fn: fn1, name: '模型+GIS' },
            { title: '模型倾斜摄影', fn: fn1, name: '模型+倾斜摄影' },
            { title: '整体展示', fn: fn1 },
            { title: '旋转展示', fn: fn1 },
          ],
        },
        {
          icon: 'icon-biaoqianguanli2',
          title: '标签管理',
          children: [
            { title: '标签标记', fn: fn1 },
            { title: '我的标签', fn: fn1 },
            { title: '病害标记', fn: fn1 },
          ],
        },
        { icon: 'icon-beijing', title: '背景色' },
        {
          icon: 'icon-celiang',
          title: '测量',
          children: [
            { title: '测距离', fn: fn1 },
            { title: '测高程', fn: fn1 },
          ],
        },
        { icon: 'icon-shidianquanbushidianiconmoren', title: '视点保存' },
        { icon: 'icon-Wendang', title: '属性' },
      ]

      let i = 0
      let len = toolsBar.length
      let html = ``
      let cm = []
      for (; i < len; i++) {
        const item = toolsBar[i]
        let c = ''
        if (item.children) {
          let { html, methodsArr } = this.renderToolBarChildren(item.children)
          c = html
          cm = cm.concat(methodsArr)
        }
        html += `<li class='tools-item ${!!c ? 'more' : ''}' title='${item.title}'>
                  <span class='iconfont ${item.icon}'></span>
                  ${c}
                </li>`
      }

      $('.tools-bar').html(html)

      if (cm.length) {
        cm.forEach(m => $(`[title=${m.title}]`).on('click', m.fn))
      }
    }

    renderToolBarChildren(children) {
      let i = 0
      let len = children.length
      let h = ''

      const methodsArr = []
      for (; i < len; i++) {
        const item = children[i]
        h += `<span title='${item.title}'>${item.name || item.title}</span>`
        methodsArr.push({
          title: item.title,
          fn: item.fn,
        })
      }

      return {
        html: `<div class='tools-child-box'>${h}</div>`,
        methodsArr,
      }
    }

    renderIconBox(info) {
      function hideInfo(e) {
        e.stopPropagation()
        $(this).parents('.base-info-content').hide()
      }

      function showInfo() {
        $(this).find('.base-info-content').show()
      }

      let h = ''
      for (let i = 0; i < info.length; i++) {
        const item = info[i]
        h += `<div class='item'>${item.key}：${item.value}</div>`
      }
      const html = `<div class='icon base-info'>
                      <span class='iconfont icon-xinxi'></span>
                      <div class='base-info-content'>
                        <div class='title'>
                          <span>基本信息</span>
                          <span class='close'>X</span>
                        </div>
                        <div class='info-content'>
                          ${h}
                        </div>
                      </div>
                    </div>
                    <div class='icon hide-label'>
                      <span class='iconfont icon-yincangbiaoji_icon'></span>
                    </div>`
      $('.info-icon-box').html(html)
      $lulib.methodProxy.bindMethodProxy([
        { dom: '.info-icon-box', domStr: '.title .close', method: hideInfo },
        { dom: '.info-icon-box', domStr: '.icon.base-info', method: showInfo },
      ])
    }
  }

  const pt = new PageTemplate()

  // 属性弹窗tab切换
  $('.title-tab .mod-title').on('click', function () {
    if ($(this).hasClass('active')) return true
    const idx = $(this).index()
    $(this)
      .addClass('active')
      .siblings('.mod-title')
      .removeClass('active')
      .parents('.layer-content')
      .find('.detail-tab-content .detail-item')
      .eq(idx)
      .addClass('active')
      .siblings('.detail-item')
      .removeClass('active')
  })

  // close
  $('.layer-content .iconfont.icon-guanbi').on('click', function () {
    $(this).parents('.layer-content').hide()
  })

  // 层级
  $('.layer-content').on('click', function () {
    $(this).css({ zIndex: 2 }).siblings('.layer-content').css({ zIndex: 1 })
  })

  LuUtilsTemplate.mouseMove($('.titleMove'), '.moveContent')
  ;(() => {
    pt.renderToolsBar()
    // mock
    const info = [
      { key: '路线全长', value: '20.401km' },
      { key: '平面交叉', value: '75处' },
      { key: '等级公路交叉', value: '12处' },
      { key: '乡村道路交叉', value: '63处' },
      { key: '涵洞', value: '29道' },
      { key: '路基宽度', value: '28m' },
      { key: '公交港湾', value: '29处' },
    ]
    pt.renderIconBox(info)
  })()

  // 部件库树结构
  let setting = {
    view: {
      showIcon: false,
    },
    callback: {
      beforeClick,
      onClick,
    },
  }
  let zNodesBimlab = [
    {
      name: '土建9标',
      open: true,
      click: false,
      children: [{ name: '上部结构' }, { name: '箱梁' }, { name: '伸缩缝' }],
    },
    {
      name: '下部结构',
      open: true,
      click: false,
      children: [{ name: '桩基' }, { name: '承台' }, { name: '墩身' }, { name: '垫台' }],
    },
    {
      name: '土建7标',
      open: true,
      click: false,
      children: [{ name: '上部结构' }, { name: '箱梁' }, { name: '伸缩缝' }],
    },
    {
      name: '下部结构',
      open: true,
      click: false,
      children: [{ name: '桩基' }, { name: '承台' }, { name: '墩身' }, { name: '垫台' }],
    },
  ]

  function beforeClick(treeId, treeNode, clickFlag) {
    return treeNode.click !== false
  }

  function onClick(event, treeId, treeNode, clickFlag) {
    // console.log(treeNode)
  }

  zTree.init($('#zTree-Bimlib'), setting, zNodesBimlab)

  colorpicker.render({
    elem: '#colorPicker',
    color: '#00f5fe',
  })

  $('.right-box .right-3').on('click', function () {
    $(this).css({ zIndex: 2 }).siblings('.right-2').css({ zIndex: 1 })
  })

  $('.right-box .right-3 .content-item').on('click', function () {
    let isActive = $(this).hasClass('active')
    if (isActive) {
      return false
    }
    $(this).addClass('active').siblings('.content-item').removeClass('active')
  })

  $('.right-box .right-3 .slide-btn').on('click', function () {
    let isActive = $(this).hasClass('active')
    if (isActive) {
      $(this).removeClass('active').siblings('.content').stop().slideUp().parents('.container').stop().animate({ width: 76 })
    } else {
      $(this).addClass('active').parents('.container').stop().animate({ width: 220 }).find('.content').stop().slideDown()
    }
  })

  $('.top-back-box .top-close').on('click', function () {
    // $lulib.pageGoBack()
    $(".table-mod-content").removeClass('half-active');
  })

  $('#bindBtn').on('click', function () {
    const $this = $(this)
    $this.html() === '取消标记' ? $this.html('确定标记') : $this.html('取消标记')
  })
})
