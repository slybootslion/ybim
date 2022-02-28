layui.use(['LuCommonTemplate', 'LuLayer'], function () {
  const $ = layui.$
  const form = layui.form
  const laydate = layui.laydate

  const LuInnerHeader = layui.LuInnerHeader
  const LuLayer = layui.LuLayer
  const luUtilsTemplate = layui.LuUtilsTemplate
  const LuUpload = layui.LuUpload

  class PageTemplate {
    list (data) {
      let h = ''
      for (let i = 0; i < data.length; i++) {
        const item = data[i]
        h += `<div class="project-item">
        <div class="left">
          <img src="${item.i10}" alt="" class="pic">
          <button class='layui-btn inProject'>进入项目</button>
        </div>
        <div class="right">
          <div class="title">
            <h3 class="txt">${item.i1}</h3>
            <div class="btn-box">
            <span class="edit btn" data-id="${item.id}">
              <span class="iconfont icon-bianji"></span>
              <span>编辑</span>
            </span>
            <span class="del btn" data-id="${item.id}">
              <span class="iconfont icon-shanchu1"></span>
              <span>删除</span>
            </span>
            </div>
          </div>
          <div class="info-box">
            <div class="info-item">
              <span class="label">类型：</span>
              <span>${item.i3}</span>
            </div>
            <div class="info-item">
              <span class="label">负责人：</span>
              <span>${item.i4}</span>
            </div>
            <div class="info-item">
              <span class="label">业主：</span>
              <span>${item.i5}</span>
            </div>
            <div class="info-item">
              <span class="label">设计：</span>
              <span>${item.i6}</span>
            </div>
            <div class="info-item">
              <span class="label">施工：</span>
              <span>${item.i7}</span>
            </div>
            <div class="info-item">
              <span class="label">监理：</span>
              <span>${item.i8}</span>
            </div>
            <div class="info-item">
              <span class="label">时间：</span>
              <span>${item.i2}至${item.i11}</span>
            </div>
          </div>
          <div class="desc-box">
            <span class="label">项目描述：</span>
            <span>${item.i9}</span>
          </div>
        </div>
      </div>`
      }
      return h
    }

    form (selData, editData) {
      const { sel1, sel2, sel3, sel4, sel5, sel6 } = selData
      let data = { i1: '', i2: '', i3: '', i4: '', i5: '', i6: '', i7: '', i8: '', i9: '', i10: '', i11: '' }
      if (editData.id) data = { ...editData }
      const s1 = luUtilsTemplate.renderSelectOptions(sel1, data.i3)
      const s2 = luUtilsTemplate.renderSelectOptions(sel3, data.i6)
      const s3 = luUtilsTemplate.renderSelectOptions(sel2, data.i5)
      const s4 = luUtilsTemplate.renderSelectOptions(sel4, data.i7)
      const s5 = luUtilsTemplate.renderSelectOptions(sel5, data.i8)

      const uploadHtml = `<div class='content-body content-upload layui-form'>
                            <div class='upload-box'>
                              <div class='file-box' id='fileBox'></div>
                            </div>
                            <div class='upload-file-placeholder'></div>
                          </div>`

      return `
        <form class='layui-form layer-form layer-form-flex-colm team-add-form goods-form' action='' lay-filter='create'>
          <div class="add-account-box">
            <div class="box-item">
              <div class='layui-inline'>
                <label class='layui-form-label required'>
                  <span>项目名称：</span>
                </label>
                <div class='layui-input-inline'>
                  <input type='text'
                         name="i1"
                         lay-verify='required'
                         placeholder='请输入'
                         autocomplete='off'
                         class='layui-input'
                         value='${data.i1}'>
                </div>
              </div>
              <div class='layui-inline'>
                <label class='layui-form-label required'>
                  <span>负责人：</span>
                </label>
                <div class='layui-input-inline'>
                  <input type='text'
                         name="i4"
                         lay-verify='required'
                         placeholder='请输入'
                         autocomplete='off'
                         class='layui-input'
                         value='${data.i4}'>
                </div>
              </div>
              <div class='layui-inline'>
                <label class='layui-form-label required'>
                  <span>完工时间：</span>
                </label>
                <div class='layui-input-inline'>
                  <input type='text'
                         lay-verify='required' 
                         id='formDate2' 
                         name='t6' 
                         placeholder='请选择' 
                         autocomplete='off' 
                         class='layui-input' 
                         value='${data.i11}'>
                </div>
              </div>
              <div class='layui-inline'>
                <label class='layui-form-label '>
                  <span>总包单位：</span>
                </label>
                <div class='layui-input-inline'>
                  <select name='i12'>
                    <option value=''>请选择</option>
                  </select>
                </div>
              </div>
              <div class='layui-inline'>
                <label class='layui-form-label required'>
                  <span>施工单位：</span>
                </label>
                <div class='layui-input-inline'>
                  <select name='i6' lay-verify='required'>
                    ${s4}
                  </select>
                </div>
              </div>
              <div class='layui-inline'>
                <label class='layui-form-label required'>
                  <span>项目图片：</span>
                </label>
                <div class='layui-input-inline'>
                  ${uploadHtml}
                </div>
              </div>
            </div>
            <div class="box-item">
              <div class='layui-inline'>
                <label class='layui-form-label required'>
                  <span>项目类别：</span>
                </label>
                <div class='layui-input-inline'>
                  <select name='i3' lay-verify='required'>
                    ${s1}
                  </select>
                </div>
              </div>
              <div class='layui-inline'>
                <label class='layui-form-label required'>
                  <span>开工时间：</span>
                </label>
                <div class='layui-input-inline'>
                  <input type='text'
                         lay-verify='required' 
                         id='formDate1' 
                         name='i2' 
                         placeholder='请选择' 
                         autocomplete='off' 
                         class='layui-input' 
                         value='${data.i2}'>
                </div>
              </div>
              <div class='layui-inline'>
                <label class='layui-form-label required'>
                  <span>业主单位：</span>
                </label>
                <div class='layui-input-inline'>
                  <select name='i3' lay-verify='required'>
                    ${s3}
                  </select>
                </div>
              </div>
              <div class='layui-inline'>
                <label class='layui-form-label required'>
                  <span>设计单位：</span>
                </label>
                <div class='layui-input-inline'>
                  <select name='i6' lay-verify='required'>
                    ${s2}
                  </select>
                </div>
              </div>
              <div class='layui-inline'>
                <label class='layui-form-label required'>
                  <span>监理单位：</span>
                </label>
                <div class='layui-input-inline'>
                  <select name='i8' lay-verify='required'>
                    ${s5}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="layui-form-item" style="padding: 0 30px;">
            <label class="layui-form-label required">
              <span>项目介绍：</span>
            </label>
            <div class="layui-input-block">
            <textarea placeholder="请输入200字以内的项目介绍"
                      maxlength='200'
                      name="i9"
                      class="layui-textarea" lay-verify='required'>${data.i9}</textarea>
            </div>
          </div>
          <div class='layui-layer-btn btn-box'>
            <button type='button' lay-submit lay-filter='submit' class='layui-btn layui-layer-btn0'>确定添加</button>
          </div>
        </form>
      `
    }
  }

  let luInnerHeader, luLayer, luUpload, listData
  ;(async () => {
    renderInnerHeader()
    await renderList()
  })()

  function renderInnerHeader () {
    luInnerHeader = new LuInnerHeader({
      title: '项目管理',
      rightHtml: [{ txt: '新建项目' }],
    })
  }

  const pt = new PageTemplate

  async function renderList () {
    listData = await $lulib.getMockData('/htmls/mock/bim/projectListData.json', 1, '', false)
    handleList(listData)
    const pcEle = $("#projectContainer")
    pcEle.on('click', '.edit.btn', async function () {
      const id = $(this).data().id
      const data = listData.find(item => item.id === id)
      await formMethod(data)
    })
    pcEle.on('click', '.del.btn', function () {
      LuLayer.confirm('确定删除？', () => {
        const id = $(this).data().id
        listData = listData.filter(item => item.id !== id)
        handleList(listData)
      })
    })
    pcEle.on('click', '.inProject', function () {
      $lulib.pagePushHash('bim/ctrl/index')
    })
  }

  const handleList = listData => {
    const h = pt.list(listData)
    $("#projectContainer").html(h)
  }

  $lulib.bindMethod([{ dom: luInnerHeader.rightBtns[0], method: formMethod }])

  async function formMethod (editData) {
    const { sel1, sel2, sel3, sel4, sel5, sel6 } = await new Promise(resolve => {
      resolve({
        sel1: [{ id: 1, title: '大中修工程' }],
        sel2: [{ id: 1, title: '中交第一公路工程局有限公司' }],
        sel3: [{ id: 1, title: '中交柏嘉工程技术研究院有限公司' }],
        sel4: [{ id: 1, title: '陕西三秦路桥有限公司' }],
        sel5: [{ id: 1, title: '监理单位' }],
        sel6: [{ id: 1, title: '总包单位' }]
      })
    })
    const selData = { sel1, sel2, sel3, sel4, sel5, sel6 }
    const content = pt.form(selData, editData)
    let isEdit = true
    const options = {
      title: '修改项目',
      id: 'renderProjectForm',
      area: ['860px', '600px'],
      content
    }
    if (editData instanceof MouseEvent) {
      isEdit = false
      options.title = '新建项目'
    }
    luLayer = new LuLayer(options)
    form.render()
    laydate.render({
      elem: '#formDate1',
      theme: '#007fff',
    })
    laydate.render({
      elem: '#formDate2',
      theme: '#007fff',
    })
    const uploadOpts = {
      el: '#fileBox',
      elFile: '.upload-file-placeholder',
      label: '点击上传',
      max: 1,
      multiple: true,
      accept: 'image/*',
      success (files) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          // mock
          setTimeout(() => luUpload.clearFin(file), $lulib.randomInt(10, 3) * 750)
        }
      },
    }
    luUpload = new LuUpload(uploadOpts)
    isEdit && luUpload.renderFileList([{ name: '2519.jpg_wh860.jpg' }], true)
  }

  form.on('submit(submit)', function (data) {
    luLayer.close()
  })

})
