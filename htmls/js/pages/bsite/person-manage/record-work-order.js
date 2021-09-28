layui.use(['LuCommonTemplate', 'LuLayer'], function () {
  const $ = layui.$
  const util = layui.util
  const form = layui.form
  const laydate = layui.laydate

  const LuInnerHeader = layui.LuInnerHeader
  const LuSearchForm = layui.LuSearchForm
  const LuTable = layui.LuTable
  const LuLayer = layui.LuLayer

  class PageTemplate {
    renderForm (editData) {
      let data = {
        recordName: '',
        company: '',
        endDate: '',
        attCount: '',
        date: '',
        companies: editData.companies,
      }
      if (editData.id) {
        data = { ...editData }
      }
      let companyHtml = '<option value="">请选择</option>'
      if (data) {
        const { companies } = data
        for (let i = 0; i < companies.length; i++) {
          let selected = ''
          if (data.company) selected = ' selected'
          companyHtml += `<option${selected}
                            value='${companies[i][0]}'>${companies[i]}</option>`
        }
      }
      const dateNow = util.toDateString(new Date(), 'yyyy-MM-dd')
      return `
        <form class='layui-form layer-form layer-form-flex-colm team-add-form' action='' lay-filter='add'>
          <div class='layui-inline'>
            <label class='layui-form-label required'>
              <span>记工单名称：</span>
            </label>
            <div class='layui-input-inline'>
              <input type='text' 
                     name='recordName' 
                     lay-verify='required'
                     value='${data.recordName}'
                     placeholder='请输入' 
                     autocomplete='off' 
                     class='layui-input'>
            </div>
          </div>
          <div class='layui-inline'>
            <label class='layui-form-label required'>
              <span>所属参建公司：</span>
            </label>
            <div class='layui-input-inline'>
              <select name='company' lay-verify='required'>
                ${companyHtml}
              </select>
            </div>
          </div>
          <div class='layui-inline'>
            <label class='layui-form-label required'>
              <span>截止时间：</span>
            </label>
            <div class='layui-input-inline'>
              <input type='text' name='endDate' lay-verify='required' placeholder='请输入' autocomplete='off' class='layui-input' value='${data.endDate}'>
            </div>
          </div>
          <div class='layui-inline'>
            <label class='layui-form-label required'>
              <span>备注：</span>
            </label>
            <div class='layui-input-inline'>
              <textarea name='attCount' maxlength='100' placeholder='请输入内容' class='layui-textarea'></textarea>
            </div>
          </div>
          <div class='layui-inline'>
            <label class='layui-form-label'>截止时间：</label>
            <div class='layui-input-inline'>
              <input type='text'
                   name='date'
                   disabled
                   autocomplete='off'
                   class='layui-input disabled'
                   placeholder='${dateNow}'>
            </div>
          </div>
          <div class='content-table'>
            <div class='content-table innerTable'></div>
          </div>
          <div class='layui-layer-btn btn-box'>
              <button type='button' lay-submit lay-filter='submit' class='layui-btn layui-layer-btn0'>保存</button>
            </div>
        </form>
      `
    }

    renderRecordWorkOrderFormInner (data) {
      return `
        <div class="table-box">
          <div class="top">
            <div class="top-item">姓名：${data.t1}</div>
            <div class="top-item">所属班组：${data.team}</div>
          </div>
          <div class="content-table">
            <table class="layui-table" lay-size="sm">
              <colgroup><col><col><col><col><col></colgroup>
              <thead>
                <tr>
                  <th>工日</th>
                  <th>工价（元/工）</th>
                  <th>嘉奖</th>
                  <th>扣款</th>
                  <th>记工工资（元）</th>
                </tr> 
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input id="countSum1" type="number" data-lu-method-input="calculatePay" class="layui-input" placeholder="请输入">
                  </td>
                  <td>
                    <input id="countSum2" type="number" data-lu-method-input="calculatePay" class="layui-input" placeholder="请输入">
                  </td>
                  <td>
                    <input id="countSum3" type="number" data-lu-method-input="calculatePay" class="layui-input" placeholder="请输入">
                  </td>
                  <td>
                    <input id="countSum4" type="number" data-lu-method-input="calculatePay" class="layui-input" placeholder="请输入">
                  </td>
                  <td>
                    <input disabled emp_id={{d.emp_id}} id="countSum" value="${data.money}" class="layui-input disabled" placeholder="请输入">
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="layui-layer-btn btn-box">
          <button type="button" class="layui-btn layui-layer-btn0 inner-btn">确定</button>
        </div>
      `
    }
  }

  const pt = new PageTemplate()

  let luInnerHeader, luTable, innerLuTable, luLayer, luLayerInner
  !(async () => {
    initInnerHeader()
    searchFormRender()
    await tableRender()
  })()

  function initInnerHeader () {
    luInnerHeader = new LuInnerHeader({
      title: '记工单',
      rightHtml: [{ txt: '新建' }],
    })
  }

  function searchFormRender () {
    const selectData = [
      { value: 1, key: '一月' },
      { value: 2, key: '二月' },
      { value: 3, key: '三月' },
      { value: 4, key: '四月' },
      { value: 5, key: '五月' },
      { value: 6, key: '六月' },
      { value: 7, key: '七月' },
      { value: 8, key: '八月' },
      { value: 9, key: '九月' },
      { value: 10, key: '十月' },
      { value: 11, key: '十一月' },
      { value: 12, key: '十二月' },
    ]
    const selectData2 = [
      { value: 1, key: '参建公司1' },
      { value: 2, key: '哇哈哈营养快线参建公司' },
      { value: 3, key: '陕西三秦路桥有限责任公司' },
    ]
    new LuSearchForm(
      [
        { label: '参建公司', type: 'select', selectData: selectData2, name: 's1' },
        { label: '记工单截止月份', type: 'select', selectData, name: 's2' },
        { label: '填单日期', type: 'date-s', name: 's3' },
      ],
      {
        submit (data) {
          console.log(data)
        },
      },
    )
  }

  async function tableRender () {
    const data = await $lulib.getMockData('/htmls/mock/bsite/recordWorkOrderData.json', 12, '', false)
    const html = `<span>
                    <a href='javascript:void(0)' class='table-tool-link' lay-event='edit'>
                      <span class='iconfont icon-bianji'></span>
                      <span>编辑</span>
                    </a>
                    {{d.t1 === 'admin' ? '' : '<a href='javascript:void(0)' class='table-tool-link' lay-event='del'>
                      <span class='iconfont icon-shanchu1'></span>
                      <span>删除</span>
                    </a>
                    <a href='javascript:void(0)' class='table-tool-link' lay-event='info'>
                      <span>查看详情</span>
                    </a>'}}
                  </span>`
    const opts = {
      cols: [
        $lulib.tableSetCenter([
          { field: 'id', title: '序号', width: 60 },
          { field: 'recordName', title: '记工单名称', minWidth: 190, align: 'center' },
          { field: 'company', title: '所属参建公司', minWidth: 220, align: 'center' },
          { field: 'endDate', title: '截止日期', width: 120, align: 'center' },
          { field: 'attCount', title: '工人人数', width: 120, align: 'center' },
          { field: 'money', title: '应付款（元）', minWidth: 190, align: 'center' },
          { field: 'date', title: '日期', width: 120, align: 'center' },
        ]),
      ],
      ctrlData: [
        { eventStr: 'edit', iconStr: 'icon-bianji', txtStr: '编辑' },
        { eventStr: 'del', iconStr: 'icon-shanchu1', txtStr: '删除' },
        { eventStr: 'info', iconStr: 'icon-chakanxiangqing', txtStr: '查看详情' },
      ],
      methods: {
        edit,
        del,
        info,
      },
    }
    luTable = new LuTable(data, opts)
  }

  async function edit (data) {
    await formMethod(data)
  }

  function del (_, obj) {
    LuLayer.confirm('确定删除？', () => obj.del())
  }

  function info (data) {
    $lulib.pagePushHash('bim/person-manage/record-work-order-issue', { id: data.id })
  }

  $lulib.bindMethod([{ dom: luInnerHeader.rightBtns[0], method: formMethod }])

  async function formMethod (editData) {
    // mock
    const data = {
      companies: ['参建公司1', '哇哈哈营养快线参建公司', '陕西三秦路桥有限责任公司'],
      ...editData,
    }
    const content = pt.renderForm(data)
    const opts = {
      title: '新建记工单',
      id: 'renderRecordWorkOrderForm',
      area: ['778px', '708px'],
      content,
    }
    if (editData instanceof MouseEvent) opts.title = '修改记工单'
    luLayer = new LuLayer(opts)
    form.render()
    laydate.render({
      elem: '#dateEndInput',
      theme: '#007fff',
    })
    // mock
    const innerData = await $lulib.getMockData('/htmls/mock/bsite/recordWorkOrderInnerData.json', 6, '', false)
    const options = {
      id: 'tbInner',
      elem: '#tbInner',
      el: $('.innerTable'),
      limit: 4,
      filter: 'tbInner',
      hideHeadCheck: true,
      methods: {
        moneyInput,
      },
      cols: [
        $lulib.tableSetCenter([
          { type: 'checkbox', width: 41 },
          { type: 'numbers', title: '序号', width: 50 },
          { field: 't1', title: '姓名', width: 100 },
          { field: 'team', title: '班组名称', width: 132 },
          { field: 'time', title: '记工时间段', width: 210 },
          {
            title: '记工工资（元）',
            templet: d => `<span><a class='money-input' lay-event='moneyInput'>${d.money}</a></span>`,
            width: 180,
          },
        ]),
      ],
    }
    innerLuTable = new LuTable(innerData, options)
    innerLuTable.tableOn()
  }

  function moneyInput (data, obj) {
    const content = pt.renderRecordWorkOrderFormInner(data)
    const opts = {
      title: '填写工日工时',
      id: 'renderRecordWorkOrderFormInner',
      area: ['778px', '230px'],
      content,
    }
    luLayerInner = new LuLayer(opts)
  }

  $lulib.methodProxy.bindMethodProxy([
    {
      dom: 'body',
      evStr: 'input',
      domStr: '[data-lu-method-input]',
      method: calculatePay,
    },
    {
      dom: 'body',
      domStr: '.inner-btn',
      method: closeInnerLayer,
    },
  ])

  function closeInnerLayer () {
    luLayerInner.close()
  }

  function calculatePay () {
    const sumArr = $('[data-lu-method-input]').map((idx, ele) => (ele.value ? +ele.value : 0))
    const s = Array.from(sumArr)
    const sum = s[0] * s[1] + s[2] - s[3]
    $('#countSum').val(sum)
  }

  form.on('submit(submit)', function (data) {
    console.log(data)
  })
})
