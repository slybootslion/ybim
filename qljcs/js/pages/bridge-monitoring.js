layui.use(['LuCommonTemplate', 'echarts'], function () {
  const $ = layui.$
  const LuSearchForm = layui.LuSearchForm
  const LuLayer = layui.LuLayer
  const echarts = layui.echarts
  let luSearchForm, luLayer, currentData, echartsObj

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
    // const { id } = $(this).data()
    let id = 'a5'
    const instrument = currentData.instrumentList.find(item => item.id === id)
    const title = `${instrument.name} ${iconDict[instrument.type].name}`
    const content = pt.layerEchartsTemplate(instrument)
    const opts = {
      title,
      id: 'instrumentEchartsForm',
      area: ['1178px', '668px'],
      content,
      cancel: () => echartsObj = null
    }
    luLayer = new LuLayer(opts)

    await renderEcharts(id)
  }

  async function renderEcharts (id) {
    // mock
    const opts = await getEchartsOptions(id)
    await $lulib.delay(200)
    const chartDom = document.querySelector('#echartsContainer');
    echartsObj = echarts.init(chartDom)
    echartsObj.setOption(opts)
  }

  async function getEchartsOptions (id) {
    return {
      xAxis: {
        type: 'category',
        boundaryGap: false
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '30%']
      },
      visualMap: {
        type: 'piecewise',
        show: false,
        dimension: 0,
        seriesIndex: 0,
        pieces: [
          {
            gt: 1,
            lt: 3,
            color: 'rgba(0, 0, 180, 0.4)'
          },
          {
            gt: 5,
            lt: 7,
            color: 'rgba(0, 0, 180, 0.4)'
          }
        ]
      },
      series: [
        {
          type: 'line',
          smooth: 0.6,
          symbol: 'none',
          lineStyle: {
            color: '#5470C6',
            width: 5
          },
          markLine: {
            symbol: ['none', 'none'],
            label: { show: false },
            data: [{ xAxis: 1 }, { xAxis: 3 }, { xAxis: 5 }, { xAxis: 7 }]
          },
          areaStyle: {},
          data: [
            ['2019-10-10', 200],
            ['2019-10-11', 560],
            ['2019-10-12', 750],
            ['2019-10-13', 580],
            ['2019-10-14', 250],
            ['2019-10-15', 300],
            ['2019-10-16', 450],
            ['2019-10-17', 300],
            ['2019-10-18', 100]
          ]
        }
      ]
    }
  }

  $lulib.methodProxy.bindMethodProxy([{ dom: 'body', domStr: '.instrument-item', method: handleInstrument }])
})
