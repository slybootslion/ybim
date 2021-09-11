layui.use(['LuCommonTemplate', 'LuLayer', 'zTree'], function() {
  const $ = layui.$

  const LuInnerHeader = layui.LuInnerHeader
  const LuLightBox = layui.LuLightBox

  class PageTemplate {
    renderContent (data) {
      let h = ''
      const image = data.image
      for (let i = 0; i < image.length; i++) {
        h += `<img src='${image[i]}' class='list-pic light-box' />`
      }
      return `
        <div class="left border-top">
          <div class="table-list border-bottom">
            <div class="table-item border-left w15">
              <span class="table-title">单项工程名称：</span>
            </div>
            <div class="table-item border-left w35">
              <span>${data.i1}</span>
            </div>
            <div class="table-item border-left w15">
              <span class="table-title">单项工程概况：</span>
            </div>
            <div class="table-item border-rightleft w35">
                <span>
                  ${data.i5}
                </span>
            </div>
          </div>
          <div class="table-list border-bottom">
            <div class="table-item border-left w15">
              <span class="table-title">关联任务：</span>
            </div>
            <div class="table-item border-left w35">
              <a href="javascript:void(0)" class="link">查看关联任务</a>
            </div>
            <div class="table-item border-left w15">
              <span class="table-title">施工单位：</span>
            </div>
            <div class="table-item border-rightleft w35">
              <span>${data.i6}</span>
            </div>
          </div>
          <div class="table-list border-bottom">
            <div class="table-item border-left w15">
              <span class="table-title">标段：</span>
            </div>
            <div class="table-item border-left w35">
              <span>${data.i2}</span>
            </div>
            <div class="table-item border-left w15">
              <span class="table-title">监理单位：</span>
            </div>
            <div class="table-item border-rightleft w35">
              <span>${data.i7}</span>
            </div>
          </div>
          <div class="table-list border-bottom">
            <div class="table-item border-left w15">
              <span class="table-title star">现场负责人：</span>
            </div>
            <div class="table-item border-left w35">
              <span>${data.i3}</span>
            </div>
            <div class="table-item border-left w15">
              <span class="table-title star">旁站监理：</span>
            </div>
            <div class="table-item border-rightleft w35">
              <span>${data.i8}</span>
            </div>
          </div>
          <div class="table-list border-bottom">
            <div class="table-item border-left w15">
              <span class="table-title star">施工日期：</span>
            </div>
            <div class="table-item border-left w35">
              <span>${data.i4}</span>
            </div>
            <div class="table-item border-left w15">
              <span class="table-title">里程桩号：</span>
            </div>
            <div class="table-item border-rightleft w35">
              <span>${data.i9}</span>
            </div>
          </div>
          <div class="table-list border-bottom">
            <div class="table-item border-left w15">
              <span class="table-title">施工图片：</span>
            </div>
            <div class="table-item border-rightleft w85">
              <div class="pic-box picBox">
                ${h}
              </div>
            </div>
          </div>
          <div class="table-list border-bottom">
            <div class="table-item border-left w15">
              <span class="table-title">施工工艺：</span>
            </div>
            <div class="table-item border-rightleft w85">
              <span>${data.i10}</span>
            </div>
          </div>
          <div class="table-list border-bottom">
            <div class="table-item border-left w15">
              <span class="table-title">备注：</span>
            </div>
            <div class="table-item border-rightleft w85">
              <span>${data.i11}</span>
            </div>
          </div>
        </div>
        <div class="right">
          <h2 class="title">${data.i1}</h2>
          <img class="pic" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9HSMFcO7nViL3Y6NZLAMhdXCPwn2CLadPj1q3inIHgRrPj_5BtuWYwR_Tn2xvD7cGcXA" alt="">
          <a class="link" href="javascript:void(0)">下载二维码</a>
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

  async function getData() {
    const params = $lulib.getHashParams()
    currentId = params.id
    // mock
    const data = (await $.ajax(`/htmls/mock/bim/construcitonTableData.json?id=${currentId}`)).info1
    const html = pt.renderContent(data)
    $("#infoHover").html(html)
  }

  $lulib.bindMethod([{ dom: luInnerHeader.rightBtns[0], method: () => $lulib.pageGoBack() }])

  $lulib.methodProxy.bindMethodProxy([
    { dom: 'body', domStr: '.light-box', method: showLightBox },
  ])

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
})
