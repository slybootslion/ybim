layui.use(['LuCommonTemplate', 'LuLayer'], function () {
  const $ = layui.$

  const LuInnerHeader = layui.LuInnerHeader
  const LuSearchForm = layui.LuSearchForm
  const LuTable = layui.LuTable

  let luInnerHeader, luTable
  ;(async () => {
    renderInnerHeader()
    renderSearchForm()
    await renderTable()
  })()

  function renderInnerHeader() {
    luInnerHeader = new LuInnerHeader({
      title: '考勤月报表',
      rightHtml: [{ txt: '导出', icon: 'icon-shuxing-' }],
    })
  }

  function renderSearchForm() {
    // mock
    const bData = [
      { value: 1, key: '班组1' },
      { value: 2, key: '班组2' },
      { value: 3, key: '班组3' },
    ]
    const cData = [
      { value: 1, key: '公司1' },
      { value: 2, key: '山东荣红生物科技有限公司' },
    ]
    new LuSearchForm(
      [
        { label: '选择月份', type: 'date-mo', name: 's1' },
        { label: '工人姓名', type: 'text', name: 's2' },
        { label: '所属班组', type: 'select', selectData: bData, name: 's3' },
        { label: '所属公司', type: 'select', selectData: cData, name: 's4' },
      ],
      {
        submit(data) {
          console.log(data)
        },
      },
    )
  }

  async function renderTable() {
    /* mock */
    const data = await $lulib.getMockData('/htmls/mock/bsite/attendanceReportMonthlyData.json', 12, '', false)
    const M = 7
    const dayList = []
    data.forEach(person => {
      for (let i = 1; i <= person.states.length; i++) {
        if (dayList.length < i) {
          const title = `${M}月${i}日`
          const field = `m${M}d${i}`
          const innerHtml = `<span>
            <span class="{{d.${field} ? 'true' : 'false'}}" 
                    lay-event>
              {{d.${field} ? '√' : '×'}}
            </span>
</span>`
          const d = {
            field,
            title,
            minWidth: 90,
            align: 'center',
            templet: innerHtml,
          }
          dayList.push(d)
        }
        person[`${dayList[i - 1].field}`] = person.states[i - 1]
      }
    })
    const opts = {
      cols: [
        [
          { field: 'name', title: '姓名', minWidth: 100, align: 'center', fixed: 'left' },
          { field: 'team', title: '所属班组', minWidth: 130, align: 'center', fixed: 'left' },
          { field: 'workDaysCount', title: '累计出勤工日', minWidth: 130, align: 'center', fixed: 'left' },
          ...dayList,
        ],
      ],
    }
    luTable = new LuTable(data, opts)

  }
})
