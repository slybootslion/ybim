layui.use(['LuCommonTemplate', 'LuUtilsTemplate', 'LuLayer', 'zTree'], function () {
  const $ = layui.$

  const LuUtilsTemplate = layui.LuUtilsTemplate

  const zTree = layui.zTree

  class PageTemplate {
    contentTemplate() {
      const leftTreeTemplate = `<div class='files-box'>
                                  <ul id='zTreeProgressDisplay' class='ztree'></ul>
                                </div>`

      const rightSymbolTemplate = `
          <div class='item'>
            <span class='color green'></span>
            <span class='txt'>已完成</span>
          </div>
          <div class='item'>
            <span class='color black'></span>
            <span class='txt'>未完工</span>
          </div>
          <div class='item'>
            <span class='color red'></span>
            <span class='txt'>延期完成</span>
          </div>`

      return {
        leftTreeTemplate,
        rightSymbolTemplate,
      }
    }
  }

  const pt = new PageTemplate()
  ;(() => {
    renderContent()
    initZTree()
  })()

  function renderContent() {
    const { leftTreeTemplate, rightSymbolTemplate } = pt.contentTemplate()
    $('.left-box').html(leftTreeTemplate)
    $('.right-box .symbol-box').html(rightSymbolTemplate)
  }

  function initZTree() {
    // mock
    let zNodesBimLab = [
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
        children: [{ name: '上部结构上部结构上部结构' }, { name: '箱梁' }, { name: '伸缩缝' }],
      },
      {
        name: '下部结构',
        open: true,
        click: false,
        children: [{ name: '桩基' }, { name: '承台' }, { name: '墩身' }, { name: '垫台' }],
      },
      {
        name: '土建9标',
        open: true,
        click: false,
        children: [{ name: '上部结构' }, { name: '箱梁' }, { name: '伸缩缝' }],
      },
    ]
    let setting = {
      view: {
        showIcon: false,
      },
      callback: {
        beforeClick,
        onClick,
      },
    }
    $.fn.zTree.init($('#zTreeProgressDisplay'), setting, zNodesBimLab)
  }

  function beforeClick(treeId, treeNode, clickFlag) {
    return treeNode.click !== false
  }

  function onClick(event, treeId, treeNode, clickFlag) {
    console.log(treeNode)
  }

  LuUtilsTemplate.mouseMove($('.titleMove'), '.moveContent')

  $lulib.methodProxy.bindMethodProxy([
    { dom: 'body', domStr: '.info-tab .tab-box span', method: changeTab }
  ])

  function changeTab() {
    const idx = $(this).index()
    $(this)
      .addClass('active')
      .siblings('span')
      .removeClass('active')
      .parents('.info-tab')
      .find('.content-box .content')
      .eq(idx)
      .addClass('active')
      .siblings('.content')
      .removeClass('active')
  }
})
