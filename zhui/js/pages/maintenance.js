layui.use([], () => {
  const $ = layui.$
  const luUtils = layui.LuUtils
  const dropdown = layui.dropdown

  class PageTemplate {
    templateLeft (data) {
      const { topBlock, block1 } = data
      const yearTxt = new Date().getFullYear()
      return `<div class="top-block">
                <div class="top-item">
                  <div class="label">工单总数</div>
                  <div class="num">${topBlock.count}个</div>
                </div>
                <div class="top-item">
                  <div class="label">完成率</div>
                  <div class="num">${topBlock.percent}%</div>
                </div>
              </div>
              <div class="block1 block">
                <div class="block-title">${block1.title}</div>
                <div class="block-content">
                  <div class="charts-box">
                    <div class="charts-item">
                      <div class="charts-top">
                        <div class="top-left">各类型工单数量占比</div>
                        <div class="top-btn-box">
                          <div class="btn-item date active">本日</div>
                          <div class="btn-item date">本月</div>
                          <div class="btn-item" id="selectYears1">${yearTxt} ></div>
                        </div>
                      </div>
                      <div class="charts-bar" id="echarts1"></div>
                    </div>
                    <div class="charts-item">
                      <div class="charts-top">
                        <div class="top-left">各类故障数量统计</div>
                        <div class="top-btn-box">
                          <div class="btn-item date active">本日</div>
                          <div class="btn-item date">本月</div>
                          <div class="btn-item" id="selectYears2">${yearTxt} ></div>
                        </div>
                      </div>
                      <div class="charts-bar" id="echarts2"></div>
                    </div>
                  </div>
                </div>
              </div>`
    }

    templateRight (data) {
      return ``
    }

  }

  const pt = new PageTemplate

  let pageData
  ;(async () => {
    pageData = await luUtils.ajax('/zhui/mock/maintenanceData.json')
    await luUtils.delay(500)
    render()
    bindLeftEChartsMethod()
  })()

  function render () {
    const { left, right } = pageData
    const leftHtml = pt.templateLeft(left)
    const rightHtml = pt.templateRight(right)
    $(".content-body .left").html(leftHtml)
    // $(".content-body .right").html(rightHtml)
    handlerEcharts(pageData.left.block1)
    rightEchartsYearSelectRender()
  }

  function handlerEcharts (data, selected = null) {
    const echarts1 = echarts.init(document.querySelector('#echarts1'))
    const echarts2 = echarts.init(document.querySelector('#echarts2'))
    const { data1, data2 } = data

    if (selected) {
      const { idx, type } = selected
      if (idx === 0) echarts1.setOption(echartsOptsBar(formatEchartsBar(data1, type)))
      if (idx === 1) echarts2.setOption(echartsOptsBar(formatEchartsBar(data2, type)))
      return
    }

    function formatEchartsBar (data, type) {
      const d = data[type + 'Data']
      return {
        name: data.unit,
        xData: data.xData,
        data: d,
      }
    }

    echarts1.setOption(echartsOptsBar(formatEchartsBar(data1, 'day')))
    echarts2.setOption(echartsOptsBar(formatEchartsBar(data2, 'day')))
  }

  function echartsOptsBar (data) {
    const colorList = [
      { c1: '#00a6ff', c2: '#00fefc' },
      { c1: '#ffb227', c2: '#90fe01' },
      { c1: '#ff2000', c2: '#ff8a00' },
    ]
    return {
      grid: {
        left: '10%',
        right: '0',
        bottom: '20%',
        top: '20%',
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
        name: data.name,
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
            color: '#5c5c5c80',
          }
        }
      },
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '15',
          data: data.data,
          itemStyle: {
            color (params) {
              return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: colorList[params.dataIndex].c1 },
                { offset: 1, color: colorList[params.dataIndex].c2 }
              ])
            }
          },
          label: {
            show: true,
            position: 'top',
            valueAnimation: true,
            textStyle: {
              color: '#fff',
              fontSize: 12,
            }
          }
        }
      ]
    }
  }

  function rightEchartsYearSelectRender () {
    const year = new Date().getFullYear()
    for (let i = 1; i <= 3; i++) {
      dropdown.render({
        elem: '#selectYears' + i,
        data: [{ id: 1, title: year }, { id: 2, title: year - 1 }, { id: 3, title: year - 2 }],
        click (obj) {
          const $el = $(this.elem[0])
          $el.html(obj.title + '>')
          const $this = $(this.elem[0])
          const contentTitle = $this.parents('.charts-top').find('.top-left').html()
          const idx = findEchartsBoxIndex(contentTitle)
          leftEchartsBtnItemClick($this, { type: 'year', idx })
        }
      })
    }
  }

  function leftEchartsBtnItemClick (el, selected) {
    const { type, idx } = selected
    const isActive = el.hasClass('active')
    if (isActive) return
    el.addClass('active').siblings('.btn-item').removeClass('active')
    handlerEcharts(pageData.left.block1, { type, idx })
  }

  function findEchartsBoxIndex (contentTitle) {
    let idx = null
    switch (contentTitle) {
      case '各类型工单数量占比':
        idx = 0
        break
      case '各类故障数量统计':
        idx = 1
        break
      default:
        break
    }
    return idx
  }

  function bindLeftEChartsMethod () {
    $(".left").on('click', '.btn-item.date', function () {
      const $this = $(this)
      const type = $this.html() === '本月' ? 'month' : 'day'
      const contentTitle = $this.parents('.charts-top').find('.top-left').html()
      const idx = findEchartsBoxIndex(contentTitle)
      leftEchartsBtnItemClick($this, { type, idx })
    })
  }
})
