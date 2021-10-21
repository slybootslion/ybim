layui.use(['LuCommonTemplate'], function () {
  const $ = layui.$
  const tree = layui.tree

  $(".selectBridge .btn-item").on('click', async function () {
    const isActive = $(this).hasClass('active')
    if (isActive) return
    $(this).addClass('active').siblings('.btn-item').removeClass('active')
    // do something
    markTreeNode()
  });

  function computedContentHeight () {
    const { sH } = $lulib.screenWidthHeight()
    const h = sH - 160
    $(".page-container .content").css({ height: h })
  }

  computedContentHeight()

  const treeRender = async () => {
    const treeData = await $lulib.ajax('/qljcs/data/inspectionTreeData.json', 'json')
    const inst1 = tree.render({
      elem: '#sideTree',
      data: treeData,
      showLine: false,
      click: treeNodeClick
    })
  }
  !(async () => {
    await treeRender()
    markTreeNode()
  })()

  function treeNodeClick (obj) {
    if (!obj.data.children) {
      markTreeNode(obj.elem)
    }
  }

  function markTreeNode (el) {
    const leafNodes = $(".layui-tree-iconArrow.layui-hide").parents('.layui-tree-entry')
    leafNodes.each((_, dom) => $(dom).removeClass('active'))
    if (!el) {
      console.log(leafNodes)
      leafNodes.eq(leafNodes.length - 1).addClass('active')
    } else {
      el.find('.layui-tree-entry').addClass('active')
    }
  }
})
