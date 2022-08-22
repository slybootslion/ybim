layui.use(['echarts', 'LuCommonTemplate'], function () {
  const $ = layui.$
  const echarts = layui.echarts
  const form = layui.form
  const LuTable = layui.LuTable

  let echartsObj = null;

  form.render()
  form.on("select(t)", async function (data) {
    const tableData = await $lulib.getMockData('/bpjcs/mock/dataAnalysisTableData.json',
      8, null, false)
    const tableOptions = {
      cols: [
        $lulib.tableSetCenter([
          { field: 't1', title: '时间', width: 160 },
          { field: 't2', title: '测点名称', width: 220 },
          { field: 't3', title: '东向（mm）', width: 130 },
          { field: 't4', title: '西向（mm）', width: 130 },
          { field: 't5', title: '垂直（mm）', width: 130 },
          { field: 't6', title: '速率x（mm）', width: 130 },
          { field: 't7', title: '速率y（mm）', width: 130 },
          { field: 't8', title: '速率h（mm）', width: 130 },
          { field: 't9', title: '加速度x（mm）', width: 130 },
          { field: 't10', title: '加速度y（mm）', width: 130 },
          { field: 't11', title: '加速度y（mm）', width: 130 },
        ]),
      ],
    }
    $(".table-box .table-content").html("<div class='content-table luTable'></div>")
    new LuTable(tableData, tableOptions)
  })

  form.on("select(e)", function (data) {
    const options = {
      grid: {
        bottom: 180
      },
      legend: {
        data: [{
          name: '传感器一数据',
          itemStyle: {
            color: '#00bb08'
          }
        }, {
          name: '传感器二数据',
          itemStyle: {
            color: '#e59300'
          }
        }],
        textStyle: {
          color: '#fff',
        },
        selectedMode: false,
      },
      dataZoom: [
        {
          show: true,
          realtime: true,
          start: 0,
          end: 100
        },
      ],
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: '#007fff',
          }
        },
      },
      yAxis: [
        {
          name: '传感器一数据',
          type: 'value',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#00bb08',
            }
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            textStyle: { color: '#00bb08' }
          },
          max: 35,
          min: -10,
        },
        {
          name: '传感器二数据',
          type: 'value',
          alignTicks: true,
          splitLine: {
            show: false
          },
          axisTick: {
            show: true,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#e59300',
            }
          },
        }
      ],
      series: [
        {
          name: '传感器一数据',
          type: 'line',
          lineStyle: {
            width: 3,
            color: '#00bb08'
          },
          symbol: 'none',
          emphasis: {
            focus: 'series'
          },
          step: 'start',
        },
        {
          name: '传感器二数据',
          type: 'line',
          yAxisIndex: 1,
          lineStyle: {
            width: 3,
            color: '#e59300'
          },
          symbol: 'none',
          emphasis: {
            focus: 'series'
          },
          step: 'start',
        }
      ]
    }
    // mock data
    const xData = ['2009/6/12 2:00', '2009/6/12 3:00', '2009/6/12 4:00', '2009/6/12 5:00', '2009/6/12 6:00', '2009/6/12 7:00',
      '2009/6/12 8:00', '2009/6/12 9:00', '2009/6/12 10:00', '2009/6/12 11:00', '2009/6/12 12:00', '2009/6/12 13:00',
      '2009/6/12 14:00', '2009/6/12 15:00', '2009/6/12 16:00', '2009/6/12 17:00', '2009/6/12 18:00', '2009/6/12 19:00',
      '2009/6/12 20:00', '2009/6/12 21:00', '2009/6/12 22:00', '2009/6/12 23:00', '2009/6/13 0:00', '2009/6/13 1:00',
      '2009/6/13 2:00', '2009/6/13 3:00', '2009/6/13 4:00', '2009/6/13 5:00', '2009/6/13 6:00', '2009/6/13 7:00',
      '2009/6/13 8:00', '2009/6/13 9:00', '2009/6/13 10:00', '2009/6/13 11:00', '2009/6/13 12:00', '2009/6/13 13:00',
      '2009/6/13 14:00', '2009/6/13 15:00', '2009/6/13 16:00', '2009/6/13 17:00', '2009/6/13 18:00', '2009/6/13 19:00',
      '2009/6/13 20:00', '2009/6/13 21:00', '2009/6/13 22:00', '2009/6/13 23:00', '2009/6/14 0:00', '2009/6/14 1:00',
      '2009/6/14 2:00', '2009/6/14 3:00', '2009/6/14 4:00', '2009/6/14 5:00', '2009/6/14 6:00', '2009/6/14 7:00',
      '2009/6/14 8:00', '2009/6/14 9:00', '2009/6/14 10:00', '2009/6/14 11:00', '2009/6/14 12:00', '2009/6/14 13:00',
      '2009/6/14 14:00', '2009/6/14 15:00', '2009/6/14 16:00', '2009/6/14 17:00', '2009/6/14 18:00', '2009/6/14 19:00',
      '2009/6/14 20:00', '2009/6/14 21:00', '2009/6/14 22:00', '2009/6/14 23:00', '2009/6/15 0:00', '2009/6/15 1:00',
      '2009/6/15 2:00', '2009/6/15 3:00', '2009/6/15 4:00', '2009/6/15 5:00', '2009/6/15 6:00', '2009/6/15 7:00',
      '2009/6/15 8:00', '2009/6/15 9:00', '2009/6/15 10:00', '2009/6/15 11:00', '2009/6/15 12:00', '2009/6/15 13:00',
      '2009/6/15 14:00', '2009/6/15 15:00', '2009/6/15 16:00', '2009/6/15 17:00', '2009/6/15 18:00', '2009/6/15 19:00',
      '2009/6/15 20:00', '2009/6/15 21:00', '2009/6/15 22:00', '2009/6/15 23:00', '2009/6/15 0:00', '2009/6/16 1:00',
      '2009/6/16 2:00', '2009/6/16 3:00', '2009/6/16 4:00', '2009/6/16 5:00',]
      .map(str => str.replace(' ', '\n'))
    const data1 = makeData(100, 26, 1, 6)
    const data2 = makeData(100, 50, 25, 3)

    options.xAxis.data = xData
    for (let i = 0; i < 2; i++) {
      options.series.push({
        name: i < 1 ? '传感器一数据' : '传感器二数据',
        type: 'line',
        yAxisIndex: 1,
        lineStyle: {
          width: 3,
          color: i < 1 ? '#00bb08' : '#e59300',
        },
        symbol: 'none',
        emphasis: {
          focus: 'series'
        },
        step: 'start',
        data: i < 1 ? data1 : data2,
      })
    }
    const template = `<div class="echarts-title">比对结果</div><div class="echarts-container"><div class="echarts" id="echarts"></div></div>`
    $(".echarts-box .echarts-content").html(template)
    const chartDom = document.querySelector('#echarts');
    echartsObj = echarts.init(chartDom)
    echartsObj.setOption(options)
  })


  $(".container-nav .nav-item").on('click', async function () {
    const $this = $(this)
    const isActive = $this.hasClass('active')
    if (isActive) return
    $this.addClass('active').siblings('.nav-item').removeClass('active')

  })

  function makeData (count, max, min, interval = 5) {
    const res = []
    let prev = 0, p = 1
    for (let i = 0; i < count; i++) {
      const flag = $lulib.randomInt(interval) * p
      prev = prev + flag > max ? prev + (flag * (p = -1)) : (prev + flag < min ? prev + (flag * (p = 1)) : prev + flag)
      res.push(prev)
    }
    return res
  }
})
