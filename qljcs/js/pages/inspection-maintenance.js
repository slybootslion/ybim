layui.use(['LuCommonTemplate'], function () {
  const $ = layui.$
  const tree = layui.tree

  class PageTemplate {
    rightNavBlockTemplate (obj) {
      return `<div class="content-right-title">
          <h1>${obj.data.title}</h1>
          <div class="score">评分：<span>${obj.score}</span></div>
        </div>
        <div class="content-nav">
          <div class="content-nav-item active">裂缝列表</div>
          <div class="content-nav-item">缺陷列表</div>
        </div>`
    }

    rightBlockTemplate (listData) {
      const dictTop = {
        t1: '部位', t2: '构建', t3: '编号'
      }
      const dictBottom = {
        b1: '裂缝位置', b2: '裂缝长度', b3: '裂缝走向', b4: '裂缝标度', b5: '裂缝深度', b6: '裂缝描述'
      }

      let h = ''
      for (let i = 0; i < listData.length; i++) {
        const item = listData[i]
        const arr = Object.keys(item)
        let tHtml = '', bHtml = ''
        arr.forEach(key => {
          if (dictTop[key]) {
            tHtml += `<div class="content-right-item-block"><div class="label">${dictTop[key]}：</div><div class="text">${item[key]}</div></div>`
          }
          if (dictBottom[key]) {
            bHtml += `<div class="content-right-item-block"><div class="label">${dictBottom[key]}：</div><div class="text">${item[key]}</div></div>`
          }
        })
        h += `<div class="content-right-item">
            <div class="content-right-item-top">${tHtml}</div>
            <div class="content-right-item-bottom">${bHtml}</div>
          </div>`
      }
      return `${h}`
    }
  }

  const pt = new PageTemplate
  let treeData = null, treeInstance = null

  const treeRender = async () => {
    treeData = await $lulib.ajax('/qljcs/data/inspectionTreeData.json', 'json')
    treeInstance = tree.render({
      elem: '#sideTree',
      data: treeData,
      showLine: false,
      click: treeNodeClick
    })
  }

  !(async () => {
    await treeRender()
    await treeNodeClick()
  })()

  $lulib.methodProxy.bindMethodProxy([
    { dom: '.nav-box', domStr: '.content-nav-item', method: handleNavItem },
  ])

  $(".selectBridge .btn-item").on('click', async function () {
    const isActive = $(this).hasClass('active')
    if (isActive) return
    $(this).addClass('active').siblings('.btn-item').removeClass('active')
    // do something
    await treeNodeClick()
  })

  function handleNavItem () {
    const $this = $(this)
    const isActive = $this.hasClass('active')
    if (isActive) return
    $this.addClass('active').siblings('.content-nav-item').removeClass('active')
  }

  // function computedContentHeight (dom, navH) {
  //   const { height } = $lulib.domWidthHeight('#bodyOnePage')
  //   const { height: headerH } = $lulib.domWidthHeight('.lu-header-ql')
  //   const { height: navH } = $lulib.domWidthHeight('.page-container .nav')
  //   const h = height - headerH - navH
  //   if (typeof dom === 'string') {
  //     $(dom).css({ height: h })
  //   } else {
  //     dom.css({ height: h })
  //   }
  //   // $(".page-container .content")
  // }
  $lulib.computedContentHeight($(".page-container .content"), $lulib.domWidthHeight('.page-container .nav').height)

  async function treeNodeClick (obj) {
    if (!obj) {
      const leafNodes = $(".layui-tree-iconArrow.layui-hide").parents('.layui-tree-entry')
      leafNodes.eq(leafNodes.length - 1).find('.layui-tree-txt').click()
      return
    }
    if (!obj.data.children) {
      markTreeNode(obj.elem)
      await renderBlockContent(obj)
    }
  }

  async function renderBlockContent (obj) {
    // mock
    obj.score = 99.89
    const listData = await $lulib.getMockData('/qljcs/mock/inspectionMaintenanceBlockListData.json', 8, null, false)
    const navHtml = pt.rightNavBlockTemplate(obj)
    const contentHtml = pt.rightBlockTemplate(listData)
    $(".content-right .nav-box").html(navHtml)
    $(".content-right .right-content").html(contentHtml)
  }

  function markTreeNode (el) {
    const leafNodes = $(".layui-tree-iconArrow.layui-hide").parents('.layui-tree-entry')
    leafNodes.each((_, dom) => $(dom).removeClass('active'))
    if (!el) {
      leafNodes.eq(leafNodes.length - 1).addClass('active')
    } else {
      el.find('.layui-tree-entry').addClass('active')
    }
  }
})
