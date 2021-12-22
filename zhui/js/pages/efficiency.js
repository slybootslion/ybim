layui.use([], () => {
  const $ = layui.$
  const luUtils = layui.LuUtils
  const echarts = layui.echarts
  const dropdown = layui.dropdown

  const yearTxt = new Date().getFullYear()

  class PageTemplate {
    templateLeft (data) {
      const { block1, block2 } = data
      return `
        <div class="block1 block">
          <div class="block-title">${block1.title}</div>
          <div class="block-content">
            <div class="charts-box">
              <div class="charts-item">
                <div class="charts-top">
                  <div class="top-left">用电统计</div>
                  <div class="top-btn-box">
                    <div class="btn-item date active">本日</div>
                    <div class="btn-item date">本月</div>
                    <div class="btn-item" id="selectYears0">${yearTxt} ></div>
                  </div>
                </div>
                <div class="charts-line-pie" id="echarts1"></div>
              </div>
              <div class="charts-item">
                <div class="charts-top">
                  <div class="top-left">用电量占比</div>
                  <div class="top-btn-box">
                    <div class="btn-item date active">本日</div>
                    <div class="btn-item date">本月</div>
                    <div class="btn-item" id="selectYears1">${yearTxt} ></div>
                  </div>
                </div>
                <div class="charts-line-pie" id="echarts2"></div>
              </div>
              <div class="charts-item">
                <div class="charts-top">
                  <div class="top-left">月度节能情况</div>
                  <div class="top-btn-box">
                    <div class="top-signs">同比增长</div>
                    <div class="top-signs blue">均值<br/>(kwh)</div>
                  </div>
                </div>
                <div class="charts-line-bar" id="echarts3"></div>
              </div>
            </div>
          </div>
        </div>
      `
    }

    templateRight (data) {
      const { block1, block2, block3 } = data
      return `
      <div class="block1 block">
        <div class="block-title">
          <div class="title">${block1.title}</div>
          <div class="top-btn-box">
            <div class="btn-item date active">本日</div>
            <div class="btn-item date">本月</div>
            <div class="btn-item" id="selectYears2">${yearTxt} ></div>
          </div>
        </div>
        <div class="block-content">
          <div class="info-box"></div>
          <div class="right-charts" id="echarts4"></div>
        </div>
      </div>
      <div class="block2 block">
        <div class="block-title">
          <div class="title">${block2.title}</div>
          <div class="top-btn-box">
            <div class="btn-item date active">本日</div>
            <div class="btn-item date">本月</div>
            <div class="btn-item" id="selectYears3">${yearTxt} ></div>
          </div>
        </div>
        <div class="block-content">
          <div class="info-box"></div>
          <div class="right-charts" id="echarts5"></div>
        </div>
      </div>
      <div class="block3 block">
        <div class="block-title">
          <div class="title">${block3.title}</div>
          <div class="top-btn-box">
            <div class="btn-item date active">本日</div>
            <div class="btn-item date">本月</div>
            <div class="btn-item" id="selectYears4">${yearTxt} ></div>
          </div>
        </div>
        <div class="block-content">
          <div class="info-box"></div>
          <div class="right-charts" id="echarts6"></div>
        </div>
      </div>
      `
    }
  }

  const pt = new PageTemplate
  let pageData
  ;(async () => {
    pageData = await luUtils.ajax('/zhui/mock/efficiencyData.json')
    await luUtils.delay(500)
    render()
    bindBtnMethod()
  })()

  function render () {
    const { left, right } = pageData
    const leftHtml = pt.templateLeft(left)
    const rightHtml = pt.templateRight(right)
    $(".content-body .left").html(leftHtml)
    $(".content-body .right").html(rightHtml)
    handlerEcharts(pageData)
    leftEchartsYearSelectRender()
  }

  function bindBtnMethod () {
    $(".content-body").on('click', '.btn-item.date', function () {
      const $this = $(this)
      const type = $this.html() === '本月' ? 'month' : 'day'
      const contentTitle = findContentTitle($this)
      const idx = findEchartsBoxIndex(contentTitle)
      dateBtnItemClick($this, { type, idx })
    })
  }

  function handlerEcharts (data, selected = null) {
    const echarts1 = echarts.init(document.querySelector('#echarts1'))
    const echarts2 = echarts.init(document.querySelector('#echarts2'))
    const echarts3 = echarts.init(document.querySelector('#echarts3'))

    const echarts4 = echarts.init(document.querySelector('#echarts4'))
    const echarts5 = echarts.init(document.querySelector('#echarts5'))
    const echarts6 = echarts.init(document.querySelector('#echarts6'))

    const leftData = data.left.block1
    const rightData1 = data.right.block1
    const rightData2 = data.right.block2
    const rightData3 = data.right.block3

    if (selected) {
      const { idx, type } = selected
      if (idx === 0) echarts1.setOption(echartsOpts1(chartsDataMakerLine(leftData, 1, type)))
      if (idx === 1) echarts2.setOption(echartsOpts2(leftChartsDataMakerPie(type)))

      if (idx === 2) echarts4.setOption(echartsOpts1(chartsDataMakerLine(rightData1, 1, type)))
      if (idx === 3) echarts5.setOption(echartsOpts3(rightChartsDataMakerBar(rightData2, type)))
      if (idx === 4) echarts6.setOption(echartsOpts3(rightChartsDataMakerBar(rightData3, type)))
      return
    }

    function chartsDataMakerLine (d, type, dateType) {
      let data = d['data' + type]
      return {
        title: data.unit,
        data: data[dateType + 'Data'],
        names: data.names,
      }
    }

    function leftChartsDataMakerPie (dateType) {
      return {
        data: leftData.data2[dateType + 'Data']
      }
    }

    function rightChartsDataMakerBar (d, dateType) {
      const data = d[dateType + 'Data']
      return {
        title: d.unit,
        xData: d.xData,
        data
      }
    }

    echarts1.setOption(echartsOpts1(chartsDataMakerLine(leftData, 1, 'day')))
    echarts2.setOption(echartsOpts2(leftChartsDataMakerPie('day')))
    echarts3.setOption(echartsOpts4(leftData.data3))

    echarts4.setOption(echartsOpts1(chartsDataMakerLine(rightData1, 1, 'day')))
    echarts5.setOption(echartsOpts3(rightChartsDataMakerBar(rightData2, 'day')))
    echarts6.setOption(echartsOpts3(rightChartsDataMakerBar(rightData3, 'day')))
  }

  function echartsOpts1 (data = {}) {
    const { data: d, title: name } = data
    const colorData = {
      1: { c1: ['#0381d9'], c2: [{ t: '#0381d980', b: '#0381d980' }] },
      2: { c1: ['#134a70', '#fcb740'], c2: [{ t: '#134a70ff', b: '#134a7080' }, { t: '#fcb740ff', b: '#fcb74080' }] }
    }
    const opts = {
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
            color: '#00c0ff'
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
        top: '20%',
        containLabel: true,
      },
      series: (() => {
        const arr = []
        const color = colorData[d.seriesData.length]
        for (let i = 0; i < d.seriesData.length; i++) {
          const series = d.seriesData[i]
          const obj = {
            data: [...series],
            type: 'line',
            itemStyle: {
              color: color.c1[i]
            },
            lineStyle: {
              color: color.c1[i]
            },
            z: i === 0 ? 0 : 1,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: color.c2[i].t,
                },
                {
                  offset: 1,
                  color: color.c2[i].b,
                }
              ])
            }
          }
          if (d.seriesData.length > 1) obj.name = data.names[i]
          arr.push(obj)
        }
        return arr
      })()
    }
    if (d.seriesData.length > 1) {
      opts.legend = {
        data: ['总用水', '总排污'],
        x: 'right',
        y: 'top',
        textStyle: { color: '#c6c6c6', }
      }
    }
    return opts
  }

  function echartsOpts2 (data = {}) {
    const colorList = ['#61b5e0', '#d8ca74', '#14a7e2', '#bfa55f', '#0962b6']
    const colorList2 = ['#47c8ff', '#ffe042', '#2ec1ff', '#ffcc39', '#128dff']
    return {
      legend: {
        orient: 'vertical',
        left: 'right',
        icon: 'circle',
        align: 'left',
        bottom: 0,
        textStyle: {
          color: '#c6c6c6',
        }
      },
      graphic: {
        elements: [{
          type: 'image',
          style: {
            image: '/zhui/images/pages/Pie.png',
            width: 140,
            height: 140,
          },
          left: 0,
          top: 'center'
        }]
      },
      grid: {
        left: '0',
        right: '0',
        bottom: '0',
        top: '0',
        containLabel: true
      },
      series: [
        {
          type: 'pie',
          roseType: 'area',
          radius: '80%',
          center: ['24%', '50%'],
          label: {
            show: false
          },
          data: data.data,
          itemStyle: {
            color (params) {
              return new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                offset: 0,
                color: colorList[params.dataIndex] + '80'
              }, {
                offset: 1,
                color: colorList2[params.dataIndex] + 'c0'
              }])
            }
          }
        }
      ]
    }
  }

  function echartsOpts3 (data = {}) {
    const colorList = ['#0381d9', '#00f8ff']
    return {
      grid: {
        left: '0',
        right: '0',
        bottom: '0',
        top: '20%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: data.xData,
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
        name: data.title,
        nameTextStyle: {
          color: '#c6c6c6',
        },
        axisLabel: {
          textStyle: {
            color: '#00c0ff'
          }
        },
        splitLine: {
          lineStyle: {
            color: '#5c5c5c80',
          }
        }
      },
      series: [
        {
          data: data.data,
          type: 'bar',
          barWidth: '12',
          itemStyle: {
            color (params) {
              return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: colorList[0] },
                { offset: 1, color: colorList[1] }
              ])
            }
          },
        }
      ]
    }
  }

  function echartsOpts4 (data = {}) {
    console.log(data)
    let { dataBar, dataLine, xData } = data
    return {
      xAxis: {
        type: 'category',
        data: xData,
        axisTick: {
          alignWithLabel: true,
          show: false,
        },
        axisLabel: {
          textStyle: {
            color: '#fff'
          }
        },
      },
      yAxis: [
        {
          type: 'value',
          nameTextStyle: {
            color: '#c6c6c6',
          },
          axisLabel: {
            textStyle: {
              color: '#86cdff'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#5c5c5c26',
            }
          },
        },
        {
          type: 'value',
          nameTextStyle: {
            color: '#c6c6c6',
          },
          axisLabel: {
            textStyle: {
              color: '#86cdff'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#5c5c5c26',
            }
          },
        },
      ],
      grid: {
        left: '0',
        right: '0',
        bottom: '0',
        top: '20%',
        containLabel: true
      },
      series: [
        {
          name: 'bar1',
          type: 'bar',
          barGap: '-100%',
          barWidth: 10,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#00c0ff' },
              { offset: 0.4, color: '#00c0ff89' },
              { offset: 1, color: 'rgba(20,200,212,0)' }
            ])
          },
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(0,0,0,.2)'
          },
          z: -22,
          data: dataBar
        },
        {
          name: 'dotted',
          type: 'pictorialBar',
          barWidth: 10,
          symbol: 'rect',
          itemStyle: {
            color: 'rgba(0,0,0,1)'
          },
          symbolRepeat: true,
          symbolSize: [20, 2],
          symbolMargin: 3,
          z: -10,
          data: dataBar
        },
        {
          name: 'line',
          symbol: "none",
          type: 'line',
          yAxisIndex: 1,
          data: dataLine,
          smooth: true,
          itemStyle: {
            normal: {
              lineStyle: {
                color: '#f4b140'
              }
            }
          }
        }
      ]
    }
  }

  function leftEchartsYearSelectRender () {
    for (let i = 0; i < 5; i++) {
      dropdown.render({
        elem: '#selectYears' + i,
        data: [{ id: 1, title: yearTxt }, { id: 2, title: yearTxt - 1 }, { id: 3, title: yearTxt - 2 }],
        click (obj) {
          const $el = $(this.elem[0])
          $el.html(obj.title + ' >')
          const $this = $(this.elem[0])
          const contentTitle = findContentTitle($this)
          const idx = findEchartsBoxIndex(contentTitle)
          dateBtnItemClick($this, { type: 'year', idx })
        }
      })
    }
  }

  function dateBtnItemClick (el, data = {}) {
    const { type, idx } = data
    const isActive = el.hasClass('active')
    if (isActive) return
    el.addClass('active').siblings('.btn-item').removeClass('active')
    handlerEcharts(pageData, { type, idx })
  }

  function findContentTitle ($this) {
    const chartsTop = $this.parents('.charts-top')
    let contentTitle
    if (chartsTop.length) {
      contentTitle = $this.parents('.charts-top').find('.top-left').html()
    } else {
      contentTitle = $this.parents('.block-title').find('.title').html()
    }
    return contentTitle
  }

  function findEchartsBoxIndex (contentTitle) {
    let idx = null
    switch (contentTitle) {
      case '用电统计':
        idx = 0
        break
      case '用电量占比':
        idx = 1
        break
      case '给排水统计':
        idx = 2
        break
      case '区域用气统计':
        idx = 3
        break
      case '区域用热量':
        idx = 4
        break
      default:
        break
    }
    return idx
  }
})
