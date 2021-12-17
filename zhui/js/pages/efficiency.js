layui.use([], () => {
  const $ = layui.$
  const luUtils = layui.LuUtils
  const echarts = layui.echarts
  const dropdown = layui.dropdown

  const yearTxt = new Date().getFullYear()

  class PageTemplate {
    templateLeft (data) {
      const { block1 } = data
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
            <div class="btn-item active">本日</div>
            <div class="btn-item">本月</div>
            <div class="btn-item" id="selectYears2">${yearTxt} ></div>
          </div>
        </div>
        <div class="block-content">
          <div class="info-box"></div>
          <div class="right-charts" id="echarts4"></div>
        </div>
      </div>
      <div class="block1 block">
        <div class="block-title">
          <div class="title">${block2.title}</div>
          <div class="top-btn-box">
            <div class="btn-item active">本日</div>
            <div class="btn-item">本月</div>
            <div class="btn-item" id="selectYears3">${yearTxt} ></div>
          </div>
        </div>
        <div class="block-content">
          <div class="info-box"></div>
          <div class="right-charts" id="echarts5"></div>
        </div>
      </div>
      <div class="block1 block">
        <div class="block-title">
          <div class="title">${block3.title}</div>
          <div class="top-btn-box">
            <div class="btn-item active">本日</div>
            <div class="btn-item">本月</div>
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
      const contentTitle = $this.parents('.charts-top').find('.top-left').html()
      const idx = findEchartsBoxIndex(contentTitle)
      dateBtnItemClick($this, { type, idx })
    })
  }

  function handlerEcharts (data, selected = null) {
    const echarts1 = echarts.init(document.querySelector('#echarts1'))
    const echarts2 = echarts.init(document.querySelector('#echarts2'))

    const leftData = data.left.block1

    if (selected) {
      const { idx, type } = selected
      if (idx === 0) echarts1.setOption(echartsOpts3(leftChartsDataMakerLine(1, type)))
      if (idx === 1) echarts2.setOption(echartsOpts4(leftChartsDataMakerPie(type)))
      return
    }

    function leftChartsDataMakerLine (type, dateType) {
      let data = leftData['data' + type]
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

    echarts1.setOption(echartsOpts3(leftChartsDataMakerLine(1, 'day')))
    echarts2.setOption(echartsOpts4(leftChartsDataMakerPie('day')))
  }

  function echartsOpts3 (data = {}) {
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

  function echartsOpts4 (data = {}) {
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

  function leftEchartsYearSelectRender () {
    for (let i = 0; i < 5; i++) {
      dropdown.render({
        elem: '#selectYears' + i,
        data: [{ id: 1, title: yearTxt }, { id: 2, title: yearTxt - 1 }, { id: 3, title: yearTxt - 2 }],
        click (obj) {
          const $el = $(this.elem[0])
          $el.html(obj.title + ' >')
          const $this = $(this.elem[0])
          const contentTitle = $this.parents('.charts-top').find('.top-left').html()
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

  function findEchartsBoxIndex (contentTitle) {
    let idx = null
    switch (contentTitle) {
      case '用电统计':
        idx = 0
        break
      case '用电量占比':
        idx = 1
        break
      default:
        break
    }
    return idx
  }
})
