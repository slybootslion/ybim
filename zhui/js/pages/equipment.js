layui.use([], () => {
  const $ = layui.$
  const luUtils = layui.LuUtils

  class PageTemplate {
    templateRight (data) {
      const { block1, block2 } = data

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

      let h2 = ''
      for (let i = 0; i < block2.data.length; i++) {
        const item = block2.data[i]
        const levelTag = 'level' + item.level
        h2 += `<div class="warning-item ${levelTag}">
          <span class="iconfont icon-jingshi"></span>
          <span class="desc txt-overflow">${item.info}</span>
          <span class="date">${item.date}</span>
        </div>`
      }
      return `<div class="block1 block">
                <div class="block-title">${block1.title}</div>
                <div class="block-content">${h1}</div>
              </div>
              <div class="block2 block">
                <div class="block-title">${block2.title}</div>
                <div class="warning-list">${h2}</div>
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
