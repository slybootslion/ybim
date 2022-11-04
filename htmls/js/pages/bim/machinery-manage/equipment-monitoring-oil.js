layui.use(['LuCommonTemplate', 'laydate', 'echarts'], function () {
  const $ = layui.$
  const laydate = layui.laydate
  const LuInnerHeader = layui.LuInnerHeader

  let luInnerHeader, dateDay, echartsObj

  ;(() => {
    innerHeaderRender()
    initDateInput()
  })()

  function innerHeaderRender () {
    luInnerHeader = new LuInnerHeader({
      title: '设备监测',
      rightHtml: [{ txt: '返回', isWeaken: true }],
    })
  }

  function initDateInput (date) {
    dateDay = date || $lulib.dayjs(new Date()).format('YYYY-MM-DD')
    laydate.render({
      elem: '#dayDate',
      value: dateDay,
      isInitValue: true,
      showBottom: false,
      done (date) {
        dateDay = date
        renderEcharts()
      }
    })
    renderEcharts()
  }

  function renderEcharts() {
    const opts = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
          smooth: true
        }
      ]
    };
    echartsObj = echarts.init(document.querySelector('#echartsBoxDay'), opts)
    echartsObj.setOption(opts)
  }

  const computeDay = isNext => {
    let constant = -86400000
    isNext && (constant *= -1);
    return $lulib.dayjs(new Date(dateDay).getTime() + constant).format('YYYY-MM-DD')
  }

  $(".preDay").on('click', () => initDateInput(computeDay()));
  $(".nextDay").on('click', () => initDateInput(computeDay(true)))


})
