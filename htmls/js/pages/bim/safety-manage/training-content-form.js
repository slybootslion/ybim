layui.use(['LuCommonTemplate', 'LuUtilsTemplate'], function () {
  const $ = layui.$

  const LuInnerHeader = layui.LuInnerHeader

  let luInnerHeader, params

  class PageTemplate {
    topTemplate (data) {
      const html = `<h3 class='top-header'>添加培训内容</h3>
                    <div class='content-head'>
                      <span>基本信息</span>
                    </div>
                    <div class='content-body content-form'>
                      <div class='layui-form-item'>
                        <label class='layui-form-label'>培训名称：</label>
                        <div class='layui-input-block'>
                          <span class='info'>${data.i1}</span>
                        </div>
                      </div>
                      <div class='layui-form-item'>
                        <label class='layui-form-label'>培训地点：</label>
                        <div class='layui-input-block'>
                          <span class='info'>${data.i2}</span>
                        </div>
                       </div>
                      <div class='layui-form-item'>
                        <label class='layui-form-label'>组织部门：</label>
                        <div class='layui-input-block'>
                          <span class='info'>${data.i3}</span>
                        </div>
                       </div>
                      <div class='layui-form-item'>
                        <label class='layui-form-label'>培训时间：</label>
                        <div class='layui-input-block'>
                          <span class='info'>${data.i4}</span>
                        </div>
                       </div>
                      <div class='layui-form-item'>
                        <label class='layui-form-label'>主讲人：</label>
                        <div class='layui-input-block'>
                          <span class='info'>${data.i5}</span>
                        </div>
                       </div>
                    </div>`
      return html
    }
  }

  const pt = new PageTemplate()
  !(async () => {
    initParams()
    luInnerHeader = new LuInnerHeader({
      title: '教育培训',
      rightHtml: [{ txt: '返回', isWeaken: true }],
    })
    await renderBodyForm()
  })()

  $lulib.bindMethod([{ dom: luInnerHeader.rightBtns[0], method: $lulib.pageGoBack }])

  function initParams () {
    params = $lulib.getHashParams()
  }

  function renderBodyForm () {
    // mock
    const data = {
      i1: 'S107关中环线智慧公交候车亭施工项目职工上岗安全教育',
      i2: 'A标段项目部会议室',
      i3: '项目部安全科',
      i4: '2021-12-15',
      i5: '王晶',
    }
    const html = pt.topTemplate(data)
    $(".top.content-inner").html(html)
  }
})
