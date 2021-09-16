layui.use(['LuCommonTemplate', 'LuLayer'], function () {
  const $ = layui.$

  const LuInnerHeader = layui.LuInnerHeader
  const LuTable = layui.LuTable

  class PageTemplate {
    topHtmlTemplate(data) {
      let h = ''
      const dict = [
        { idNum: '身份证号码', i3: '角色', i4: '发证机关' },
        { i5: '出生日期', i6: '文化程度', i7: '住址' },
        { i8: '籍贯', i9: '工种' },
      ]
      for (let i = 0; i < 3; i++) {
        const item = dict[i]
        let ih = ''
        Object.keys(item).forEach(key => {
          ih += `<div class='item'>
                    <div class='label'>${item[key]}：</div>
                    <div class='desc'>${data[key]}</div>
                  </div>`
        })
        h += `<div class='b-col-item'>${ih}</div>`
      }

      return `<div class='avatar-box'>
                <img src='${data.avatar}' alt=''>
              </div>
              <div class='content-detail'>
                <div class='top'>
                  <div class='name'>${data.name}</div>
                  <div class='gender'><span>${data.gender}</span><span>♂</span></div>
                  <div class='desc'>${data.i1}</div>
                  <div class='desc'>${data.i2}</div>
                </div>
                <div class='bottom'>
                  ${h}
                </div>
              </div>`
    }

    bottomHtmlTemplate(data) {
      let tabh = '',
        contenth = ''
      const tabDict = [
        { icon: 'icon-guanlirenyuanjintuichang', txt: '进退场记录' },
        { icon: 'icon-fenbaolaowuhetong', txt: '劳务合同' },
        { icon: 'icon-chuqin', txt: '出勤记录' },
        { icon: 'icon-gongzijilu', txt: '工资记录' },
      ]
      for (let i = 0; i < tabDict.length; i++) {
        const item = tabDict[i]
        let classNameTab, classNameContent
        if (i === 0) {
          classNameTab = 'layui-this'
          classNameContent = 'layui-show'
        } else {
          classNameTab = ''
          classNameContent = ''
        }
        tabh += `<li class='${classNameTab}'><span class='${item.icon} iconfont'></span><span>${item.txt}</span></li>`
        contenth += `<div class='layui-tab-item tab-content-${i + 1} ${classNameContent}'></div>`
      }
      return `<ul class='layui-tab-title'>${tabh}</ul><div class='layui-tab-content'>${contenth}</div>`
    }
  }

  const pt = new PageTemplate()

  let luInnerHeader
  !(async () => {
    renderInnerHeader()
    await renderInitContent()
  })()

  function renderInnerHeader() {
    luInnerHeader = new LuInnerHeader({
      title: '花名册',
      rightHtml: [{ txt: '返回', isWeaken: true }],
    })
  }

  async function renderInitContent() {
    // mock
    const userInfo = {
      avatar: '/htmls/images/page/bsite/avatar-def.png',
      name: '田鹏',
      gender: '男',
      i1: '汉族',
      i2: '15748951234',
      idNum: '6125481987124657',
      i3: '建筑工人',
      i4: '洛阳公安局',
      i5: '1986-01-15',
      i6: '高中',
      i7: '陕西省洛阳县顾振宇甘河村张家园社区',
      i8: '陕西、渭南',
      i9: '钢筋工',
    }
    const tableData = await $.getJSON('/htmls/mock/bsite/rosterDetailTableData.json')
    const topHtml = pt.topHtmlTemplate(userInfo)
    const bottomHtml = pt.bottomHtmlTemplate()
    $('.top-detail').html(topHtml)
    $('.bottom-detail').html(bottomHtml)
    const opt1 = {
      cols: [
        $lulib.tableSetCenter([
          { field: 't1-1', title: '序号', width: 80 },
          { field: 't1-2', title: '所属参建单位', width: 260 },
          { field: 't1-3', title: '班组' },
          { field: 't1-4', title: '进场时间' },
          { field: 't1-5', title: '退场时间' },
        ]),
      ],
      id: 'table1',
      elem: '#table1',
      page: false,
      filter: 'tb1',
      el: $(".tab-content-1"),
    }
    const opt2 = {
      cols: [
        $lulib.tableSetCenter([
          { field: 't2-1', title: '合同编号' },
          { field: 't2-2', title: '参建公司' },
          { field: 't2-3', title: '班组' },
          { field: 't2-4', title: '合同期限（天）' },
          { field: 't2-5', title: '开始时间' },
          { field: 't2-6', title: '结束时间' },
          { field: 't2-7', title: '签订日期' },
          { field: 't2-8', title: '结算方式' },
          { field: 't2-9', title: '工资' },
        ]),
      ],
      id: 'table2',
      elem: '#table2',
      page: false,
      filter: 'tb2',
      el: $(".tab-content-2"),
    }
    const opt3 = {
      cols: [
        $lulib.tableSetCenter([
          { field: 't3-1', title: '月份', width: 120 },
          { field: 't3-2', title: '所属班组', width: 220 },
          { field: 't3-3', title: '所属参建公司', width: 280 },
          { field: 't3-4', title: '当月出勤（日）' },
          { field: 't3-5', title: '当月累计工时（时）' },
        ]),
      ],
      id: 'table3',
      elem: '#table3',
      page: false,
      filter: 'tb3',
      el: $(".tab-content-3"),
    }
    const template = `
      <span><span class="{{d.status === true ? 'green' : 'red'}}">{{d.status === true ? '已发放' : '未发放'}}</span></span>
    `
    const opt4 = {
      cols: [
        $lulib.tableSetCenter([
          { field: 't4-1', title: '月份', width: 120 },
          { field: 't4-2', title: '班组名称' },
          { field: 't4-3', title: '所属参建公司' },
          { field: 't4-4', title: '工资类型' },
          { field: 't4-5', title: '应发金额' },
          { field: 't4-6', title: '实发金额' },
          { title: '状态', templet: template },
        ]),
      ],
      id: 'table4',
      elem: '#table4',
      page: false,
      filter: 'tb4',
      el: $(".tab-content-4"),
    }

    new LuTable(tableData.t1, opt1)
    new LuTable(tableData.t2, opt2)
    new LuTable(tableData.t3, opt3)
    new LuTable(tableData.t4, opt4)
  }

  $lulib.bindMethod([{ dom: luInnerHeader.rightBtns[0], method: $lulib.pageGoBack }])
})
