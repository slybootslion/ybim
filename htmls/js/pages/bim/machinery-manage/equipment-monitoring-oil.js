layui.use(['LuCommonTemplate', 'laydate', 'echarts'], function () {
  const $ = layui.$
  const laydate = layui.laydate
  const LuInnerHeader = layui.LuInnerHeader
  const LuTable = layui.LuTable

  let luInnerHeader, dateStr, echartsObj, luTable

  const computeDay = (isNext, cur) => {
      let constant = -86400000
      const dayStr = cur ? cur : dateStr;
      isNext && (constant *= -1);
      return $lulib.dayjs(new Date(dayStr).getTime() + constant).format('YYYY-MM-DD')
    }

  ;(() => {
    innerHeaderRender()
    initDateInput()
    initDateInput(null, "#weekDate")
    tableRender();
  })()

  async function tableRender () {
    const tableData = await $lulib.getMockData('/htmls/mock/bim/equipmentMonitoringTimeTableData.json', 17, '', false)
    const tableOptions = {
      cols: [
        $lulib.tableSetCenter([
          { field: 't1', title: '加油时间' },
          { field: 't2', title: '加油量' },
          { field: 't3', title: '采集值' },
          { field: 't4', title: '校正值' },
        ])
      ],
      limit: 8,
    }
    luTable = new LuTable(tableData, tableOptions)
  }

  function innerHeaderRender () {
    luInnerHeader = new LuInnerHeader({
      title: '设备监测',
      rightHtml: [{ txt: '返回', isWeaken: true }],
    })
  }

  function initDateInput (date, el = "#dayDate") {
    dateStr = date || $lulib.dayjs(new Date()).format('YYYY-MM-DD')
    laydate.render({
      elem: el,
      value: dateStr,
      isInitValue: true,
      showBottom: false,
      done (date) {
        dateStr = date
        el === '#dayDate' ? renderEchartsDay() : renderEchartsWeek()
      }
    })
    el === '#dayDate' ? renderEchartsDay() : renderEchartsWeek()
  }

  function renderEchartsDay () {
    let xData = [], seriesData = []
    const makeMockData = () => {
      let maxNum = $lulib.randomInt(250, 230), time = 0
      for (let i = 0; i <= 480; i++) {
        maxNum -= $lulib.randomInt(5, 1) / $lulib.randomInt(12, 4)
        xData.push(+time.toFixed(2))
        time += 0.05
        seriesData.push(maxNum.toFixed(2))
      }
    }
    makeMockData();
    const opts = {
      tooltip: {
        show: true,
      },
      xAxis: {
        type: 'category',
        data: xData,
        axisLabel: {
          interval: 19
        },
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: seriesData,
          type: 'line',
          smooth: true
        }
      ]
    };
    echartsObj = echarts.init(document.querySelector('#echartsBoxDay'), opts)
    echartsObj.setOption(opts)
  }

  function renderEchartsWeek () {
    let xStr = dateStr
    let xData = [], seriesData = []
    const makeMockData = () => {
      for (let i = 0; i < 7; i++) {
        xData.unshift(xStr)
        xStr = computeDay(false, xStr)
        seriesData.push($lulib.randomInt(260, 110))
      }
    }
    makeMockData();
    const opts = {
      tooltip: {
        show: true,
      },
      xAxis: {
        type: 'category',
        data: xData,
        axisLabel: {
          interval: 19
        },
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: seriesData,
          type: 'line',
          smooth: true
        }
      ]
    };
    echartsObj = echarts.init(document.querySelector('#echartsBoxWeek'), opts)
    echartsObj.setOption(opts)
  }

  $(".preDay").on('click', () => initDateInput(computeDay()));
  $(".nextDay").on('click', () => initDateInput(computeDay(true)))

  $(".preWeek").on('click', () => initDateInput(computeDay(), "#weekDate"));
  $(".nextWeek").on('click', () => initDateInput(computeDay(true), "#weekDate"));

})
