layui.use(['LuCommonTemplate', 'echarts'], function () {
  const $ = layui.$
  const LuSearchForm = layui.LuSearchForm
  const LuLayer = layui.LuLayer
  const echarts = layui.echarts
  let luSearchForm, luLayer, currentData, echartsObj, echartsTimer

  const iconDict = {
    1: { name: '位移计', icon: 'inst-icon01' },
    2: { name: '加速度', icon: 'inst-icon02' },
    3: { name: '温度计', icon: 'inst-icon03' },
    4: { name: '湿度计', icon: 'inst-icon04' },
    5: { name: '裂缝计', icon: 'inst-icon05' },
  }

  class PageTemplate {
    bridgeTemplate (data) {
      const instrumentDict = {
        a1: { top: 50, left: 103 },
        a2: { top: 453, left: 103 },
        a3: { top: 90, left: 924 },
        a4: { top: 227, left: 924 },
        a5: { top: 242, left: 1334 },
      }
      let html = ''
      for (let i = 0; i < data.instrumentList.length; i++) {
        const item = data.instrumentList[i]
        const { top, left } = instrumentDict[item.id]
        const { icon, name } = iconDict[item.type]
        html += `<div class="instrument-item" data-id="${item.id}" style="top: ${top}px; left:${left}px;">
                    <div class="inst-item-icon" style="background-image:url('/qljcs/images/page/qljc/${icon}.png');"></div>
                    <div class="inst-item-info">
                      <p>${name}</p>
                      <p><span>${item.name}:${item.value}</span></p>
                    </div>
                  </div>`
      }
      const { height } = $lulib.domWidthHeight('.bridge-box')
      const width = parseInt(`${data.width * height / data.height}`)
      return `<div class="bridge-pic" style="width: ${width}px; height: ${height - 10}px; background-image:url('${data.pic}');">${html}</div>`
    }

    layerEchartsTemplate (data) {
      let h = ''
      for (let i = 0; i < data.info.length; i++) {
        const item = data.info[i]
        h += `<div class="info-item"><div class="label">${item.label}：</div><div class="desc">${item.desc}</div></div>`
      }

      return `<div class="echarts-layer-box">
        <div class="top-info-box">
          <h5 class="info-title">设备信息</h5>
          <div class="info-container">
            <div class="pic">
              <img src="${data.pic}" alt="">
            </div>
            <div class="info-list">${h}</div>
          </div>
        </div>
        <div class="echarts-box" id="echartsContainer"></div>
      </div>`
    }
  }

  const pt = new PageTemplate
  ;(async () => {
    renderSearch()
    await renderBridge(0)
  })()

  $(".bridge-monitoring .nav .btn-item").on('click', async function () {
    const isActive = $(this).hasClass('active')
    if (isActive) return
    $(this).addClass('active').siblings('.btn-item').removeClass('active')
    renderBridge($(this).index())
  })

  function renderSearch () {
    luSearchForm = new LuSearchForm([
      { label: '设备编号', type: 'text', name: 't1' },
      { label: '设备类型', type: 'select', selectData: [], name: 's1' },
      { label: '设备名称', type: 'select', selectData: [], name: 's2' },
    ], {
      submit (data) {
        console.log(data)
      }
    })
  }

  async function renderBridge (id) {
    const bridgeBox = $(".bridge-box")
    bridgeBox.html('')
    // mock
    const data = await $lulib.ajax('/qljcs/data/bridgeData.json', 'json')
    if (!data[id]) return
    currentData = data[id]
    const html = pt.bridgeTemplate(currentData)
    bridgeBox.html(html)
  }

  async function handleInstrument () {
    const { id } = $(this).data()
    const instrument = currentData.instrumentList.find(item => item.id === id)
    const title = `${instrument.name} ${iconDict[instrument.type].name}`
    const content = pt.layerEchartsTemplate(instrument)
    const opts = {
      title,
      id: 'instrumentEchartsForm',
      area: ['1178px', '668px'],
      content,
      cancel: () => {
        echartsObj = null
        clearInterval(echartsTimer)
        echartsTimer = null
      }
    }
    luLayer = new LuLayer(opts)

    await renderEcharts(id)
  }

  let data = [], xData = []
  const makeData = () => {
    if (!data.length) {
      for (let i = 0; i < 120; i++) {
        xData.push(dayjs(new Date()).format('HH:mm:ss\nMM-DD'))
        data.push($lulib.randomInt(77, -5))
      }
    } else {
      data.shift()
      data.push($lulib.randomInt(77, -5))
      xData.shift()
      xData.push(dayjs(new Date()).format('HH:mm:ss\nMM-DD'))
    }
  }

  async function renderEcharts (id) {
    // mock
    await $lulib.delay(200)
    const chartDom = document.querySelector('#echartsContainer');
    echartsObj = echarts.init(chartDom)
    const opts = await getEchartsOptions(id)
    const run = () => {
      makeData()
      echartsObj.setOption(opts)
    }
    run()
    echartsTimer = setInterval(run, 1000)
  }

  async function getEchartsOptions (id) {
    const LEVEL_1_COLOR = 'rgba(53, 171, 106, .5)'
    const LEVEL_2_COLOR = 'rgba(53, 132, 146, .5)'
    const LEVEL_3_COLOR = 'rgba(255, 138, 0, .5)'
    const LEVEL_4_COLOR = 'rgba(255, 0, 0, .5)'
    // mock
    return {
      animation: false,
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(50, 50, 50, 0.7)',
        borderColor: 'transparent',
        textStyle: {
          color: '#fff'
        }
      },
      color: ['rgba(53, 171, 106)', 'rgba(53, 132, 146)', 'rgba(255, 138, 0)', 'rgba(255, 0, 0)',],
      legend: {
        icon: 'roundRect',
        textStyle: {
          color: '#fff'
        },
        right: 60,
        top: 20,
        selectedMode: false,
        data: ['一级预警', '二级预警', '三级预警', '四级预警']
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xData,
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        }
      },
      yAxis: {
        max: 80,
        min: -12,
        name: '监测信息\n(℃)',
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        }
      },
      series: [{
        name: '传感器1',
        type: 'line',
        markLine: {
          symbol: ['none', 'none'],//去掉箭头
          lineStyle: {
            type: "solid",
            color: "#ff9c34",
          },
          data: [{ yAxis: 60 }, { yAxis: -10 }],
        },
        markArea: {
          itemStyle: { color: LEVEL_4_COLOR },
          data: [[{ yAxis: 80 }, { yAxis: 75 }]]
        },
        data,
        itemStyle: {
          normal: {
            color: '#2068cb',
            lineStyle: {
              color: '#00ff00'
            }
          }
        },
      }, {
        type: 'line',
        markArea: {
          itemStyle: { color: LEVEL_3_COLOR },
          data: [[{ yAxis: 75 }, { yAxis: 70 }]]
        }
      }, {
        type: 'line',
        markArea: {
          itemStyle: { color: LEVEL_2_COLOR },
          data: [[{ yAxis: 70 }, { yAxis: 65 }]]
        }
      }, {
        type: 'line',
        markArea: {
          itemStyle: { color: LEVEL_1_COLOR },
          data: [[{ yAxis: 65 }, { yAxis: 60 }]]
        }
      }, {
        name: '四级预警',
        type: 'line',
        markArea: {
          itemStyle: { color: LEVEL_1_COLOR },
          data: [[{ yAxis: 20 }, { yAxis: 10 }]]
        }
      }, {
        name: '三级预警',
        type: 'line',
        markArea: {
          itemStyle: { color: LEVEL_2_COLOR },
          data: [[{ yAxis: 10 }, { yAxis: 5 }]]
        }
      }, {
        name: '二级预警',
        type: 'line',
        markArea: {
          itemStyle: { color: LEVEL_3_COLOR },
          data: [[{ yAxis: 5 }, { yAxis: 0 }]]
        }
      }, {
        name: '一级预警',
        type: 'line',
        markArea: {
          itemStyle: { color: LEVEL_4_COLOR },
          data: [[{ yAxis: 0 }, { yAxis: -12 }]]
        }
      }],
    }
  }

  $lulib.methodProxy.bindMethodProxy([{ dom: 'body', domStr: '.instrument-item', method: handleInstrument }])
})
