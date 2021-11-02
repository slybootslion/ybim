layui.use(['LuCommonTemplate', 'echarts'], function () {
  const $ = layui.$
  const LuSearchForm = layui.LuSearchForm
  const echarts = layui.echarts

  let luSearchForm, echartsObj;

  const getSelectData = async () => {
    // mock data
    return {
      s1: [{ value: '1', key: '位移计1' }, { value: '2', key: '位移计2' }],
      s2: [{ value: '1', key: '位移计1' }, { value: '2', key: '位移计2' }],
      s3: [{ value: '1', key: `传感器${$lulib.randomInt(2, 1)}` }, { value: '2', key: `传感器${$lulib.randomInt(5, 3)}` }],
      s4: [{ value: '1', key: `传感器${$lulib.randomInt(7, 6)}` }, { value: '2', key: `传感器${$lulib.randomInt(10, 8)}` }]
    }
  }

  const bindSelectEvent = (luSearchForm) => {
    if (!luSearchForm) return
    const filterArr = luSearchForm.data.filter(d => d.type === 'select')
    filterArr.forEach(s => luSearchForm.form.on(`select(${s.name})`, selectEvent))
  }

  (async () => {
    const data = await getSelectData()
    luSearchForm = renderLuSearchForm(data)
    bindSelectEvent(luSearchForm)
  })()

  $(".analysis-evaluation .nav .btn-item").on('click', async function () {
    const isActive = $(this).hasClass('active')
    if (isActive) return
    $(this).addClass('active').siblings('.btn-item').removeClass('active')
  })

  $(".container-nav .nav-item").on('click', async function () {
    const $this = $(this)
    const isActive = $this.hasClass('active')
    if (isActive) return
    $this.addClass('active').siblings('.nav-item').removeClass('active')
    renderLuSearchForm(await getSelectData())
    echartsReset()
  })

  $lulib.computedContentHeight('.page-container', $lulib.domWidthHeight('.analysis-evaluation .nav').height)

  const renderLuSearchForm = formData => {
    return new LuSearchForm([
      { label: '传感器一类型', type: 'select', selectData: formData.s1, name: 's1' },
      { label: '传感器二类型', type: 'select', selectData: formData.s2, name: 's2' },
      {
        label: '选择时间',
        type: 'date-d',
        options: {
          startName: 'sDate', endName: 'eDate', options: { startValue: formData.sDate, endValue: formData.eDate }
        },
      },
      { label: '传感器一名称', type: 'select', selectData: formData.s3, name: 's3' },
      { label: '传感器二名称', type: 'select', selectData: formData.s4, name: 's4' },
    ], {
      submitBtnText: '开始比较',
      clearBtnText: '清空选择',
      submit (data) {
        renderEcharts(data)
      },
      async clearForm (data) {
        // mock data
        const sd = await getSelectData()
        renderLuSearchForm(sd)
      },
    })
  }


  const selectEvent = async obj => {
    const name = $(obj.elem).attr('name')
    const renderSearchFormPar = async () => {
      const formData = luSearchForm.form.val('search-form')
      const data = await getSelectData()
      if (formData.s1) {
        data.s1.forEach(item => {
          if (item.value === formData.s1) item.selected = true
        })
      }
      if (formData.s2) {
        data.s2.forEach(item => {
          if (item.value === formData.s2) item.selected = true
        })
      }
      if (formData.sDate) data.sDate = formData.sDate
      if (formData.eDate) data.eDate = formData.eDate
      renderLuSearchForm(data)
    }
    switch (name) {
      case 's1':
      case 's2':
        await renderSearchFormPar()
        break
      default:
        break
    }
  }

  function echartsReset () {
    $(".echarts-box").html('<div class="empty">暂无数据</div>')
  }

  renderEcharts()

  function renderEcharts (selectData) {
    const tempalte = `<div class="echarts-title">比对结果</div><div class="echarts-container"><div class="echarts" id="echarts"></div></div>`
    $(".echarts-box").html(tempalte)

    // mock data
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

    option = {
      grid: {
        bottom: 80
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
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: ['2009/6/12 2:00', '2009/6/12 3:00', '2009/6/12 4:00', '2009/6/12 5:00', '2009/6/12 6:00', '2009/6/12 7:00', '2009/6/12 8:00', '2009/6/12 9:00', '2009/6/12 10:00', '2009/6/12 11:00', '2009/6/12 12:00', '2009/6/12 13:00', '2009/6/12 14:00', '2009/6/12 15:00', '2009/6/12 16:00', '2009/6/12 17:00', '2009/6/12 18:00', '2009/6/12 19:00', '2009/6/12 20:00', '2009/6/12 21:00', '2009/6/12 22:00', '2009/6/12 23:00', '2009/6/13 0:00', '2009/6/13 1:00', '2009/6/13 2:00', '2009/6/13 3:00', '2009/6/13 4:00', '2009/6/13 5:00', '2009/6/13 6:00', '2009/6/13 7:00', '2009/6/13 8:00', '2009/6/13 9:00', '2009/6/13 10:00', '2009/6/13 11:00', '2009/6/13 12:00', '2009/6/13 13:00', '2009/6/13 14:00', '2009/6/13 15:00', '2009/6/13 16:00', '2009/6/13 17:00', '2009/6/13 18:00', '2009/6/13 19:00', '2009/6/13 20:00', '2009/6/13 21:00', '2009/6/13 22:00', '2009/6/13 23:00', '2009/6/14 0:00', '2009/6/14 1:00', '2009/6/14 2:00', '2009/6/14 3:00', '2009/6/14 4:00', '2009/6/14 5:00', '2009/6/14 6:00', '2009/6/14 7:00', '2009/6/14 8:00', '2009/6/14 9:00', '2009/6/14 10:00', '2009/6/14 11:00', '2009/6/14 12:00', '2009/6/14 13:00', '2009/6/14 14:00', '2009/6/14 15:00', '2009/6/14 16:00', '2009/6/14 17:00', '2009/6/14 18:00', '2009/6/14 19:00', '2009/6/14 20:00', '2009/6/14 21:00', '2009/6/14 22:00', '2009/6/14 23:00', '2009/6/15 0:00', '2009/6/15 1:00', '2009/6/15 2:00', '2009/6/15 3:00', '2009/6/15 4:00', '2009/6/15 5:00', '2009/6/15 6:00', '2009/6/15 7:00', '2009/6/15 8:00', '2009/6/15 9:00', '2009/6/15 10:00', '2009/6/15 11:00', '2009/6/15 12:00', '2009/6/15 13:00', '2009/6/15 14:00', '2009/6/15 15:00', '2009/6/15 16:00', '2009/6/15 17:00', '2009/6/15 18:00', '2009/6/15 19:00', '2009/6/15 20:00', '2009/6/15 21:00', '2009/6/15 22:00', '2009/6/15 23:00', '2009/6/15 0:00', '2009/6/16 1:00', '2009/6/16 2:00', '2009/6/16 3:00', '2009/6/16 4:00', '2009/6/16 5:00',].map(function (str) {
            return str.replace(' ', '\n');
          })
        }
      ],
      yAxis: [
        {
          name: '传感器一数据',
          type: 'value',
          splitLine: {
            show: false
          },
          axisTick: {
            show: true,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#00bb08'
            }
          }
        },
        {
          name: '传感器二数据',
          type: 'value',
          splitLine: {
            show: false
          },
          axisTick: {
            show: true,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#e59300'
            }
          },
        }
      ],
      // todo 折线图x轴坐标
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
          data: makeData(100, 40, 15, 6)
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
          data: makeData(100, 50, 25, 3)
        }
      ]
    };
    const chartDom = document.querySelector('#echarts');
    echartsObj = echarts.init(chartDom)
    echartsObj.setOption(option)
  }


})
