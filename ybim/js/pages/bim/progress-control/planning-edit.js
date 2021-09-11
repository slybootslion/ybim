layui.use(['LuCommonTemplate', 'LuUtilsTemplate', 'LuLayer', 'LuTreeTable'], function () {
  const $ = layui.$
  const laypage = layui.laypage
  const form = layui.form
  const laydate = layui.laydate

  const LuInnerHeader = layui.LuInnerHeader
  const LuSearchForm = layui.LuSearchForm
  const LuTreeTable = layui.LuTreeTable
  const LuLayer = layui.LuLayer
  const LuUtilsTemplate = layui.LuUtilsTemplate

  class PageTemplate {
    renderForm(data) {
      const sel = data.sel
      let hSel = ''
      !data.id
        ? (hSel = LuUtilsTemplate.renderSelectOptions(sel, '', 'key', 'value'))
        : (hSel = this.renderOptionsSelected(sel, data.t1))
      data = {
        t1: '',
        t2: '',
        t3: '',
        t4: '',
        t5: '',
        t6: '',
        t7: '',
        t8: '',
        t9: '',
        t10: '',
        t11: '',
        t12: '',
        t13: '',
        ...data,
      }
      return `
        <form class='layui-form layer-form layer-form-flex-colm team-add-form goods-form' action=''>
          <div class='add-account-box'>
            <div class='box-item'>
              <div class='layui-inline'>
                <label class='layui-form-label required'>
                  <span>计划层级：</span>
                </label>
                <div class='layui-input-inline'>
                  <select lay-verify='required' lay-filter='selectType'>
                    ${hSel}
                  </select>
                </div>
              </div>
              <div class='layui-inline'>
                <label class='layui-form-label required'>
                  <span>计划开始时间：</span>
                </label>
                <div class='layui-input-inline'>
                  <input type='text'
                         name='f3'
                         lay-verify='required' 
                         id='dateItem1'
                         value='${data.t5}'
                         class='layui-input'>
                </div>
              </div>
              <div class='layui-inline'>
                <label class='layui-form-label required'>
                  <span>计划工期：</span>
                </label>
                <div class='layui-input-inline required'>
                  <input type='text'
                         disabled
                         value='${data.t13}'
                         lay-verify='required'
                         class='layui-input planDay'>
                </div>
              </div>
              <div class='layui-inline'>
                <label class='layui-form-label'>
                  <span>标段：</span>
                </label>
                <div class='layui-input-inline'>
                  <input type='text'
                         disabled
                         value='${data.t11}'
                         class='layui-input' 
                         value=''>
                </div>
              </div>
              <div class='layui-inline'>
                <label class='layui-form-label required'>
                  <span>负责人：</span>
                </label>
                <div class='layui-input-inline required'>
                  <input type='text'
                         value='${data.t12}'
                         lay-verify='required'  
                         class='layui-input'>
                </div>
              </div>
            </div>
            <div class='box-item'>
              <div class='layui-inline'>
                <label class='layui-form-label required'>
                  <span>计划名称：</span>
                </label>
                <div class='layui-input-inline'>
                  <input type='text'
                         value='${data.t1}'
                         lay-verify='required'
                         id='testInput'
                         class='layui-input'>
                </div>
              </div>
              <div class='layui-inline'>
                <label class='layui-form-label required'>
                  <span>计划截止时间：</span>
                </label>
                <div class='layui-input-inline'>
                  <input type='text'
                         value='${data.t6}'
                         lay-verify='required' 
                         id='dateItem2'
                         class='layui-input'>
                </div>
              </div>
              <div class='layui-inline'>
                <label class='layui-form-label'>
                  <span>施工单位：</span>
                </label>
                <div class='layui-input-inline'>
                  <input type='text' disabled class='layui-input'>
                </div>
              </div>
              <div class='layui-inline'>
                <label class='layui-form-label'>
                  <span>备注：</span>
                </label>
                <div class='layui-input-inline'>
                  <textarea placeholder='输入备注' 
                            class='layui-textarea'></textarea>
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

    renderOptionsSelected(sel, inStr) {
      let html = "<option value=''>请选择</option>"
      let i = 0
      for (; i < sel.length; i++) {
        const item = sel[i]
        if (item.key.includes(inStr)) {
          html += `<option selected
                           value='${item.value}'>${item.key}</option>`
          break
        }
        html += `<option value='${item.value}'>${item.key}</option>`
      }
      if (i === sel.length - 1) return html
      let j = i + 1
      const len = sel.length
      for (; j < len; j++) {
        const item = sel[j]
        html += `<option value='${item.value}'>${item.key}</option>`
      }
      return html
    }
  }

  const pt = new PageTemplate()

  let instanceTreeTable,
    luInnerHeader,
    luLayer,
    formDate = { d1: '', d2: '' }
  ;(() => {
    innerHeaderRender()
    searchFormRender()
    tableRender()
  })()

  function innerHeaderRender() {
    luInnerHeader = new LuInnerHeader({
      title: '计划编制',
      rightHtml: [{ txt: '计划编制' }],
    })
  }

  function searchFormRender() {
    new LuSearchForm([
      { label: '计划名称', type: 'text', name: 's1' },
      { label: '选择时间', type: 'date-s', name: 's2' },
      { label: '标段', type: 'select', selectData: [], name: 's3' },
    ])
  }

  function renderPage(count) {
    laypage.render({
      elem: document.querySelector('.page'),
      count,
      limit: 10,
      layout: ['prev', 'page', 'next', 'count'],
      jump(obj, first) {
        if (!first) {
          const opts = getTreeTableOpts(obj.curr, 10, true)
          instanceTreeTable.reload(opts)
        }
      },
    })
  }

  function getTreeTableOpts(page = 1, count = 10, noPageRender = false) {
    function getTreeTableReqData(callback) {
      return async (_, cb) => {
        // mock
        const { data, count: c } = await $.get(`/htmls/mock/bim/constructionScheduleTableData.json?page=${page}&count=${count}`)
        cb(data)
        callback && callback(c)
      }
    }

    const pageCb = noPageRender ? null : renderPage
    const reqData = getTreeTableReqData(pageCb)

    const ctrlHtml = `<span>
                        <span class='table-event-span' lay-event='edit'>变更</span>
                        <span class='table-event-span' lay-event='del'>删除</span>
                      </span>`

    const t1 = `<span>{{d.t1}}</span>`

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
            { field: 't5', title: '计划开始', minWidth: 120 },
            { field: 't6', title: '计划结束', minWidth: 120 },
            { field: 't13', title: '计划工期(天)', minWidth: 120 },
            { field: 't12', title: '负责人' },
            { field: 't11', title: '标段' },
            { title: '操作', toolbar: ctrlHtml, minWidth: 220 },
          ],
          {
            filter: [0],
          },
        ),
      ],
      reqData,
      done() {
        $("tr[data-indent='0']").addClass('root')
      },
    }
  }

  LuTreeTable.on('tool(luTable)', obj => {
    const { data, event } = obj
    switch (event) {
      case 'edit':
        editHandler(data)
        break
      case 'del':
        delHandler(obj)
        break
    }
  })

  function editHandler(data) {
    const opts = getLayOpts(data)
    luLayer = new LuLayer(opts)
    form.render()
    renderDateInput()
  }

  function delHandler(obj) {
    LuLayer.confirm('确定删除？', () => obj.del())
  }

  function tableRender() {
    const opts = getTreeTableOpts()
    instanceTreeTable = LuTreeTable.render(opts)
  }

  $lulib.bindMethod([{ dom: luInnerHeader.rightBtns[0], method: add }])

  function getLayOpts(editData) {
    const opts = {
      title: '进度填报',
      id: 'planningAddForm',
      area: ['860px', '520px'],
    }

    let data = {}
    if (editData) data = { ...editData }
    // mock
    data.sel = [
      { value: 1, key: '路基工程' },
      { value: 2, key: '路基工程/K114+900至K115+400试验段旧路破除及铣刨' },
      { value: 3, key: '路面工程' },
      { value: 4, key: '路面工程/K114+900至K115+400试验段垫层' },
    ]
    opts.content = pt.renderForm(data)
    return opts
  }

  async function add() {
    const option = getLayOpts()
    luLayer = new LuLayer(option)
    form.render()
    renderDateInput()
  }

  function renderDateInput() {
    const dateItem = ['dateItem1', 'dateItem2']
    $.each(dateItem, (_, item) => {
      let fn = dateFn2
      if (item === 'dateItem1') fn = dateFn1
      laydate.render({
        elem: `#${item}`,
        theme: '#007fff',
        done: fn,
      })
    })
  }

  function dateFn1(value) {
    formDate.d1 = value
    computedPlanDay()
  }

  function dateFn2(value) {
    formDate.d2 = value
    computedPlanDay()
  }

  function computedPlanDay() {
    const { d1, d2 } = formDate
    if (!d1 || !d2) return
    const pDayDom = $('.planDay')
    const diff = $lulib.dayjs(d2).diff($lulib.dayjs(d1), 'day')
    if (diff <= 0) {
      layer.msg('日期选择有误')
      pDayDom.val('')
      return
    }
    pDayDom.val(diff)
  }

  form.on('submit(submit)', function (data) {
    luLayer.close()
  })

  form.on('select(selectType)', function (data) {
    console.log(data.elem) //得到select原始DOM对象
    console.log(data.value) //得到被选中的值
    console.log(data.othis) //得到美化后的DOM对象
    console.log($(data.othis).find('.layui-this').html())
  })

  $lulib.methodProxy.bindMethodProxy([
    { dom: 'body', domStr: '#testInput', method: testInput, evStr: 'keyup' }
  ])

  function testInput() {
    console.log(this)
  }
})
