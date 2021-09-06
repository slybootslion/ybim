layui.use(['LuCommonTemplate', 'LuLayer'], function () {
  const $ = layui.$

  const LuInnerHeader = layui.LuInnerHeader
  const LuSearchForm = layui.LuSearchForm
  const LuTable = layui.LuTable
  const LuLayer = layui.LuLayer

  class PageTemplate {
    tableTemplate() {
      const html1 = `<span>
      {{d.payedNum.done}}/<span class='table-txt-weak'>{{d.payedNum.count}}</span>
</span>`
      const html2 = `<span>
      {{d.payedMoney.done}}/<span class='table-txt-weak'>{{d.payedMoney.count}}</span>
</span>`
      const html3 = `<span>
      <span class="{{d.status ? 'table-txt-green' : 'table-txt-red'}}">{{d.status ? '已发放' : '未发放'}}</span>
</span>`
      const html4 = `<span>
      <span class='table-ctrl-box'>
        <a class='table-tool-link'
           href='javascript:void(0)'
           lay-event='detail' 
           style="display: {{d.status ? 'block' : 'none'}}">
          <span class='iconfont icon-chakanxiangqing'></span><span>查看详情</span>
        </a>
        <button class='layui-btn btn-tb-create' 
                lay-event='create'
                style="display: {{d.status ? 'none' : 'block'}}">
          工资发放
        </button>
      </span>
</span>`
      return { html1, html2, html3, html4 }
    }
  }

  const pt = new PageTemplate()

  let luInnerHeader, luTable
  !(async () => {
    initInnerHeader()
    searchFormRender()
    await tableRender()
  })()

  function initInnerHeader() {
    luInnerHeader = new LuInnerHeader({
      title: '记工单',
      rightHtml: [{ txt: '导出', icon: 'icon-shuxing-' }],
    })
  }

  function searchFormRender() {
    const selectCompany = [
      { value: 1, key: '陕西三秦路桥有限公司' },
      { value: 2, key: '陕西三秦路桥有限公司2' },
      { value: 3, key: '陕西三秦路桥有限公司3' },
    ]
    const selectMonth = [
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
    new LuSearchForm(
      [
        { label: '记工单名称', type: 'text', name: 's1' },
        { label: '参建公司', type: 'select', selectData: selectCompany, name: 's2' },
        { label: '发放月份', type: 'select', selectData: selectMonth, name: 's3' },
        {
          label: '状态',
          type: 'select',
          selectData: [
            { value: 1, key: '未发放' },
            { value: 2, key: '已发放' },
          ],
          name: 's4',
        },
      ],
      {
        submit(data) {
          console.log(data)
        },
      },
    )
  }

  async function tableRender() {
    const res = await $lulib.getMockData('/htmls/mock/bsite/payrollTableData.json', 9, '', false)
    const { html1, html2, html3, html4 } = pt.tableTemplate(res)

    const options = {
      cols: [
        $lulib.tableSetCenter([
          { field: 'id', title: '序号', width: 60 },
          { field: 'recordName', title: '记工单名称', minWidth: 190 },
          { field: 'company', title: '所属参建公司', minWidth: 220 },
          { field: 'endDate', title: '记工单截止日期', minWidth: 160 },
          { title: '已发薪酬人数（人）', templet: html1, minWidth: 160 },
          { title: '已发薪酬金额（元）', templet: html2, minWidth: 180 },
          { title: '状态', templet: html3, minWidth: 90 },
          { field: 'date', title: '发放日期', width: 120 },
          { title: '操作', templet: html4, minWidth: 120 },
        ]),
      ],
    }
    luTable = new LuTable(res, options)
    luTable.on(`tool(${luTable.options.filter})`, tableEventMethod)
  }

  function tableEventMethod(obj) {
    const { data: {id}, event: type } = obj
    $lulib.pagePushHash('bim/person-manage/payroll-issue', { type, id })
  }
})
