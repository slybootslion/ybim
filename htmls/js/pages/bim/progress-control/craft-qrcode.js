layui.use(['LuCommonTemplate'], function () {
  const $ = layui.$

  const LuInnerHeader = layui.LuInnerHeader
  const LuUpload = layui.LuUpload

  class PageTemplate {
    asyncRenderContent(data) {
      return `
        <div class='left border-top'>
          <div class='table-list border-bottom'>
            <div class='table-item border-left w15'>
              <span class='table-title star'>工艺名称：</span>
            </div>
            <div class='table-item border-rightleft w85'>
              <input class='table-input' value='${data.f3 || ''}' type='text' placeholder='请输入工艺名称'>
            </div>
          </div>
          <div class='table-list border-bottom'>
            <div class='table-item border-left w15'>
              <span class='table-title star'>所属部位：</span>
            </div>
            <div class='table-item border-rightleft w85'>
              <input class='table-input' value='${data.f4 || ''}' type='text' placeholder='请输入部位'>
            </div>
          </div>
          <div class='table-list border-bottom'>
            <div class='table-item border-left w15'>
              <span class='table-title'>施工单位：</span>
            </div>
            <div class='table-item border-rightleft w85'>
              <input class='table-input disabled' type='text' value='${data.f1}' disabled>
            </div>
          </div>
          <div class='table-list border-bottom'>
            <div class='table-item border-left w15'>
              <span class='table-title'>所属标段：</span>
            </div>
            <div class='table-item border-rightleft w85'>
              <input class='table-input disabled' type='text' value='${data.f2}' disabled>
            </div>
          </div>
          <div class='table-list border-bottom'>
            <div class='table-item border-left w15'>
              <span class='table-title'>工艺图片：</span>
            </div>
            <div class='table-item border-rightleft w85'>
              <div class='upload-box'>
                <div class='file-box' id='fileBox'></div>
              </div>
              <div class='upload-file-placeholder'></div>
            </div>
          </div>
          <div class='table-list border-bottom'>
            <div class='table-item border-left w15'>
              <span class='table-title'>工艺说明：</span>
            </div>
            <div class='table-item border-rightleft w85'>
              <textarea class='layui-textarea h360' maxlength='2000' placeholder='请输入施工工艺，2000字以内'>${
                data.f5 || ''
              }</textarea>
            </div>
          </div>
          <div class='table-list border-bottom'>
            <div class='table-item border-rightleft w100 h70px'>
              <button class='layui-btn'>生成二维码</button>
            </div>
          </div>
        </div>
        <div class='right'>
          <h2 class='title'>二维码</h2>
          <img class='pic' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9HSMFcO7nViL3Y6NZLAMhdXCPwn2CLadPj1q3inIHgRrPj_5BtuWYwR_Tn2xvD7cGcXA' alt=''>
          <a class='link' href='javascript:void(0)'>下载二维码</a>
        </div>
      `
    }
  }

  const pt = new PageTemplate()

  let luInnerHeader, luUpload
  ;(async () => {
    innerHeaderRender()
    await renderContent()
  })()

  function innerHeaderRender() {
    luInnerHeader = new LuInnerHeader({
      title: '施工二维码',
      rightHtml: [{ txt: '返回', isWeaken: true }],
    })
  }

  async function renderContent() {
    const params = $lulib.getHashParams()
    const editId = params.id

    // mock
    const data = {
      f1: '陕西三秦路桥有限公司',
      f2: 'A标段',
    }

    if (editId) {
      // mock
      const res = (await $.get('/htmls/mock/bim/construcitonTableData.json')).info2
      data.f3 = res.i1
      data.f4 = res.i2
      data.f5 = res.i5
      data.image = res.image
    }

    const html = pt.asyncRenderContent(data)
    $('#formGYHover').html(html)

    const opts = {
      el: '#fileBox',
      elFile: '.upload-file-placeholder',
      multiple: true,
      max: 20,
      limit: 10,
      accept: 'image/gif,image/jpg,image/jpeg,image/png',
      label: '上传图片',
      type: 'picture',
      desc: '支持jpg、jpeg、png格式，每张照片大小不超过10M，最多上传20张',
      success(files) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          // mock
          setTimeout(() => luUpload.clearFin(file), $lulib.randomInt(10, 3) * 750)
        }
      },
    }
    luUpload = new LuUpload(opts)
    if (editId) {
      const pics = data.image.map(src => ({ name: `${$lulib.randomStr(9)}.jpg`, src }))
      luUpload.renderFileList([...pics], true)
    }
  }

  $lulib.bindMethod([{ dom: luInnerHeader.rightBtns[0], method: () => $lulib.pageGoBack() }])
})
