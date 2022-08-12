layui.use(['echarts'], function () {
  const $ = layui.$
  const form = layui.form
  const echarts = layui.echarts
  let echartsObj = null;

  checkboxRender()
  const checkItems = $(".layui-form .check-item")
  const checkAll = $(".layui-form .check-all")
  form.on('checkbox', function (data) {
    const itemName = data.elem.name
    const checked = data.elem.checked
    if (itemName === 'checkAll') {
      checkItems.each((idx, el) => {
        el.checked = checked
      })
    } else {
      if (checked) {
        let count = 0
        checkItems.each((idx, el) => {
          if (el.checked) count++
        })
        if (count === 5) {
          checkAll[0].checked = checked
        }
      } else {
        checkAll[0].checked = checked
      }
    }
    checkboxRender()
  })

  function checkboxRender () {
    form.render()
  }

  function renderEcharts (type) {
    let timeData = [], dataA = [], dataB = [];
    const timeStep = 6 * 60 * 1000
    let base = +new Date();

    function computedTimeLine (limit = 240) {
      for (let i = 0; i < limit; i++) {
        const time = new Date(base -= timeStep);
        timeData.push($lulib.getFormatTime('YYYY/MM/DD HH:mm:ss', time));
        // mock data
        dataA.push($lulib.randomInt(35, -35))
        dataB.push($lulib.randomInt(20, -10))
      }
    }

    switch (type) {
    case '一小时':
      computedTimeLine(20);
      break
    case '一天':
      computedTimeLine();
      break;
    case '一周':
      computedTimeLine(240 * 7);
      break;
    case '一月':
      computedTimeLine(240 * 30)
      break;
    default:
      computedTimeLine(120)
      break
    }

    const option = {
      grid: {
        right: '3%',
        bottom: '18%',
        top: '5%',
      },
      title: {
        text: 'CNSS',
        x: 'left',
        y: 'center',
        textStyle: {
          color: '#ffffff',
        }
      },
      legend: {
        data: [{
          name: 'CNSS一号点（东向）',
          itemStyle: {
            color: '#e59300'
          }
        }, {
          name: 'CNSS一号点（西向）',
          itemStyle: {
            color: '#b28de8'
          }
        }],
        textStyle: {
          color: '#fff',
        },
        selectedMode: false,
        x: 'center',
        y: 'bottom',
      },
      xAxis: {
        type: 'category',
        data: timeData,
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: dataA,
          name: 'CNSS一号点（东向）',
          type: 'line',
          lineStyle: {
            width: 3,
            color: '#e59300'
          },
          symbol: 'none',
          emphasis: {
            focus: 'series'
          },
          smooth: true,
        },
        {
          data: dataB,
          name: 'CNSS一号点（西向）',
          type: 'line',
          lineStyle: {
            width: 3,
            color: '#b28de8'
          },
          symbol: 'none',
          emphasis: {
            focus: 'series'
          },
          smooth: true,
        },
      ]
    }

    const chartDom = document.querySelector('#echartsBox');
    echartsObj = echarts.init(chartDom)
    echartsObj.setOption(option)
  }

  renderEcharts()

  $(".echarts-box .echarts-title .iconfont").on('click', function () {
    const pEl = $(this).parents(".echarts-box")
    pEl.hide()
    echartsObj = null
  });

  $(".time-box .time-span").on('click', function () {
    const type = $(this).html()
    $(this).addClass('active').siblings('.time-span').removeClass('active')
    renderEcharts(type)
  });
})
