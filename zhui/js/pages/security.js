layui.use([], () => {
  const $ = layui.$
  const luUtils = layui.LuUtils
  const echarts = layui.echarts

  class PageTemplate {
    templateLeft (data) {
      const { block3, block2, block1 } = data
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
      const leftBlockTemp = this.leftBlock1Template(block1.info.day)
      return `
      <div class="block1 block">
        <div class="block-title">
          <div class="title">${block1.title}</div>
          <div class="top-btn-box">
            <div class="btn-item active">今日</div>
            <div class="btn-item">历史</div>
          </div>
        </div>
        <div class="block-content">
          <div class="block1-content">${leftBlockTemp}</div>
        </div>
      </div>
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

    templateRight (data) {
      const { block1, block2 } = data
      let videoHtml = ''
      for (let i = 0; i < block1.data.length; i++) {
        const item = block1.data[i]
        videoHtml += `<div class="video-item"><div class="pic-box"><img src="${item.pic}" alt=""></div><div class="pic-info txt-overflow">${item.title}</div></div>`
      }
      return `<div class="block1 block">
                <div class="block-title">
                  <div class="title">${block1.title}</div>
                </div>
                <div class="video-content">${videoHtml}</div>
              </div>
              <div class="block2 block">
                <div class="block-title">
                  <div class="title">${block2.title}</div>
                </div>
                <div class="security-content">
                  <div class="top">
                    <div class="top-item active">
                      <div class="num">100%</div>
                      <div class="txt">在岗率</div>
                    </div>
                    <div class="top-item">
                      <div class="num">${block2.data.info.total}人</div>
                      <div class="txt">总人数</div>
                    </div>
                    <div class="top-item">
                      <div class="num">${block2.data.info.onDuty}人</div>
                      <div class="txt">当前在岗人数</div>
                    </div>
                  </div>
                  <div class="charts-bar" id="echarts2"></div>
                </div>
              </div>`
    }

    leftBlock1Template (data) {
      const count = data.top.reduce((a, b) => a.num + b.num)

      function makeItemHtml (data) {
        let html = ''
        for (let i = 0; i < data.length; i++) {
          const item = data[i]
          const zeroClass = item.num === 0 ? 'zero' : ''
          html += `<div class="num-item"><div class="num ${zeroClass}">${item.num}${item.num ? '次' : ''}</div><div class="label">${item.label}</div></div>`
        }
        return html
      }

      const topHtml = makeItemHtml(data.top)
      const bottomHtml = makeItemHtml(data.bottom)
      return `<div class="block1-left">
                <div class="circle-bg"></div>
                <div class="num-circle centerXY">
                  <div class="num txt-overflow">${count}次</div>
                  <div class="label">总数</div>
                </div>
              </div>
              <div class="block1-right">
                <div class="num-block">${topHtml}</div>
                <div class="line"></div>
                <div class="num-block">${bottomHtml}</div>
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
    const { left, right } = pageData
    const leftHtml = pt.templateLeft(left)
    const rightHtml = pt.templateRight(right)
    $(".content-body .left").html(leftHtml)
    $(".content-body .right").html(rightHtml)
  }

  function handlerEcharts (data, selected = null) {
    const echarts1 = echarts.init(document.querySelector('#echarts1'))
    const echarts2 = echarts.init(document.querySelector('#echarts2'))
    const leftData = data.left.block2.data
    const rightData = data.right.block2.data.list

    if (selected) {
      const { type, idx } = selected
      if (idx === 1) echarts1.setOption(echartsOpts1(leftChartsDataMakerLine(type)))
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
    echarts2.setOption(echartsOpts2(rightData))

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

      const infoBox = $(".block2 .info-box")
      info ? infoBox.html(makeTxt()) : infoBox.html('')
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
              color: '#86cdff'
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

    function echartsOpts2 (data = {}) {
      let { data: d, xData } = data
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
        yAxis: {
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
          max: 40,
          splitNumber: 5,
        },
        grid: {
          left: '0',
          right: '0',
          bottom: '15%',
          top: '15%',
          containLabel: true
        },
        series: [
          {
            name: 'line',
            type: 'bar',
            barGap: '-100%',
            barWidth: 20,
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
            data: d
          },
          {
            name: 'dotted',
            type: 'pictorialBar',
            symbol: 'rect',
            itemStyle: {
              color: 'rgba(0,0,0,1)'
            },
            symbolRepeat: true,
            symbolSize: [20, 2],
            symbolMargin: 3,
            z: -10,
            data: d
          },
          // {
          // data: d,
          // type: 'pictorialBar',
          // barWidth: 20,
          // symbol: 'image://images/common/BIM-bg.jpg',
          // symbolKeepAspect: true,
          // symbolSize: [20, '100%'],
          // symbolRepeat: true,
          // symbolMargin: '10%',
          // symbolClip: true,
          // itemStyle: {
          //   normal: {
          //     color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
          //       offset: 0,
          //       color: "red" // 0% 处的颜色
          //     }, {
          //       offset: 0.6,
          //       color: "blue" // 60% 处的颜色
          //     }, {
          //       offset: 1,
          //       color: "yellow" // 100% 处的颜色
          //     }], false)
          //   }
          // },
          // symbolSize: 20,
          // }
        ]
      }
    }
  }

  function bindLeftEchartsMethod () {
    $(".content-body .left").on('click', '.btn-item', function () {
      const $this = $(this)
      const isActive = $this.hasClass('active')
      if (isActive) return
      $this.addClass('active').siblings('.btn-item').removeClass('active')
      const idx = $this.parents('.block-title').find('.title').html() === '报警趋势' ? 1 : 0
      if (idx === 1) {
        const type = $this.html() === '本日' ? 'day' : $this.html() === '本周' ? 'week' : 'month'
        handlerEcharts(pageData, { idx, type })
      }
      if (idx === 0) {
        const type = $this.html() === '今日' ? 'day' : 'history'
        const data = pageData.left.block1.info[type]
        $(".left .block1-content").html(pt.leftBlock1Template(data))
      }
    })
  }


})
