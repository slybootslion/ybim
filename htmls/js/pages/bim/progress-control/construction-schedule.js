layui.use(['LuCommonTemplate', 'LuUtilsTemplate', 'LuLayer', 'LuTreeTable', 'LuDrag'], function () {
  const $ = layui.$
  const laypage = layui.laypage
  const form = layui.form

  const LuInnerHeader = layui.LuInnerHeader
  const LuSearchForm = layui.LuSearchForm
  const LuTreeTable = layui.LuTreeTable
  const LuUpload = layui.LuUpload
  const LuLayer = layui.LuLayer
  const LuLightBox = layui.LuLightBox
  const LuDrag = layui.LuDrag

  class PageTemplate {
    renderLayerForm (data) {
      const uploadHtml = `<div class='content-body content-upload layui-form'>
                            <div class='upload-box'>
                              <div class='file-box' id='fileBox'></div>
                            </div>
                            <div class='upload-file-placeholder'></div>
                          </div>`

      return `
        <form class='layui-form layer-form layer-form-flex-colm team-add-form goods-form' action=''>
          <div class='add-account-box'>
            <div class='box-item'>
              <div class='layui-inline'>
                <label class='layui-form-label'>
                  <span>任务名称：</span>
                </label>
                <div class='layui-input-inline'>
                  <input type='text'
                         disabled 
                         class='layui-input' 
                         value='${data.f1}'>
                </div>
              </div>
              <div class='layui-inline'>
                <label class='layui-form-label'>
                  <span>本次完成量(m)：</span>
                </label>
                <div class='layui-input-inline'>
                  <input type='text'
                         name='f3'
                         class='layui-input'>
                </div>
              </div>
              <div class='layui-inline'>
                <label class='layui-form-label'>
                  <span>任务完成度：</span>
                </label>
                <div class='layui-input-inline'>
                  <input type='text'
                         disabled 
                         class='layui-input' 
                         value='${data.f5}'>
                </div>
              </div>
              <div class='layui-inline'>
                <label class='layui-form-label'>
                  <span>实际截止日期：</span>
                </label>
                <div class='layui-input-inline'>
                  <input type='text'
                         disabled 
                         class='layui-input' 
                         value='${data.f7}'>
                </div>
              </div>
              <div class='layui-inline'>
                <label class='layui-form-label'>
                  <span>进度图片：</span>
                </label>
                <div class='layui-input-inline'>
                  ${uploadHtml}
                </div>
              </div>
            </div>
            <div class='box-item'>
              <div class='layui-inline'>
                <label class='layui-form-label'>
                  <span>计划工程量(m)：</span>
                </label>
                <div class='layui-input-inline'>
                  <input type='text'
                         disabled 
                         class='layui-input' 
                         value='${data.f2}'>
                </div>
              </div>
              <div class='layui-inline'>
                <label class='layui-form-label'>
                  <span>累计完成量：</span>
                </label>
                <div class='layui-input-inline'>
                  <input type='text'
                         disabled 
                         class='layui-input' 
                         value='${data.f4}'>
                </div>
              </div>
              <div class='layui-inline'>
                <label class='layui-form-label'>
                  <span>实际开始时间：</span>
                </label>
                <div class='layui-input-inline'>
                  <input type='text' id='formDate1' name='f6' placeholder='请输入' autocomplete='off' class='layui-input'>
                </div>
              </div>
              <div class='layui-inline'>
                <label class='layui-form-label'>
                  <span>实际工日：</span>
                </label>
                <div class='layui-input-inline'>
                  <input type='text'
                         disabled 
                         class='layui-input' 
                         value='${data.f8}'>
                </div>
              </div>
              <div class='layui-inline'>
                <label class='layui-form-label'>
                  <span>情况说明：</span>
                </label>
                <div class='layui-input-inline'>
                  <textarea placeholder='情况说明' class='layui-textarea' />
                </div>
              </div>
            </div>
          </div>
          <div class='layui-layer-btn btn-box'>
            <button type='button' 
                    lay-submit 
                    lay-filter='submit' 
                    class='layui-btn'>
                    提交
            </button>
          </div>
        </form>
      `
    }

    renderLayerInfo (data) {
      const dictInfo = {
        i1: '任务名称',
        i2: '计划工程量(m)',
        i3: '计划开始时间',
        i4: '计划结束时间',
        i5: '负责人',
      }

      const dictL = {
        li2: '本次完成量(m)',
        li3: '累计完成量(m)',
        li4: '任务完成度',
        li5: '实际开始时间',
        li6: '实际工时',
        li7: '进度图片',
        li8: '情况说明',
      }

      let hTop = ''
      let h = ''
      Object.keys(dictInfo).forEach(key => {
        const item = dictInfo[key]
        hTop += `<div class='info-top-item'><span>${item}：</span><sapn>${data[key]}</sapn></div>`
      })
      const dictLKeys = Object.keys(dictL)
      if (data.l.length) {
        let i = 0,
          len = data.l.length
        for (; i < len; i++) {
          const lItem = data.l[i]
          let j = ''
          dictLKeys.forEach(key => {
            const item = dictL[key]
            if (item !== '进度图片') {
              j += `<div class='info-top-item'><span>${item}：</span><sapn>${lItem[key]}</sapn></div>`
            } else {
              let k = ''
              lItem[key].forEach(picUrl => k += `<img class='l-pic light-box' src="${picUrl}" alt="">`)
              j += `<div class='info-top-item'><div>${item}：</div>${k}</div>`
            }
          })
          h += `<div class='l-box-title'>${lItem.li1}</div>${j}`
        }
      }

      return `
        <div class='info-box'>
          ${hTop}
        </div>
        <div class='l-box'>
          ${h}
        </div>
      `
    }
  }

  const pt = new PageTemplate()

  let instanceTreeTable, luInnerHeader, currentLine, luLayer, luUpload, luInfoLayer, luLightBox
  ;(async () => {
    innerHeaderRender()
    searchFormRender()
    tableRender()
    luLightBox = new LuLightBox({ zIndex: 20210609 })
  })()

  function innerHeaderRender () {
    luInnerHeader = new LuInnerHeader({
      title: '施工进度',
      rightHtml: [
        { isIcon: true, icon: 'icon-moxingguanli' },
        { isIcon: true, icon: 'icon-sequencev' },
        { txt: '进度填报' },
      ],
    })
  }

  function searchFormRender () {
    new LuSearchForm(
      [
        { label: '计划名称', type: 'text', name: 's1' },
        { type: 'date-d' },
        { label: '标段', type: 'select', selectData: [], name: 's3' },
        { label: '任务状态', type: 'select', selectData: [], name: 's4' },
      ],
      {
        submit (data) {
          console.log(data)
        },
      },
    )
  }

  function getTreeTableOpts (page = 1, count = 10, noPageRender = false) {
    function getTreeTableReqData (callback) {
      return async (_, cb) => {
        // mock
        const {
          data, count: c
        } = await $.get(`/htmls/mock/bim/constructionScheduleTableData.json?page=${page}&count=${count}`)
        cb(data)
        callback && callback(c)
      }
    }

    const pageCb = noPageRender ? null : renderPage
    const reqData = getTreeTableReqData(pageCb)
// {{d.isBind ? "gray" : ""}}
    const ctrlHtml = `<span>
                        <a class="layui-btn layui-btn-xs {{!!d.isBind ? 'gray' : ''}}" 
                           style='float:left;' 
                           lay-event='bindModel'>{{d.isBind ? '取消关联' : '关联模型'}}</a>
                        {{d.pid !== -1 ? '<span class='table-event-span' lay-event='info'>进度填报记录</span>' : ''}}
                      </span>`

    const t10 = `<span><span class="jindu {{d.t10 === '进行中' ? 'green' : (d.t10 === '已完成' ? 'blue' : '')}}">{{d.t10}}</span></span>`

    const t1 = `<span><span class="{{d.isLate ? 'late' : ''}}">{{d.t1}} {{d.isLate ? '<span class='iconfont icon-yanchi'></span>' : ''}}</span></span>`

    return {
      elem: '.luTable',
      tree: {
        iconIndex: 0,
        isPidData: true,
      },
      cols: [
        $lulib.tableSetCenter(
          [
            { field: 't1', title: '任务名称', templet: t1, minWidth: 390 },
            { field: 't2', title: '任务完成度(%)', minWidth: 120 },
            { field: 't3', title: '计划工程量(m)', minWidth: 120 },
            { field: 't4', title: '累计完成量(m)', minWidth: 120 },
            { field: 't5', title: '计划开始', minWidth: 120 },
            { field: 't6', title: '计划结束', minWidth: 120 },
            { field: 't7', title: '实际开始', minWidth: 120 },
            { field: 't8', title: '实际截止', minWidth: 120 },
            { field: 't9', title: '实际工日(天)', minWidth: 120 },
            { field: 't10', title: '状态', templet: t10 },
            { field: 't11', title: '标段' },
            { title: '操作', toolbar: ctrlHtml, minWidth: 220 },
          ],
          {
            filter: [0],
          },
        ),
      ],
      reqData,
      done () {
        $("tr[data-indent='0']").addClass('root')
      },
    }
  }

  let luDrag = new LuDrag({
    dragClass: '.half-active',//拖拽盒子类名 (非必须)
    leftClass: '.ew-tree-table',//左边盒子类名 (非必须)
    rightClass: '.content-mod',//右边盒子类名 (非必须)
    resizeClass: '.resize',//拖拽按钮类名 (非必须)
  })

  function tableRender () {
    const opts = getTreeTableOpts()
    instanceTreeTable = LuTreeTable.render(opts)
  }

  function renderPage (count) {
    laypage.render({
      elem: document.querySelector('.page'),
      count,
      limit: 10,
      layout: ['prev', 'page', 'next', 'count'],
      jump (obj, first) {
        if (!first) {
          const opts = getTreeTableOpts(obj.curr, 10, true)
          instanceTreeTable.reload(opts)
        }
      },
    })
  }

  LuTreeTable.on('row(luTable)', obj => {
    currentLine = obj.data
    obj.tr.addClass('active').siblings('tr').removeClass('active')
  })

  LuTreeTable.on('tool(luTable)', obj => {
    const {
      data: { id },
      event,
    } = obj
    switch (event) {
      case 'bindModel':
        bindModelHandler(id)
        break
      case 'info':
        infoHandler(id)
        break
    }
  })

  $lulib.bindMethod([{ dom: luInnerHeader.rightBtns[0], method: add }])

  function add () {
    if (!currentLine) {
      layer.msg('未选择任务')
      return
    }
    const { t1, t3, t4, t2, t8, t9 } = currentLine
    const opts = {
      title: '进度填报',
      id: 'scheduleAddForm',
      area: ['860px', '520px'],
    }

    const data = { f1: t1, f2: t3, f4: t4, f5: t2, f7: t8, f8: t9 }
    opts.content = pt.renderLayerForm(data)
    luLayer = new LuLayer(opts)
    form.render()

    const uploadOpts = {
      el: '#fileBox',
      elFile: '.upload-file-placeholder',
      label: '上传图片',
      max: 20,
      limit: 10,
      accept: 'image/*',
      multiple: true,
      success (files) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          // mock
          setTimeout(() => luUpload.clearFin(file), $lulib.randomInt(10, 3) * 750)
        }
      },
    }

    luUpload = new LuUpload(uploadOpts)
  }

  function bindModelHandler (id) {
    $(".table-mod-content").addClass('half-active');

    // $lulib.pagePushHash(`bim/progress-control/bind-model?id=${id}`)
  }

  async function infoHandler (id) {
    const data = await $.get(`/htmls/mock/bim/constructionItemInfoData.json?id=${id}`)

    const opts = {
      title: '进度填报记录',
      id: 'scheduleAddInfo',
      area: ['860px', '520px'],
    }

    opts.content = pt.renderLayerInfo(data)
    luInfoLayer = new LuLayer(opts)
  }

  $lulib.methodProxy.bindMethodProxy([
    { dom: 'body', domStr: '.light-box', method: showLightBox },
  ])

  function showLightBox () {
    const $this = $(this)
    const current = $this.attr('src')
    const urlList = []
    $this
      .parents('.info-top-item')
      .find('.light-box')
      .each((_, item) => urlList.push(item.src))
    luLightBox.openLightBox(current, urlList)
  }

  form.on('submit(submit)', function (data) {
    luLayer.close()
  })
})
