layui.use(['LuCommonTemplate', 'LuUtilsTemplate'], function () {
  const $ = layui.$
  const form = layui.form

  const LuInnerHeader = layui.LuInnerHeader
  const LuUpload = layui.LuUpload

  let luInnerHeader, params, luUpload

  class PageTemplate {
    topTemplate (data) {
      return `<h3 class='top-header'>添加会议内容</h3>
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

    bottomTemplate () {
      return `
            <div class='content-head'>
              <span>培训内容</span>
            </div>
            <form class='layui-form layer-form layer-form-flex-colm team-add-form' action=''>
              <div class='content-body content-form'>
                <div class='layui-form-item'>
                  <label class='layui-form-label required'><span>记录人：</span></label>
                  <div class='layui-input-block'>
                    <input name='f1' 
                           placeholder='请输入' 
                           autocomplete='off'
                           lay-verify='required'
                           class='layui-input'>
                  </div>
                </div>
                <div class='layui-form-item'>
                  <label class='layui-form-label required'><span>参加人员：</span></label>
                  <div class='layui-input-block'>
                    <input name='f3' 
                           placeholder='请输入'
                           lay-verify='required' 
                           autocomplete='off'
                           class='layui-input'>
                  </div>
                </div>
                <div class="layui-form-item">
                  <label class='layui-form-label required'><span>会议内容：</span></label>
                  <div class='layui-input-block'>
                    <textarea name='f4'
                              lay-verify='required'
                              placeholder='请输入200字以内的描述'
                              class='layui-textarea'></textarea>
                  </div>
                </div>
                <div class='layui-form-item'>
                  <label class='layui-form-label required'><span>签到资料：</span></label>
                  <div class='add-records-upload-box'>
                    <div class='file-box' id='fileBox'></div>
                    <div class='upload-file-placeholder'></div>
                  </div>
                </div>
              </div>
              <div class='btn-content'>
                <button lay-submit
                        lay-filter='submit'
                        class='layui-btn submit'>
                        提交
                </button>
              </div>
            </form>
`
    }
  }

  const pt = new PageTemplate()
  !(async () => {
    initParams()
    luInnerHeader = new LuInnerHeader({
      title: '安全会议',
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
    $(".top.content-inner").html(pt.topTemplate(data))
    $(".bottom-form.content-inner").html(pt.bottomTemplate())

    const opts = {
      el: '#fileBox',
      elFile: '.upload-file-placeholder',
      label: '上传',
      limit: 1,
      success (files) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          // mock
          setTimeout(() => luUpload.clearFin(file), $lulib.randomInt(10, 3) * 750)
        }
      },
    }
    luUpload = new LuUpload(opts)
  }

  form.on('submit(submit)', function (data) {
    if (luUpload.files.length < 1) {
      layer.msg('文件未上传')
      return false
    }
    return false
  })
})
