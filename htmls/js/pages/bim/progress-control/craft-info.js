layui.use(['LuCommonTemplate', 'LuLayer'], function () {
  const $ = layui.$

  const LuInnerHeader = layui.LuInnerHeader
  const LuLightBox = layui.LuLightBox

  class PageTemplate {
    renderContent(data) {
      let h = ''
      const image = data.image
      for (let i = 0; i < image.length; i++) {
        h += `<img src='${image[i]}' class='list-pic light-box' />`
      }

      return `
        <div class='left border-top'>
          <div class='table-list border-bottom'>
            <div class='table-item border-left w15'>
              <span class='table-title star'>工艺名称：</span>
            </div>
            <div class='table-item border-rightleft w85'>
              <span>${data.i1}</span>
            </div>
          </div>
          <div class='table-list border-bottom'>
            <div class='table-item border-left w15'>
              <span class='table-title star'>所属部位：</span>
            </div>
            <div class='table-item border-rightleft w85'>
              <span>${data.i2}</span>
            </div>
          </div>
          <div class='table-list border-bottom'>
            <div class='table-item border-left w15'>
              <span class='table-title'>施工单位：</span>
            </div>
            <div class='table-item border-rightleft w85'>
              <span>${data.i3}</span>
            </div>
          </div>
          <div class='table-list border-bottom'>
            <div class='table-item border-left w15'>
              <span class='table-title'>所属标段：</span>
            </div>
            <div class='table-item border-rightleft w85'>
              <span>${data.i4}</span>
            </div>
          </div>
          <div class='table-list border-bottom'>
            <div class='table-item border-left w15'>
              <span class='table-title'>工艺图片：</span>
            </div>
            <div class='table-item border-rightleft w85'>
              <div class='pic-box picBox'>
                 ${h}
              </div>
            </div>
          </div>
          <div class='table-list border-bottom'>
            <div class='table-item border-left w15'>
              <span class='table-title'>工艺说明：</span>
            </div>
            <div class='table-item border-rightleft w85'>
              ${data.i5}
            </div>
          </div>
        </div>
        <div class='right'>
          <h2 class='title'>${data.i1}</h2>
          <img class='pic' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9HSMFcO7nViL3Y6NZLAMhdXCPwn2CLadPj1q3inIHgRrPj_5BtuWYwR_Tn2xvD7cGcXA' alt=''>
          <a class='link' href='javascript:void(0)'>下载二维码</a>
        </div>
      `
    }
  }

  const pt = new PageTemplate()

  let luInnerHeader, currentId, luLightBox
  ;(async () => {
    innerHeaderRender()
    luLightBox = new LuLightBox()
    await getData()
  })()

  function innerHeaderRender() {
    luInnerHeader = new LuInnerHeader({
      title: '施工二维码',
      rightHtml: [{ txt: '返回', isWeaken: true }],
    })
  }

  $lulib.bindMethod([{ dom: luInnerHeader.rightBtns[0], method: () => $lulib.pageGoBack() }])

  $lulib.methodProxy.bindMethodProxy([{ dom: 'body', domStr: '.light-box', method: showLightBox }])

  function showLightBox() {
    const $this = $(this)
    const current = $this.attr('src')
    const urlList = []
    $this
      .parents('.picBox')
      .find('.light-box')
      .each((_, item) => urlList.push(item.src))
    luLightBox.openLightBox(current, urlList)
  }

  async function getData() {
    const params = $lulib.getHashParams()
    currentId = params.id
    const data = (await $.ajax(`/htmls/mock/bim/construcitonTableData.json?id=${currentId}`)).info2
    const html = pt.renderContent(data)
    $('#formGYHover').html(html)
  }
})
