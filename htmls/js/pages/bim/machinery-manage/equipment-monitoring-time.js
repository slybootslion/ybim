layui.use(['LuCommonTemplate', 'LuLayer', 'laypage', 'echarts'], function () {
  const $ = layui.$
  const LuInnerHeader = layui.LuInnerHeader
  const element = layui.element
  const LuTable = layui.LuTable
  const echarts = layui.echarts
  const laypage = layui.laypage
  const LuLayer = layui.LuLayer
  const table = layui.table

  let luInnerHeader, luTable, echartsObj, innerTable, currentInnerTable, luLayer
  ;(async () => {
    innerHeaderRender()
    tableRender()
    echartsRender()
  })()

  function innerHeaderRender () {
    luInnerHeader = new LuInnerHeader({
      title: '设备监测',
      rightHtml: [{ txt: '返回', isWeaken: true }],
    })
  }

  $lulib.bindMethod([{ dom: luInnerHeader.rightBtns[0], method: () => $lulib.pageGoBack() }])

  async function tableRender () {
    const tableData = await $lulib.getMockData('/htmls/mock/bim/equipmentMonitoringTimeTableData.json', 17, '', false)
    const tableOptions = {
      cols: [
        $lulib.tableSetCenter([
          { field: 't1', title: '日期' },
          { field: 't2', title: '运行时长' },
          { field: 't3', title: '怠速时长' },
          { field: 't4', title: '静止时长' },
        ])
      ],
      ctrlData: [
        { eventStr: 'info', txtStr: '查看详情' },
      ],
      methods: { info },
      limit: 8,
    }
    luTable = new LuTable(tableData, tableOptions)
  }

  async function info (data) {
    currentInnerTable = data.id;
    const opts = {
      id: 'innerEquipmentMonitoringTimeTable',
      area: ['1260px', '680px'],
      title: '工时详情',
      content: `
            <div class='inner-table-box'>
            <div class="inner-table-top" style="width: 100%; display: flex; justify-content: flex-end; padding: 0 10px; box-sizing: border-box"><div class="layui-btn layui-btn-primary layui-btn-sm table-inner-btn" style="margin-top: 10px; background-color: #fff;">导出表格</div></div>
              <table class='inner-table layui-hide'
                     lay-filter='innerTable' 
                     id='innerTableBox'></table>
            </div>`,
    }
    luLayer = new LuLayer(opts)

    const innerTableData = await $lulib.getMockData('/htmls/mock/bim/equipmentMonitoringTimeInnerTableData.json', 4, '', false)
    console.log(innerTableData)
    const template = `<span>
        <div class="table-statue">
          <span class="point {{d.t3 === '运行' ? 'blue' : 'orange'}}"></span>
          <span>{{d.t3}}</span>
        </div>
      </span>`
    const tableOpts = {
      elem: '#innerTableBox',
      page: true,
      limit: 15,
      data: innerTableData,
      cols: [
        $lulib.tableSetCenter([
          { field: 't1', title: '开始时间' },
          { field: 't2', title: '结束时间' },
          // { field: 't3', title: '状态' },
          { title: '状态', templet: template, width: 180 },
          { field: 't4', title: '持续时长' },
        ]),
      ],
    }
    innerTable = table.render(tableOpts)
  }

  async function echartsRender () {
    let yData = []
    let chartData = [
        {
          itemName: '2022-10-15', // 项目名
          value: [
            0, // 索引
            1, // 项目开始时间
            3, // 项目结束时间
            1,
          ]
        },
        {
          itemName: '2022-10-15', // 项目名
          value: [
            0,
            5,
            7.6,
            0,
          ]
        },
        {
          itemName: '2022-10-15', // 项目名
          value: [
            0,
            7.9,
            13.3,
            1,
          ]
        },
        {
          itemName: '2022-10-17',
          value: [
            1,
            14,
            21.8,
            1,
          ]
        },
        {
          itemName: '2022-10-18',
          value: [
            2,
            7.54,
            14.4,
            1,
          ]
        },
        {
          itemName: '2022-10-18',
          value: [
            2,
            4.1984,
            5.2022,
            0,
          ]
        },
        {
          itemName: '2022-10-19',
          value: [
            3,
            9.9,
            10.4,
            1,
          ]
        },
        {
          itemName: '2022-10-20',
          value: [
            4,
            0.4,
            1,
            1,
          ]
        },
        {
          itemName: '2022-10-21',
          value: [
            5,
            $lulib.randomInt(8, 3),
            $lulib.randomInt(16, 11),
            1,
          ]
        },
        {
          itemName: '2022-10-22',
          value: [
            6,
            2,
            3,
            1,
          ]
        },
        {
          itemName: '2022-10-22',
          value: [
            6,
            $lulib.randomInt(7, 4),
            $lulib.randomInt(15, 9),
            0,
          ]
        },
        {
          itemName: '2022-10-23',
          value: [
            7,
            5.5,
            11,
            1,
          ]
        },
      ]
    ;(() => yData = $lulib.unique(chartData.map(item => item.itemName)))()

    const formatTooltip = params => {
      const values = params.map(p => p.value).reduce((per, cur) => {
        per[cur[3]] += Number((cur[2] - cur[1]).toFixed(2))
        return per
      }, { 1: 0, 0: 0 })

      const numToTime = num => {
        const timeArr = num.toString().split('.')
        let str = `${timeArr[0]}小时`
        let minute = ''
        timeArr[1] && (minute = Math.floor(60 * (+timeArr[1] < 10 ? +timeArr[1] * 10 : +timeArr[1]) / 100))
        return timeArr.length < 2 ? str : +timeArr[0] === 0 ? `${minute}分钟` : str + `${minute}分钟`
      }
      return `${params[0].name}:<br/>
                  累计运行：${numToTime(values[1])}<br/>
                  累计怠速运行：${numToTime(values[0])}`
    }

    const opts = setOptions()

    function setOptions () {
      return {
        tooltip: {
          formatter: formatTooltip,
        },
        grid: {
          height: 460,
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          }
        },
        xAxis: {
          type: 'value',
          interval: 1,
          min: 0,
          max: 24,
          axisLabel: {
            interval: 0
          },
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        yAxis: {
          data: yData
        },
        legend: {
          selectedMode: false,
          left: '70%',
          top: 10,
          data: ['运行', '怠速']
        },
        series: [
          {
            type: 'custom',
            renderItem: renderItem,
            name: '运行',
            itemStyle: {
              opacity: 0.7,
              color: '#409EFF'
            },
            encode: {
              x: [1, 2],
              y: 0
            },
            data: chartData
          },
          {
            type: 'custom',
            name: '怠速',
            itemStyle: {
              color: '#ff9018'
            }
          }
        ]
      }
    }

    function renderItem (params, api) {
      let categoryIndex = api.value(0)
      let planStartDate = api.coord([api.value(1), categoryIndex])
      let planEndDate = api.coord([api.value(2), categoryIndex])
      let height = api.size([0, 1])[1] * 0.5
      let width = planEndDate[0] - planStartDate[0]
      let rectShape1 = echarts.graphic.clipRectByRect({
          x: planStartDate[0],
          y: planStartDate[1] - height / 2,
          width,
          height
        },
        {
          x: params.coordSys.x,
          y: params.coordSys.y,
          width: params.coordSys.width,
          height: params.coordSys.height
        })
      return rectShape1 && {
        type: 'group',
        children: [
          {
            type: 'rect',
            shape: rectShape1,
            style: api.style({
              fill: api.value(3) === 1 ? '#409EFF' : '#ff9018'
            })
          }
        ]
      }
    }

    echartsObj = echarts.init(document.querySelector('#echartsBox'), opts)
    echartsObj.setOption(opts)
  }

  laypage.render({
    elem: 'echartsPage',
    limit: 8,
    count: 51,
    jump: (obj, first) => {
      if (first) return
      echartsRender()
    }
  });

  // tabs change
  const showExportTableButton = idx => {
    const $btn = $(".table-out-btn")
    idx === 0 ? $btn.removeClass('hide') : $btn.addClass('hide')
  }
  element.on('tab(role)', data => {
    showExportTableButton(data.index)
  })
})
