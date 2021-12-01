layui.use([], () => {
  const $ = layui.$
  const luUtils = layui.LuUtils

  class PageTemplate {
    templateLeft (data) {
      const { block3 } = data

      let block3Html = ''
      for (let i = 0; i < block3.data.length; i++) {
        const item = block3.data[i]
        const levelTag = 'level' + item.level
        block3Html += `<div class="warning-item ${levelTag}">
          <span class="iconfont icon-jingshi"></span>
          <span class="desc txt-overflow">${item.info}</span>
          <span class="date">${item.date}</span>
        </div>`
      }

      return `
      <div class="block3 block">
        <div class="block-title">${block3.title}</div>
        <div class="warning-list">${block3Html}</div>
      </div>`
    }
  }

  const pt = new PageTemplate

  let pageData = null
  ;(async () => {
    pageData = await luUtils.ajax('/zhui/mock/securityData.json')
    await luUtils.delay(500)
    render()
  })()

  function render () {
    const { left } = pageData
    const leftHtml = pt.templateLeft(left)
    $(".content-body .left").html(leftHtml)
  }


})
