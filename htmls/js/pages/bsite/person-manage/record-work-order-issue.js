layui.use(['LuCommonTemplate', 'LuLayer'], function () {
  const $ = layui.$

  const LuInnerHeader = layui.LuInnerHeader
  const LuTable = layui.LuTable

  class PageTemplate {
    content1Template (data) {
      const dict = {
        i1: '记工单名称',
        i2: '所属参见单位',
        i3: '截止时间',
        i5: '填单日期',
        i4: '备注',
      }
      let harr = []
      Object.keys(dict).forEach(key => harr.push(`<div class='list-item'><div class='label'>${dict[key]}：</div><div class='desc'>${data[key]}</div></div>`))
      let html1 = ''
      let html2 = ''
      let html3 = ''
      for (let i = 0; i < harr.length; i++) {
        if (i % 3 === 0) html1 += `<div class='list-item'>${harr[i]}</div>`
        if (i % 3 === 1) html2 += `<div class='list-item'>${harr[i]}</div>`
        if (i % 3 === 2) {
          html3 += `<div class='list-item'>${harr[i]}</div>`
        }
      }
      return `
        <div class='content-head'>
          <span>班组信息</span>
        </div>
        <div class='content-box'>
          <div class='content-list'>${html1}</div>
          <div class='content-list'>${html2}</div>
          <div class='content-list'>${html3}</div>
        </div>
      `
    }

    content2Template() {
      return `
        <div class='content-head'>
          <span>工人信息</span>
        </div>
        <div class='content-table luTable'></div>
      `
    }

  }

  const pt = new PageTemplate

  let luInnerHeader, params, luTable
  ;(async () => {
    params = $lulib.getHashParams()
    initInnerHeader()
    await initContent()
  })()

  function initInnerHeader () {
    if (!params) return
    luInnerHeader = new LuInnerHeader({
      title: '记工单查看详情',
      rightHtml: [{ txt: '返回', isWeaken: true }],
    })
  }

  $lulib.bindMethod([{ dom: luInnerHeader.rightBtns[0], method: $lulib.pageGoBack }])

  async function initContent () {
    if (!params) return
    // mock
    const data = {
      i1: '电工8月份工资单',
      i2: '陕西三秦路桥有限公司',
      i3: '2020-10-05',
      i5: '2020-11-05',
      i4: '备注信息个别人员的发放情况等',
    }
    const template1 = pt.content1Template(data)
    const $content = $('.content')
    $content.eq(0).html(template1)
    const template2 = pt.content2Template()
    $content.eq(1).html(template2)
    const tableData = await $lulib.getMockData('/htmls/mock/bsite/payrollTableIssueTableData.json', 8, '', false)
    const options = {
      cols: [
        $lulib.tableSetCenter([
          { field: 'id', title: '序号', width: 60 },
          { field: 'n1', title: '姓名', minWidth: 80 },
          { field: 'team', title: '班组名称', minWidth: 150 },
          { field: 'time', title: '记工时间段', minWidth: 200 },
          { field: 'day', title: '工日（工）', width: 100 },
          { field: 'money', title: '工价（元/工）', width: 120 },
          { field: 'reward', title: '嘉奖（元）', width: 100 },
          { field: 'deduction', title: '扣款（元）', width: 100 },
          { field: 'payCount', title: '记工工资（元）', width: 130 },
        ]),
      ],
    }
    luTable = new LuTable(tableData, options)
  }
})
