layui.use(['LuCommonTemplate', 'LuUtilsTemplate'], function () {
  const $ = layui.$

  const LuInnerHeader = layui.LuInnerHeader

  let luInnerHeader, params, luUpload

  class PageTemplate {
    topTemplate (data) {
      return `<h3 class='top-header'>会议详细</h3>
                    <div class='content-head'>
                      <span>基本信息</span>
                    </div>
                    <div class='content-body content-form'>
                      <div class='layui-form-item'>
                        <label class='layui-form-label'>会议名称：</label>
                        <div class='layui-input-block'>
                          <span class='info'>${data.i1}</span>
                        </div>
                      </div>
                      <div class='layui-form-item'>
                        <label class='layui-form-label'>会议地点：</label>
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
                        <label class='layui-form-label'>会议时间：</label>
                        <div class='layui-input-block'>
                          <span class='info'>${data.i4}</span>
                        </div>
                       </div>
                      <div class='layui-form-item'>
                        <label class='layui-form-label'>主持人：</label>
                        <div class='layui-input-block'>
                          <span class='info'>${data.i5}</span>
                        </div>
                       </div>
                    </div>`
    }

    bottomTemplate (data) {
      return `
              <div class='content-head'>
                <span>基本信息</span>
              </div>
              <div class='content-body content-form'>
                <div class='layui-form-item'>
                  <label class='layui-form-label'><span>记录人：</span></label>
                  <div class='layui-input-block'>
                    <span class='info'>${data.i7}</span>
                  </div>
                </div>
                <div class='layui-form-item'>
                  <label class='layui-form-label'><span>参加人员：</span></label>
                  <div class='layui-input-block'>
                    <span class='info'>${data.i8}</span>
                  </div>
                </div>
                <div class="layui-form-item">
                  <label class='layui-form-label'><span>会议内容：</span></label>
                  <div class='layui-input-block'>
                    <span class='info'>${data.i9}</span>
                  </div>
                </div>
                <div class='layui-form-item'>
                  <label class='layui-form-label'><span>签到资料：</span></label>
                  <div class='layui-input-block'>
                    <a href="javascript:void(0)"  download href="${data.file}">${data.file}</a>
                  </div>
                </div>
              </div>
`
    }
  }

  const pt = new PageTemplate()
  ;(async () => {
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
    const data = {
      i1: 'S107关中环线智慧公交候车亭施工项目职工上岗安全教育',
      i2: 'A标段项目部会议室',
      i3: '项目部安全科',
      i4: '2021-12-15',
      i5: '王晶',
      i6: "2021-12-15",
      i7: "王李",
      i8: "王丽 李钱 周四 赵前进",
      i9: "请输入200字以内的描述培训内容描述，培训内容培训内容，培训内容培训内容培训内容培训内容，培训内容培训内容培训内容培训内容培训内容培训内容，培训内容培训内容培训内容培训内容培训内容培训内容，培训内容培训内容培训内容培训内容，培训内容培训内容培训内容培训内容，培训内容培训内容培训内容培训内容。",
      file: '签到资料.jpg'
    }
    $(".top.content-inner").html(pt.topTemplate(data))
    $(".bottom-form.content-inner").html(pt.bottomTemplate(data))
  }
})
