layui.use([], () => {
  const $ = layui.$
  const luUtils = layui.LuUtils

  class PageTemplate {
    templateRight (data) {
      const { block1 } = data

      let h1 = ''
      for (let i = 0; i < block1.dataList.length; i++) {
        const item = block1.dataList[i]
        h1 += `<div class="equipment-item">
                  <div class="icon">
                    <span class="iconfont ${item.icon}"></span>
                  </div>
                  <div class="txt">${item.title}</div>
                  <div class="nums">
                    <span class="num-1">${item.nums.num1}/</span>
                    <span class="num-2">${item.nums.num2}</span>
                  </div>
                  <div class="desc">（启用/停用）</div>
                </div>`
      }
      return `<div class="block1 block">
                <div class="block-title">${block1.title}</div>
                <div class="block-content">${h1}</div>
              </div>`
    }
  }

  const pt = new PageTemplate

  let pageData
  ;(async () => {
    // mock
    pageData = await luUtils.ajax('/zhui/mock/equipmentData.json')
    await luUtils.delay(500)
    render()
  })()

  function render () {
    const { left, right, content } = pageData
    const rightHtml = pt.templateRight(right)
    $(".content-body .right").html(rightHtml)
  }
})
