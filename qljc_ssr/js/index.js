$(document).ready(function () {
  const $ = jQuery
  const bridgeData = {
    1: {
      name: '化龙沟大桥',
      width: 2406,
      height: 780,
      url: 'hualonggou',
      points: [
        { cname: 'wy', id: 'WY5', value: '113.14mm', top: 28, left: 142 },
        { cname: 'lf', id: 'LF14', value: '1mm', top: 298, left: 152 },
        { cname: 'lf', id: 'LF13', value: '-0.07mm', top: 360, left: 152 },
        { cname: 'lf', id: 'LF16', value: '1mm', top: 422, left: 152 },
        { cname: 'wy', id: 'WY6', value: '129.55mm', top: 552, left: 141 },
        { cname: 'jsd', id: 'ZD03', value: '23mg', top: 17, left: 1242 },
        { cname: 'lf', id: 'LF18', value: '-0.22mm', top: 66, left: 1242 },
        { cname: 'wd', id: 'WS4', value: '9,5℃', top: 180, left: 1242 },
        { cname: 'sd', id: 'WS3', value: '83.6%', top: 220, left: 1242 },
        { cname: 'jsd', id: 'ZD04', value: '-37.68mg', top: 18, left: 1792 },
        { cname: 'lf', id: 'LF15', value: '-0.24mm', top: 180, left: 1792 },
        { cname: 'lf', id: 'LF20', value: '0.12mm', top: 301, left: 1792 },
        { cname: 'lf', id: 'LF19', value: '-0.12mm', top: 360, left: 1792 },
        { cname: 'lf', id: 'LF17', value: '0.11mm', top: 421, left: 1792 },
        { cname: 'wy', id: 'WY8', value: '129.55mm', top: 26, left: 2062 },
        { cname: 'wy', id: 'WY7', value: '129.55mm', top: 554, left: 2062 },
      ]
    },
    2: {
      name: '康峪沟大桥',
      width: 2405,
      height: 780,
      url: 'kangyugou',
      points: [
        { cname: 'wy', id: 'WY12', value: '113.14mm', top: 0, left: 142 },
        { cname: 'lf', id: 'LF24', value: '1mm', top: 298, left: 152 },
        { cname: 'lf', id: 'LF28', value: '-0.07mm', top: 360, left: 152 },
        { cname: 'lf', id: 'LF27', value: '1mm', top: 478, left: 152 },
        { cname: 'lf', id: 'LF22', value: '1mm', top: 515, left: 152 },
        { cname: 'wy', id: 'WY9', value: '129.55mm', top: 552, left: 141 },
        { cname: 'lf', id: 'LF21', value: '1mm', top: 0, left: 705 },
        { cname: 'jsd', id: 'ZD05', value: '23mg', top: 0, left: 1242 },
        { cname: 'lf', id: 'LF25', value: '-0.22mm', top: 39, left: 1242 },
        { cname: 'lf', id: 'LF26', value: '1mm', top: 298, left: 152 },
        { cname: 'sd', id: 'WS5', value: '83.6%', top: 238, left: 1242 },
        { cname: 'wd', id: 'WS6', value: '8.5℃', top: 273, left: 1242 },
        { cname: 'jsd', id: 'ZD06', value: '-37.68mg', top: 0, left: 1792 },
        { cname: 'lf', id: 'LF23', value: '-0.24mm', top: 40, left: 1792 },
        { cname: 'wy', id: 'WY10', value: '129.55mm', top: 0, left: 2062 },
        { cname: 'wy', id: 'WY11', value: '129.55mm', top: 538, left: 2062 },
      ]
    },
    3: {
      name: '西甘村大桥',
      width: 2842,
      height: 780,
      url: 'xigancun',
      points: [
        { cname: 'wy', id: 'WY04', value: '113.14mm', top: 20, left: 101 },
        { cname: 'lf', id: 'LF05', value: '1mm', top: 56, left: 101 },
        { cname: 'wy', id: 'WY01', value: '114.69mm', top: 516, left: 101 },
        { cname: 'lf', id: 'LF09', value: '1mm', top: 123, left: 1000 },
        { cname: 'lf', id: 'LF12', value: '0.15mm', top: 269, left: 1000 },
        { cname: 'lf', id: 'LF08', value: '0.55mm', top: 287, left: 1440 },
        { cname: 'jsd', id: 'ZD01', value: '19.1mg', top: 23, left: 1884 },
        { cname: 'lf', id: 'LF02', value: '-0.22mm', top: 236, left: 1884 },
        { cname: 'lf', id: 'LF04', value: '0.11mm', top: 268, left: 1884 },
        { cname: 'lf', id: 'LF01', value: '-0.22mm', top: 200, left: 2101 },
        { cname: 'lf', id: 'LF10', value: '0.13mm', top: 232, left: 2101 },
        { cname: 'sd', id: 'WS01', value: '83.6%', top: 269, left: 2101 },
        { cname: 'wd', id: 'WS02', value: '8.5℃', top: 300, left: 2101 },
        { cname: 'jsd', id: 'ZD02', value: '33.16mg', top: 20, left: 2325 },
        { cname: 'lf', id: 'LF06', value: '-0.24mm', top: 304, left: 2325 },
        { cname: 'lf', id: 'LF11', value: '-0.22mm', top: 413, left: 2325 },
        { cname: 'wy', id: 'WY02', value: '119.16mm', top: 20, left: 2542 },
        { cname: 'lf', id: 'LF07', value: '0.19mm', top: 431, left: 2542 },
        { cname: 'lf', id: 'LF03', value: '0.19mm', top: 466, left: 2542 },
        { cname: 'wy', id: 'WY03', value: '119.16mm', top: 513, left: 2542 },
      ]
    }
  }
  let echartsObj, echartsTimer, luLayer, pointList;

  page_init()

  function page_init () {
    const { bridgeId } = $lulib.getAllUrlParams()
    pointList = bridgeData[bridgeId].points
    const data = bridgeData[bridgeId]
    if (!data) throw new Error("桥梁id未传入或者错误")

    $(".bridge-name").html(data.name)

    let html = ''
    for (let i = 0; i < data.points.length; i++) {
      const item = data.points[i]
      const style = `top:${item.top}px; left:${item.left}px`
      html += `<div class="instrument-item ${item.cname}" 
                    data-id="${item.id}" 
                    style="${style}">
        <span class="num-text">${item.id}:${item.value}</span>
      </div>`
    }
    const { height } = $lulib.domWidthHeight('.bridge-box')
    const marginHeight = (height - 130 - data.height) / 2
    $(".bridge-pic").css({
      width: data.width, height: data.height, "margin-top": marginHeight,
      "background-image": `url('./images/0_${data.url}.png')`
    }).html(html)
  }

  $lulib.methodProxy.bindMethodProxy([{ dom: '.bridge-pic', domStr: '.instrument-item', method: handleInstrument }])

  function layerEchartsTemplate (info) {
    const picDict = {
      ST01: './images/pic3.gif',
      ST05: './images/pic3.gif',
      ST03: './images/pic2.gif',
      ST02: './images/pic1.gif',
      ST04: './images/pic1.gif',
    }
    return `<div class="echarts-layer-box">
        <div class="top-info-box">
          <h5 class="info-title">${info.sensor_name}</h5>
          <div class="info-container">
            <div class="pic">
              <img src="${picDict[info.sensor_type]}" alt="">
            </div>
            <div class="info-list">
              <div class="info-item">
                <div class="label">类型：</div>
                <div class="desc">${info.TypeName}</div>
              </div>
              <div class="info-item">
                <div class="label">量程：</div>
                <div class="desc">${info.RangeExplain}</div>
              </div>
              <div class="info-item">
                <div class="label">工作温度：</div>
                <div class="desc">${info.WorkingTemps}</div>
              </div>
              <div class="info-item">
                <div class="label">备注：</div>
                <div class="desc">${info.Abstract}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="echarts-box" id="echartsContainer"></div>
      </div>`
  }

  async function handleInstrument () {
    const id = $(this).data().id
    const point = pointList.find(p => p.id === id)
    const idx = layer.load(1)
    const res = await $lulib.ajax(`https://s107.jiaohuilian.com/sensor/v1/bridge.php?type=info&sensor_code=${point.sensorCode}`)
    layer.close(idx)
    const opts = {
      title: '设备信息',
      id: 'instrumentEchartsForm',
      area: ['1178px', '668px'],
      content: layerEchartsTemplate(res.sinfo),
      cancel: () => {
        echartsObj = null
        clearInterval(echartsTimer)
        echartsTimer = null
      }
    }
    luLayer = new $lulib.Lulayer(opts)
    await $lulib.delay(300)
    await renderEcharts(id)
  }

  async function renderEcharts (id) {
    const sensorCode = pointList.find(p => p.id === id).sensorCode
    // mock
    const chartDom = document.querySelector('#echartsContainer');
    echartsObj = echarts.init(chartDom)
    const opts = await getEchartsOptions(sensorCode)
    const run = async () => {
      // 这里按时间请求log
      // const res = await $lulib.ajax(`https://s107.jiaohuilian.com/sensor/v1/bridge.php?type=log&sensor_code=1669689102-B2020001-S202000014`)
      makeData()
      echartsObj.setOption(opts)
    }
    run()
    echartsTimer = setInterval(run, 3000)
  }

  function showSensor () {
    const idx = layer.load(1)
    $.ajax({
      type: "Get",
      url: "https://s107.jiaohuilian.com/sensor/v1/bridge.php?type=marks",
      dataType: "json",
      success: function (data) {
        if (data["code"] === 0)
          makeAllSensor(data["data"])
        layer.close(idx)
      }
    })
  }

  function makeAllSensor (inData) {
    const makeMark = data => {
      const point = pointList.find(p => p.id === data.sensor_name)
      point && (point.sensorCode = data.id.split('|')[1])
    }
    for (let i in inData)
      makeMark(inData[i])
  }

  showSensor()

  let data = [], xData = []

  function makeData () {
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

  async function getEchartsOptions (sensorCode) {
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
})
