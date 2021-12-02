layui.use([], () => {
  const $ = layui.$
  const luUtils = layui.LuUtils
  const echarts = layui.echarts

  class PageTemplate {
    templateLeft (data) {
      const { block3, block2 } = data
      let block3Html = ''
      for (let i = 0; i < block3.data.length; i++) {
        const item = block3.data[i]
        const levelTag = 'level' + item.level
        block3Html += `<div class="warning-item ${levelTag}">
          <span class="iconfont icon-jingshi"></span>
          <span class="desc txt-overflow">${item.info}</span>
          <span class="date">${item.date}</span>
        </div>`
      }

      return `
      <div class="block2 block">
        <div class="block-title">
          <div class="title">${block2.title}</div>
          <div class="top-btn-box">
            <div class="btn-item active">本日</div>
            <div class="btn-item">本周</div>
            <div class="btn-item">本月</div>
          </div>
        </div>
        <div class="block-content">
          <div class="info-box"></div>
          <div class="charts-line" id="echarts1"></div>
        </div>
      </div>
      <div class="block3 block">
        <div class="block-title">${block3.title}</div>
        <div class="warning-list">${block3Html}</div>
      </div>`
    }
  }

  const pt = new PageTemplate

  let pageData = null
  ;(async () => {
    pageData = await luUtils.ajax('/zhui/mock/securityData.json')
    await luUtils.delay(500)
    render()
    handlerEcharts(pageData)
    bindLeftEchartsMethod()
  })()

  function render () {
    const { left } = pageData
    const leftHtml = pt.templateLeft(left)
    $(".content-body .left").html(leftHtml)
  }

  function handlerEcharts (data, selected = null) {
    const echarts1 = echarts.init(document.querySelector('#echarts1'))
    const leftData = data.left.block2.data

    if (selected) {
      return
    }

    function leftChartsDataMakerLine (dateType) {
      const data = leftData[dateType + 'Data']
      return {
        name: data.unit,
        data: data,
        info: data.info,
        dateType,
      }
    }

    echarts1.setOption(echartsOpts1(leftChartsDataMakerLine('day')))

    function echartsOpts1 (data = {}) {
      const { data: d, name, info, dateType } = data

      function makeTxt () {
        const d = {
          day: '今天报警类型最多的为',
          week: '本周报警类型最多的为',
          month: '本月报警类型最多的为',
        }
        return `${d[dateType]}<span>${info}</span>`
      }

      info && $(".block2 .info-box").html(makeTxt())
      return {
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: [...d.xData],
          axisLabel: {
            textStyle: {
              color: '#fff'
            }
          },
          lineStyle: {
            color: '#c6c6c6'
          },
          axisTick: {
            show: false,
          },
        },
        yAxis: {
          type: 'value',
          name,
          nameTextStyle: {
            color: '#c6c6c6',
          },
          axisLabel: {
            textStyle: {
              color: '#0381d9'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#5c5c5c80',
            }
          }
        },
        grid: {
          left: '0',
          right: '0',
          bottom: '0',
          top: '5%',
          containLabel: true,
        },
        series: [
          {
            data: d.seriesData,
            type: 'line',
            itemStyle: {
              color: '#0381d9'
            },
            lineStyle: {
              color: '#0381d9'
            },
            areaStyle: { color: '#0381d990' }
          }
        ]
      }
    }
  }

  function bindLeftEchartsMethod () {

  }


})
